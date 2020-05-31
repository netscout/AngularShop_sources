using AngularShop.Models;
using Microsoft.EntityFrameworkCore;

namespace AngularShop.Data
{
    public class ApplicationDbContext : DbContext
    {
        /// <summary>
        /// Product 클래스를 기반으로 Products 테이블 생성
        /// </summary>
        public DbSet<Product> Products { get; set; }
        /// <summary>
        /// Maker 클래스를 기반으로 Makers 테이블 생성
        /// </summary>
        public DbSet<Maker> Makers { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<ProductCategory> ProductCategories { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }

        public ApplicationDbContext(
            DbContextOptions options)
            : base(options)
        {
        }
    }
}
