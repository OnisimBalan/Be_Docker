using BeDocker.Connections;
using BeDocker.Models;
using Dapper;

namespace BeDocker.Repositoies
{
    public interface ISearchHistoryRepostitory
    {
        bool Create(SearchHistoryModel searchHistoryModel);
        bool Update(SearchHistoryModel searchHistoryModel);
        IList<SearchHistoryModel> GetAll();
        SearchHistoryModel GetById(int id);

        bool CreateTable();
    }

    public class SearchHistoryRepostitory : ISearchHistoryRepostitory
    {
        private readonly IDbConnectionFactory DbConnectionFactory;

        public SearchHistoryRepostitory(IDbConnectionFactory dbConnectionFactory)
        {
            DbConnectionFactory = dbConnectionFactory;
        }

        public bool Create(SearchHistoryModel searchHistoryModel)
        {
            using (var connection = DbConnectionFactory.CreateConnecton())
            {
                return 0 != connection.Execute("INSERT INTO searchhistory(searchKey, searchResultCSV) VALUES(@searchKey,@searchResultCSV)",
                    new
                    {
                        searchKey = searchHistoryModel.searchKey,
                        searchResultCSV = searchHistoryModel.searchResultCSV
                    });
            }
        }

        public bool CreateTable()
        {
            using (var connection = DbConnectionFactory.CreateConnecton())
            {
                return 0 != connection.Execute(@"
                    CREATE TABLE searchhistory(
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        searchKey TEXT NOT NULL,
                        searchResultCSV TEXT NOT NULL
                    )
                ");
            }
        }

        public IList<SearchHistoryModel> GetAll()
        {
            using (var connection = DbConnectionFactory.CreateConnecton())
            {
                return connection.Query<SearchHistoryModel>("SELECT * FROM searchhistory").ToList();
            }
        }

        public SearchHistoryModel GetById(int id)
        {
            using (var connection = DbConnectionFactory.CreateConnecton())
            {
                return connection.QueryFirstOrDefault<SearchHistoryModel>("SELECT * FROM searchhistory WHERE id=@id",
                    new { id = id });
            }
        }

        public bool Update(SearchHistoryModel searchHistoryModel)
        {
            using (var connection = DbConnectionFactory.CreateConnecton())
            {
                return 0 != connection.Execute("UPDATE searchhistory SET searchKey=@searchKey,searchResultCSV=@searchResultCSV WHERE id=@id",
                    new
                    {
                        searchKey = searchHistoryModel.searchKey,
                        searchResultCSV = searchHistoryModel.searchResultCSV,
                        id = searchHistoryModel.id
                    });
            }
        }
    }
}
