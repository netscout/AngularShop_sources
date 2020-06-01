using AngularShop.Data;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using System;
using System.Data.Common;

namespace AngularShop.Test
{
    public class DbFactory : IDisposable
    {
        private DbConnection _connection;

        private DbContextOptions<ApplicationDbContext> CreateOptions()
        {
            return new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseSqlite(_connection)
                .Options;
        }

        public ApplicationDbContext CreateContext()
        {
            if (_connection == null)
            {
                //Sqlite 데이터베이스를 메모리 데이터베이스 모드로 접속 설정
                _connection = new SqliteConnection("DataSource=:memory:");
                _connection.Open();

                //최초 접속할 때, 
                var options = this.CreateOptions();
                using (var context = new ApplicationDbContext(options))
                {
                    //ApplicationDbContext에 정의된 테이블 구조가 생성되도록 함
                    context.Database.EnsureCreated();
                }
            }

            return new ApplicationDbContext(this.CreateOptions());
        }

        public void Dispose()
        {
            if (_connection != null)
            {
                _connection.Dispose();
                _connection = null;
            }
        }
    }
}
