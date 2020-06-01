using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AngularShop.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;

namespace AngularShop
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

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
            app.UseHttpsRedirection();

            //사용자의 요청에 대해 wwwroot에서 먼저 일치하는 요청을 찾음(1)
            app.UseStaticFiles();

            app.UseRouting();

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
