using AngularShop.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq;
using System;
using System.Threading;
using Microsoft.EntityFrameworkCore.Diagnostics;
using AngularShop.Models.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace AngularShop.Data
{
    public class ApplicationDbContext : IdentityDbContext<User, Role, long>
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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
                        
            var userEntity = modelBuilder.Entity<User>();
            //User엔티티에 대해 Users테이블로 생성
            userEntity.ToTable("Users");
            //DB에 longtext로 생성되는 걸 varchar(256)등으로 변경하기 위한 코드
            userEntity.Property(u => u.PasswordHash).HasMaxLength(256);
            userEntity.Property(u => u.SecurityStamp).HasMaxLength(256);
            userEntity.Property(u => u.ConcurrencyStamp).HasMaxLength(256);
            userEntity.Property(u => u.PhoneNumber).HasMaxLength(20);

            var roleEntity = modelBuilder.Entity<Role>();
            roleEntity.ToTable("Roles");
            roleEntity.Property(r => r.ConcurrencyStamp).HasMaxLength(256);

            modelBuilder.Entity<IdentityUserRole<long>>()
                .ToTable("UserRoles");

            var loginEntity = 
                modelBuilder.Entity<IdentityUserLogin<long>>();
            loginEntity.ToTable("UserLogins");
            loginEntity.Property(l => l.ProviderDisplayName).HasMaxLength(256);

            var userClaimEntity = 
                modelBuilder.Entity<IdentityUserClaim<long>>();
            userClaimEntity.ToTable("UserClaims");
            userClaimEntity.Property(uc => uc.ClaimType).HasMaxLength(256);
            userClaimEntity.Property(uc => uc.ClaimValue).HasMaxLength(256);

            var roleClaimEntity = 
                modelBuilder.Entity<IdentityRoleClaim<long>>();
            roleClaimEntity.ToTable("RoleClaims");
            roleClaimEntity.Property(rc => rc.ClaimType).HasMaxLength(256);
            roleClaimEntity.Property(rc => rc.ClaimValue).HasMaxLength(256);

            var userTokenEntity = 
                modelBuilder.Entity<IdentityUserToken<long>>();
            userTokenEntity.ToTable("UserTokens");
            userTokenEntity.Property(ut => ut.Value).HasMaxLength(256);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.ConfigureWarnings(warn => 
                warn.Ignore(CoreEventId.DetachedLazyLoadingWarning));

            base.OnConfiguring(optionsBuilder);
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            OnBeforeSaving();

            return base.SaveChangesAsync(cancellationToken);
        }

        public override int SaveChanges()
        {
            OnBeforeSaving();

            return base.SaveChanges();
        }

        /// <summary>
        /// DB에 저장되기 전에 실행할 작업들
        /// </summary>
        private void OnBeforeSaving()
        {
            //현재 DB에 저장하려는 항목 중에 새로 추가되거나, 수정되는 항목만 선택
            var entries = ChangeTracker
                .Entries()
                .Where(x => x.Entity is BaseEntity &&
                            (x.State == EntityState.Added 
                            || x.State == EntityState.Modified));

            if (entries.Count() > 0)
            {
                foreach (var entry in entries)
                {
                    //BaseEntity를 상속한 타입만 처리
                    if (entry.Entity is BaseEntity baseEntity)
                    {
                        var now = DateTime.UtcNow;
                        switch (entry.State)
                        {
                            //수정인 경우
                            case EntityState.Modified:
                                baseEntity.ModifiedDate = now;
                                break;
                            //새로 추가하는 경우
                            case EntityState.Added:
                                baseEntity.CreatedDate = now;
                                baseEntity.ModifiedDate = now;
                                break;
                        }
                    }
                }
            }
        }
    }
}
