namespace BeDocker.Models
{
    public class SearchHistoryModel
    {
        public int id { get; set; } = 0;
        public string? searchKey { get; set; }
        public string? searchResultCSV { get; set; }
    }
}
