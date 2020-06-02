using AngularShop.Controllers;
using AngularShop.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Xunit;

namespace AngularShop.Test
{
    public class SeedController_Test
    {
        [Fact]
        public async void CreateDefaultUsers()
        {
            using (var factory = new DbFactory())
            {
                #region 준비(arrange)

                Product product8_Exist = null;
                string product10_Name = "";
                Product product13_NotExist = null;

                int? middle_etc_count = null;
                string product1_Category_Name = null;

                string product4_PhotoUrl = null;

                #endregion

                #region 테스트(act)

                using (var context = factory.CreateContext())
                {
                    var controller = new SeedController(
                        context);

                    //초기 제품 데이터 생성
                    await controller.CreateSampleProducts();

                    //8번 제품이 존재하면 가져오고, 없다면 null
                    product8_Exist = await context.Products
                        .FirstOrDefaultAsync(p => p.Id == 8);

                    //10번 제품이 존재한다면 이름을 가져오고
                    //존재하지 않는다면 이름은 null
                    product10_Name = (await context.Products
                        .FirstOrDefaultAsync(p => p.Id == 10))?.Name;

                    //13번 제품이 존재하면 가져오고, 없다면 null
                    product13_NotExist = await context.Products
                        .FirstOrDefaultAsync(p => p.Id == 13);

                    //기타 분류에 속하는 상품 개수, 분류가 없다면 null
                    middle_etc_count = (await context.Categories
                        .FirstOrDefaultAsync(c => c.Name == "기타"))
                        ?.ProductCategories.Count;

                    product1_Category_Name = (await context.ProductCategories
                        .FirstOrDefaultAsync(pc => pc.ProductId == 1))
                        ?.Category.Name;

                    var product4 = (await context.Products
                        .FirstOrDefaultAsync(p => p.Id == 4));

                    //4번 제품의 이미지 경로 가져오기, 없다면 null
                    product4_PhotoUrl = (await context.Products
                        .FirstOrDefaultAsync(p => p.Name == "노트북1"))
                        ?.ProductImages.FirstOrDefault()
                        ?.PhotoUrl;
                }

                #endregion

                #region 검증(assert)

                Assert.True(
                    //8번 제품은 있어야만 하고
                    product8_Exist != null
                    //10번 제품의 이름은 헤드폰2이고
                    && product10_Name == "헤드폰2"  
                    //13번 제품이 존재하지 않아야 한다.
                    && product13_NotExist == null);

                Assert.True(
                    //기타 분류의 상품 개수는 8개
                    middle_etc_count == 8
                    //1번 제품의 분류는 스마트폰
                    && product1_Category_Name == "스마트폰");

                Assert.True(
                    product4_PhotoUrl == "images/products/product_4.jpg");

                #endregion
            }
        }
    }
}
