using System.Data;
using System.Data.SQLite;

namespace BeDocker.Connections
{
    public interface IDbConnectionFactory
    {
        IDbConnection CreateConnecton();
    }

    public class DbConnectionFactory : IDbConnectionFactory
    {
        public string ConnectionString { get; set; }

        public DbConnectionFactory(IConfiguration configuration)
        {
            ConnectionString = configuration["Database:ConnectionString"];
        }

        public IDbConnection CreateConnecton()
        {
            return new SQLiteConnection(ConnectionString);
        }
    }
}
