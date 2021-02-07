using AngularShop.Data;
using AngularShop.Models;
using AngularShop.Models.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AngularShop.Controllers
{
    //관리자 권한 필요
    // [Authorize(Roles = Constants.DefaultAdminRole)]
    [Route("api/[controller]")]
    [ApiController]
    public class SeedController : ControllerBase
    {
        private ApplicationDbContext _context;
        private readonly RoleManager<Role> _roleManager;
        private readonly UserManager<User> _userManager;

        public SeedController(
            ApplicationDbContext context,
            RoleManager<Role> roleManager,
            UserManager<User> userManager)
        {
            _context = context;
            _roleManager = roleManager;
            _userManager = userManager;
        }
        
        [HttpGet]
        [Route("CreateDefaultUsers")]
        public async Task<ActionResult> CreateDefaultUsers()
        {
            //사용자 역할 추가
            if (await _roleManager.FindByNameAsync(
                Constants.DefaultUserRole) == null)
            {
                await _roleManager.CreateAsync(
                    new Role(Constants.DefaultUserRole));
            }
            //관리자 역할 추가
            if (await _roleManager.FindByNameAsync(
                Constants.DefaultAdminRole) == null)
            {
                await _roleManager.CreateAsync(
                    new Role(Constants.DefaultAdminRole));
            }

            var addedUserList = new List<User>();

            //관리자 역할을 가진 사용자 추가
            var adminEmail = "admin@email.com";
            if (await _userManager.FindByEmailAsync(adminEmail) == null)
            {
                var adminUser = new User
                {
                    SecurityStamp = Guid.NewGuid().ToString(),
                    UserName = "admin",
                    Email = adminEmail
                };

                var result = 
                    await _userManager.CreateAsync(adminUser, "qwerty1@");

                await _userManager.AddToRolesAsync(
                    adminUser,
                    new List<string> {
                        Constants.DefaultUserRole,
                        Constants.DefaultAdminRole
                    });

                adminUser.EmailConfirmed = true;
                adminUser.LockoutEnabled = false;

                addedUserList.Add(adminUser);
            }

            //일반 사용자 추가
            var userEmail = "user@email.com";
            if (await _userManager.FindByEmailAsync(userEmail) == null)
            {
                var user = new User
                {
                    SecurityStamp = Guid.NewGuid().ToString(),
                    UserName = "user",
                    Email = userEmail
                };

                await _userManager.CreateAsync(user, "qwerty1@");

                await _userManager.AddToRolesAsync(
                    user,
                    new List<string> {
                        Constants.DefaultUserRole
                    });

                user.EmailConfirmed = true;
                user.LockoutEnabled = false;

                addedUserList.Add(user);
            }

            if (addedUserList.Count > 0)
            {
                await _context.SaveChangesAsync();
            }

            return new JsonResult(new
            {
                Count = addedUserList.Count,
                Users = addedUserList
            });
        }

        /// <summary>
        /// https://localhost:44394/CreateSampleProducts
        /// 포트 번호는 매번 다를 수 있음.
        /// </summary>
        /// <returns>DB에 추가된 데이터 행 개수</returns>
        [HttpGet]
        [Route("CreateSampleProducts")]
        public async Task<ActionResult> CreateSampleProducts()
        {
            //제조 회사 데이터 정의
            Maker maker1 = new Maker
            {
                Name = "모바일 메이커1"
            };
            Maker maker2 = new Maker
            {
                Name = "기타 메이커2"
            };

            //카테고리 정의
            Category root_electric = new Category
            {
                Name = "전자제품"
            };
            Category middle_mobile = new Category
            {
                Name = "모바일",
                Parent = root_electric
            };
            Category middle_etc = new Category
            {
                Name = "기타",
                Parent = root_electric
            };
            Category middle_onsale = new Category
            {
                Name = "세일",
                Parent = root_electric
            };
            Category leaf_smartphone = new Category
            {
                Name = "스마트폰",
                Parent = middle_mobile
            };
            Category leaf_tablet = new Category
            {
                Name = "태블릿",
                Parent = middle_mobile
            };
            Category leaf_notebook = new Category
            {
                Name = "노트북",
                Parent = root_electric
            };

            //제품 데이터 정의
            var p1 = GenerateProduct("스마트폰1", maker1);
            var pi1 = new ProductImage
            {
                Product = p1,
                PhotoUrl = "images/products/product_1.jpg"
            };
            ProductCategory pc1 = new ProductCategory
            {
                Category = leaf_smartphone,
                Product = p1,
                SortOrder = 1
            };

            var p2 = GenerateProduct("음향기기1", maker2);
            var pi2 = new ProductImage
            {
                Product = p2,
                PhotoUrl = "images/products/product_2.jpg"
            };
            ProductCategory pc2 = new ProductCategory
            {
                Category = middle_etc,
                Product = p2,
                SortOrder = 1
            };

            var p3 = GenerateProduct("악세사리1", maker2);
            var pi3 = new ProductImage
            {
                Product = p3,
                PhotoUrl = "images/products/product_3.jpg"
            };
            ProductCategory pc3 = new ProductCategory
            {
                Category = middle_etc,
                Product = p3,
                SortOrder = 1
            };

            var p4 = GenerateProduct("노트북1", maker1);
            var pi4 = new ProductImage
            {
                Product = p4,
                PhotoUrl = "images/products/product_4.jpg"
            };
            ProductCategory pc4 = new ProductCategory
            {
                Category = leaf_notebook,
                Product = p4,
                SortOrder = 1
            };

            var p5 = GenerateProduct("헤드폰1", maker2);
            var pi5 = new ProductImage
            {
                Product = p5,
                PhotoUrl = "images/products/product_5.jpg"
            };
            ProductCategory pc5 = new ProductCategory
            {
                Category = middle_etc,
                Product = p5,
                SortOrder = 1
            };

            var p6 = GenerateProduct("태블릿1", maker1);
            var pi6 = new ProductImage
            {
                Product = p6,
                PhotoUrl = "images/products/product_6.jpg"
            };
            ProductCategory pc6 = new ProductCategory
            {
                Category = leaf_tablet,
                Product = p6,
                SortOrder = 1
            };

            var p7 = GenerateProduct("스마트폰2", maker1);
            var pi7 = new ProductImage
            {
                Product = p7,
                PhotoUrl = "images/products/product_7.jpg"
            };
            ProductCategory pc7 = new ProductCategory
            {
                Category = leaf_smartphone,
                Product = p7,
                SortOrder = 1
            };

            var p8 = GenerateProduct("키보드1", maker2);
            var pi8 = new ProductImage
            {
                Product = p8,
                PhotoUrl = "images/products/product_8.jpg"
            };
            ProductCategory pc8 = new ProductCategory
            {
                Category = middle_etc,
                Product = p8,
                SortOrder = 1
            };

            var p9 = GenerateProduct("드론1", maker2);
            var pi9 = new ProductImage
            {
                Product = p9,
                PhotoUrl = "images/products/product_9.jpg"
            };
            ProductCategory pc9 = new ProductCategory
            {
                Category = middle_etc,
                Product = p9,
                SortOrder = 1
            };

            var p10 = GenerateProduct("헤드폰2", maker2);
            var pi10 = new ProductImage
            {
                Product = p10,
                PhotoUrl = "images/products/product_10.jpg"
            };
            ProductCategory pc10 = new ProductCategory
            {
                Category = middle_etc,
                Product = p10,
                SortOrder = 1
            };

            var p11 = GenerateProduct("게임콘솔1", maker2);
            var pi11 = new ProductImage
            {
                Product = p11,
                PhotoUrl = "images/products/product_11.jpg"
            };
            ProductCategory pc11 = new ProductCategory
            {
                Category = middle_etc,
                Product = p11,
                SortOrder = 1
            };

            var p12 = GenerateProduct("렌즈1", maker2);
            var pi12 = new ProductImage
            {
                Product = p12,
                PhotoUrl = "images/products/product_12.jpg"
            };
            ProductCategory pc12 = new ProductCategory
            {
                Category = middle_etc,
                Product = p12,
                SortOrder = 1
            };

            //제조 회사를 하나의 목록으로 정리
            var makers = new List<Maker>
            {
                maker1,
                maker2
            };

            foreach (var m in makers)
            {
                //이름이 일치하는 제조 회사가 존재하지 않는다면
                if (await _context.Makers.FirstOrDefaultAsync(_m => _m.Name == m.Name) == null)
                {
                    //제조 회사 추가
                    _context.Makers.Add(m);
                }
            }

            //카테고리를 하나의 목록으로 정리
            var categories = new List<Category>
            {
                root_electric,
                middle_mobile,
                middle_etc,
                middle_onsale,
                leaf_notebook,
                leaf_smartphone,
                leaf_tablet
            };

            foreach (var c in categories)
            {
                //이름이 일치하는 카테고리가 존재하지 않는다면
                if (await _context.Categories.FirstOrDefaultAsync(_c => _c.Name == c.Name) == null)
                {
                    //카테고리 추가
                    _context.Categories.Add(c);
                }
            }

            //12개의 제품을 하나의 목록으로 정리
            var products = new List<Product>
            {
                p1,
                p2,
                p3,
                p4,
                p5,
                p6,
                p7,
                p8,
                p9,
                p10,
                p11,
                p12
            };

            var addedProductCount = 0;
            foreach (var p in products)
            {
                //이름이 일치하는 제품이 존재하지 않는다면
                if (await _context.Products.FirstOrDefaultAsync(_p => _p.Name == p.Name) == null)
                {
                    //제품 추가
                    _context.Products.Add(p);
                    addedProductCount++;
                }
            }

            //초기 데이터 12개가 모두 생성될 때만
            if (addedProductCount == 12)
            {
                //제품이 속한 카테고리를 목록으로 정리
                var productCategories = new List<ProductCategory>
                {
                    pc1,
                    pc2,
                    pc3,
                    pc4,
                    pc5,
                    pc6,
                    pc7,
                    pc8,
                    pc9,
                    pc10,
                    pc11,
                    pc12
                };

                //제품이 속한 카테고리 추가
                _context.ProductCategories.AddRange(productCategories);

                var productImages = new List<ProductImage>
                {
                    pi1,
                    pi2,
                    pi3,
                    pi4,
                    pi5,
                    pi6,
                    pi7,
                    pi8,
                    pi9,
                    pi10,
                    pi11,
                    pi12
                };

                //제품의 이미지 추가
                _context.ProductImages.AddRange(productImages);
            }

            //모든 변경사항을 DB에 적용하고, 적용된 행 개수를 count로 가져오기
            var count = await _context.SaveChangesAsync();

            return new JsonResult(new
            {
                AppliedCount = count
            });
        }

        /// <summary>
        /// 제품명과 제조 회사를 통해 제품 데이터 생성
        /// </summary>
        private Product GenerateProduct(string name, Maker maker)
        {
            Product p = new Product
            {
                Name = name,
                Description = "...",
                Maker = maker,
                IsVisible = true,
                Price = 0,
                Discount = 0,
                StockCount = 0,
                Tags = ""
            };

            return p;
        }
    }
}
