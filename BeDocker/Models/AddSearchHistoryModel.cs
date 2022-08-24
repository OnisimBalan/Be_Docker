using Microsoft.AspNetCore.Mvc;
using ServiceStack.DataAnnotations;

namespace BeDocker.Models
{
    [BindProperties]
    public class AddSearchHistoryModel
    {
        [Required]
        public string Key { get; set; }

        [Required]
        public string[] Links { get; set; }
    }
}
