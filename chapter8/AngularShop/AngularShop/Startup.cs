using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AngularShop.Data;
using AngularShop.Middlewares.Identity;
using AngularShop.Models.Identity;
using AngularShop.Services;
using AngularShop.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

namespace AngularShop
{
    public class Startup
    {
        public Startup(
            IConfiguration configuration,
            IWebHostEnvironment hostEnvironment)
        {
            Configuration = configuration;
            Env = hostEnvironment;

        }

        public IConfiguration Configuration { get; }
        public IWebHostEnvironment Env { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //Angular에서 정적 파일을 가져올 수 있도록 경로 설정
            services.AddSpaStaticFiles(configuration: options =>
            {
                options.RootPath = "wwwroot";
            });

            services.AddControllersWithViews()
                .AddNewtonsoftJson(options =>
                {
                    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                    options.SerializerSettings.Formatting = Formatting.Indented;
                });

            services.AddDbContext<ApplicationDbContext>(
                options =>
                    options.UseLazyLoadingProxies()
                    .UseMySql(
                        Configuration["ConnectionStrings:DefaultConnection"]));

            //User타입을 기본으로 하는 인증 설정
            services
                .AddDefaultIdentity<User>(options =>
                {
                    options.SignIn.RequireConfirmedAccount = true;
                    //패스워드의 조건설정
                    //숫자, 소문자, 특수문자 포함 8자 이상
                    options.Password.RequireDigit = true;
                    options.Password.RequireLowercase = true;
                    options.Password.RequireUppercase = false;
                    options.Password.RequireNonAlphanumeric = true;
                    options.Password.RequiredLength = 8;
                    //이메일은 중복 불가
                    options.User.RequireUniqueEmail = true;
                    //한글도 사용자 이름으로 설정 가능하도록
                    options.User.AllowedUserNameCharacters = string.Empty;
                })
                .AddRoles<Role>()
                .AddEntityFrameworkStores<ApplicationDbContext>();

            bool requireHttpsMetadata = false;

            if (!Env.IsDevelopment())
            {
                requireHttpsMetadata = true;
            }

            //Jwt 토큰을 통해 인증하도록 설정하기
            services.AddAuthentication(
                JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    //개발에서만 false세팅
                    options.RequireHttpsMetadata = requireHttpsMetadata;
                    //인증 성공 후 토큰을 저장해두고
                    options.SaveToken = true;
                    //JWT 설정
                    options.TokenValidationParameters = 
                        new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidAudience = Configuration["Jwt:Audience"],
                        ValidIssuer = Configuration["Jwt:Issuer"],
                        IssuerSigningKey =
                            new SymmetricSecurityKey(
                                Encoding.UTF8.GetBytes(
                                    Configuration["Jwt:Key"])),
                        ValidateIssuerSigningKey = true,
                        RequireExpirationTime = true,
                        ValidateLifetime = true
                    };
                });
            
            #region Service Layer Registrations

            //IAccountService에 대해 AccountService를 주입
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<ITokenService, TokenService>();

            #endregion
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            //인증에 활용할 쿠키 설정
            app.UseCookiePolicy(new CookiePolicyOptions
            {
                //같은 Url에서 보낸 쿠키만 허용
                MinimumSameSitePolicy = SameSiteMode.Strict,
                //서버에서만 확인가능한 쿠기 사용(JWT 토큰을 보호하기 위함)
                HttpOnly = HttpOnlyPolicy.Always,
                //https로만 전송 허용
                Secure = CookieSecurePolicy.Always
            });

            app.UseHttpsRedirection();

            //사용자의 요청에 대해 wwwroot에서 먼저 일치하는 요청을 찾음(1)
            app.UseStaticFiles();

            app.UseRouting();

            //서버에서만 보이는 쿠키에서 JWT 토큰을 추출하여 요청에 추가하는 미들웨어
            app.UseSecureJwt();

            //인증 사용
            app.UseAuthentication();
            //권한 체크 사용
            app.UseAuthorization();

            //사용자의 요청에 대해 일치하는 API 컨트롤러를 찾음(2)
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            //사용자의 요청에 대해 Spa에서 처리하도록 넘김(3)
            app.UseSpaStaticFiles();
            //개발 환경에서는 (3)에 해당하는 모든 요청을 http://localhost:4200으로 넘김(프록시)
            app.UseSpa(configuration: builder =>
            {
                if (env.IsDevelopment())
                {
                    builder.UseProxyToSpaDevelopmentServer(baseUri: "http://localhost:4200");
                }
            });
        }
    }
}
