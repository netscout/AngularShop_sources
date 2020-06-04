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
using Microsoft.AspNetCore.Authorization;

namespace AngularShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Categories
        [HttpGet]
        public async Task<ActionResult<ApiResult<Category>>> GetCategories(
            int pageIndex = 0,
            int pageSize = 10,
            string sortColumn = null,
            string sortOrder = null,
            string filterColumn = null,
            string filterQuery = null)
        {
            return await ApiResult<Category>.CreateAsync(
                _context.Categories
                    .AsNoTracking()
                    .Select(c => new Category
                    {
                        Id = c.Id,
                        Name = c.Name,
                        TotalProducts = c.ProductCategories.Count
                    }),
                pageIndex,
                pageSize,
                sortColumn,
                sortOrder,
                filterColumn,
                filterQuery);
        }

        [HttpGet]
        [Route("EntireCategoryTree")]
        public ActionResult<List<Category>> GetEntireCategoryTree()
        {
            var categories = _context.Categories
                .Include(c => c.ProductCategories)
                .AsEnumerable() // 전체 데이터 구조를 모두 로드
                .Where(e => e.ParentId == null) // 그 중에 루트 노드만 검색
                .ToList();

            return categories;
        }

        // GET: api/Categories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(long id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            return category;
        }

        //관리자 권한 필요
        [Authorize(Roles = Constants.DefaultAdminRole)]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategory(long id, Category category)
        {
            if (id != category.Id)
            {
                return BadRequest();
            }

            _context.Entry(category).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        //관리자 권한 필요
        [Authorize(Roles = Constants.DefaultAdminRole)]
        [HttpPost]
        public async Task<ActionResult<Category>> PostCategory(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCategory", new { id = category.Id }, category);
        }

        //관리자 권한 필요
        [Authorize(Roles = Constants.DefaultAdminRole)]
        // DELETE: api/Categories/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Category>> DeleteCategory(long id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return category;
        }

        private bool CategoryExists(long id)
        {
            return _context.Categories.Any(e => e.Id == id);
        }

        [HttpPost]
        [Route("IsDupeField")]
        public bool IsDupeField(
            int categoryId,
            string fieldName,
            string fieldValue)
        {
            return ApiResult<Category>.IsDupeField(
                _context.Categories,
                categoryId,
                fieldName,
                fieldValue);
        }
    }
}
