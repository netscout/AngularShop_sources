using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AngularShop.Data;
using AngularShop.Models;
using AngularShop.Models.DTO;
using System.Text.Json;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Authorization;

namespace AngularShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ProductsController(
            ApplicationDbContext context,
            IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult<ApiResult<Product>>> GetProducts(
            int pageIndex = 0,
            int pageSize = 10,
            string sortColumn = null,
            string sortOrder = null,
            string filterColumn = null,
            string filterQuery = null)
        {
            return await ApiResult<Product>.CreateAsync(
                GetProducts(_context.Products),
                pageIndex,
                pageSize,
                sortColumn,
                sortOrder,
                filterColumn,
                filterQuery);
        }

        [HttpGet]
        [Route("ByCategory")]
        public async Task<ActionResult<ApiResult<Product>>> GetProducts(
            int pageIndex = 0,
            int pageSize = 10,
            string sortColumn = null,
            string sortOrder = null,
            int categoryId = 0)
        {
            try
            {
                IQueryable<Product> products = _context.Products;

                //제품 분류에 대한 검색이라면
                if (categoryId != 0)
                {
                    products = _context.Products
                        .FromSqlInterpolated(
$@"SELECT * FROM Products WHERE id IN 
    (SELECT ProductId FROM ProductCategories AS pc 
     INNER JOIN Categories AS c ON pc.CategoryId = c.Id WHERE c.Id = {categoryId})");
                }

                return await ApiResult<Product>.CreateAsync(
                    GetProducts(products),
                    pageIndex,
                    pageSize,
                    sortColumn,
                    sortOrder,
                    null,
                    null);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// 제품 목록 검색 데이터 소스 생성
        /// </summary>
        /// <param name="source">소스를 생성할 제품 목록 데이터</param>
        /// <returns></returns>
        private IQueryable<Product> GetProducts(
            IQueryable<Product> source)
        {
            return source
                    .AsNoTracking()
                    .Select(p => new Product
                    {
                        Id = p.Id,
                        Name = p.Name,
                        MakerName = p.Maker.Name,
                        Tags = p.Tags,
                        Price = p.Price,
                        Discount = p.Discount,
                        StockCount = p.StockCount,
                        IsVisible = p.IsVisible,
                        Categories = p.ProductCategories
                            .Select(_pc => _pc.Category).ToList(),
                        PhotoUrls = p.ProductImages
                            .Select(pi => pi.PhotoUrl).ToList(),
                        CreatedDate = p.CreatedDate,
                        ModifiedDate = p.ModifiedDate
                    });
        }

        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(long id)
        {
            var product =
                await _context.Products
                .AsNoTracking()
                .Select(p => new Product
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    MakerId = p.Maker.Id,
                    MakerName = p.Maker.Name,
                    Tags = p.Tags,
                    Price = p.Price,
                    Discount = p.Discount,
                    StockCount = p.StockCount,
                    IsVisible = p.IsVisible,
                    Categories = p.ProductCategories.Select(pc => pc.Category).ToList(),
                    PhotoUrls = p.ProductImages.Select(pi => pi.PhotoUrl).ToList()
                })
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }

        //관리자 권한 필요
        [Authorize(Roles = Constants.DefaultAdminRole)]
        [HttpPost]
        [Route("New")]
        public async Task<ActionResult> PostProduct([FromForm] ProductDTO req)
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            //json으로 전송된 제품 정보를 객체로 역직렬화
            var product = JsonSerializer.Deserialize<Product>(req.Product, options);

            var sortOrder = 1;

            //추가할 제품의 분류 목록 생성
            var productCategories = product.CategoryIds
                .Select(cid => new ProductCategory
                {
                    Product = product,
                    CategoryId = cid,
                    SortOrder = sortOrder++
                });

            //제품과 분류를 DB에 추가
            _context.Products.Add(product);
            _context.ProductCategories.AddRange(productCategories);

            await _context.SaveChangesAsync();

            //업로드된 이미지들을 /images/products로 옮기고
            //옮긴 경로를 목록으로 가져오기
            var productImages = await GetProductImages(product.Id, req.Photos);

            //DB에 업로드된 이미지 추가
            _context.ProductImages.AddRange(productImages);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                Id = product.Id
            });
        }

        //관리자 권한 필요
        [Authorize(Roles = Constants.DefaultAdminRole)]
        [HttpPost]
        [Route("Update")]
        public async Task<ActionResult> UpdateProduct([FromForm] ProductDTO req)
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            //json으로 전송된 제품 정보를 객체로 역직렬화
            var product = JsonSerializer.Deserialize<Product>(req.Product, options);

            long id = 0;
            if (!long.TryParse(req.Id, out id))
            {
                return BadRequest();
            }

            //업로드된 이미지들을 /images/products로 옮기고
            //옮긴 경로를 목록으로 가져오기
            var pis = await GetProductImages(id, req.Photos);

            //기존 이미지 경로 목록에 업로드된 목록을 합친다
            product.PhotoUrls.AddRange(
                pis.Select(pi => pi.PhotoUrl));

            //DB에서 기존에 등록된 이미지 목록 가져오기
            var productImages = _context.ProductImages
                .Where(pi => pi.ProductId == id);

            //기존에는 있었지만 없어진 이미지는 삭제
            var toDeleteProductImageList = productImages
                .Where(pi => product.PhotoUrls.Contains(pi.PhotoUrl) == false);
            _context.ProductImages.RemoveRange(toDeleteProductImageList);

            foreach (var pu in product.PhotoUrls)
            {
                var _pi = await productImages
                    .FirstOrDefaultAsync(pi => pi.PhotoUrl == pu);

                if (_pi == null)
                {
                    //기존에 없던 항목들은 새로 추가
                    _pi = new ProductImage
                    {
                        PhotoUrl = pu,
                        ProductId = product.Id
                    };
                    await _context.ProductImages.AddAsync(_pi);
                }
            }

            //product 엔티티를 수정된 상태로 설정
            //수정된 내용을 자동으로 체크해서 DB에 업데이트 해준다.
            _context.Entry(product).State = EntityState.Modified;
            //CreatedDate는 수정되지 않도록 설정
            _context.Entry(product).Property(p => p.CreatedDate).IsModified = false;

            //DB에서 제품에 대한 기존의 Category목록 가져오기
            var productCategories = _context.ProductCategories
                .Where(pc => pc.ProductId == id);

            //기존에는 있었지만 수정된 카테고리 목록에 없는 것들은 삭제
            var toDeleteProductCategoryList = productCategories
                .Where(pc => product.CategoryIds.Contains(pc.CategoryId) == false);
            _context.ProductCategories.RemoveRange(toDeleteProductCategoryList);

            foreach (var cid in product.CategoryIds)
            {
                var _pc = await productCategories
                    .FirstOrDefaultAsync(pc => pc.ProductId == id && pc.CategoryId == cid);

                if (_pc == null)
                {
                    var sortOrder = await productCategories.Where(pc => pc.ProductId == id).CountAsync();
                    //기존에 없던 항목들은 새로 추가
                    _pc = new ProductCategory
                    {
                        CategoryId = cid,
                        ProductId = product.Id,
                        SortOrder = sortOrder
                    };
                    await _context.ProductCategories.AddAsync(_pc);
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(new
            {
                Id = product.Id
            });
        }

        /// <summary>
        /// Multipart/formdata로 업로드된 이미지들을 지정된 경로에 복사
        /// </summary>
        /// <param name="id">제품 번호</param>
        /// <param name="photos">업로드된 이미지 목록</param>
        /// <returns>저장된 이미지들의 목록</returns>
        private async Task<List<ProductImage>> GetProductImages(long id, List<IFormFile> photos)
        {
            List<string> photoUrls = new List<string>();
            if (photos != null && photos.Count > 0)
            {
                foreach (var photo in photos)
                {
                    //기존 경로에서 새로 저장될 이미지 경로를 생성
                    var originalFileName = photo.FileName;
                    var targetFileName = $"{id}_product_{originalFileName}";
                    //WebRootPath는 프로젝트의 wwwroot폴더
                    var targetPath = Path.Combine(
                            _env.WebRootPath, "images", "products", $"{targetFileName}");

                    using (var stream = System.IO.File.Create(targetPath))
                    {
                        await photo.CopyToAsync(stream);
                    }

                    var url = $"images/products/{targetFileName}";

                    photoUrls.Add(url);
                }
            }

            var productImages = photoUrls
                .Select(pu => new ProductImage
                {
                    ProductId = id,
                    PhotoUrl = pu
                })
                .ToList();

            return productImages;
        }

        //관리자 권한 필요
        [Authorize(Roles = Constants.DefaultAdminRole)]
        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Product>> DeleteProduct(long id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return product;
        }

        private bool ProductExists(long id)
        {
            return _context.Products.Any(e => e.Id == id);
        }

        [HttpGet]
        [Route("GetMakers")]
        public async Task<ActionResult<List<Maker>>> GetMakers()
        {
            return await _context.Makers
                .AsNoTracking()
                .ToListAsync();
        }

        [HttpPost]
        [Route("IsDupeField")]
        public bool IsDupeField(
            int ProductId,
            string fieldName,
            string fieldValue)
        {
            return ApiResult<Product>.IsDupeField(
                _context.Products,
                ProductId,
                fieldName,
                fieldValue);
        }
    }
}
