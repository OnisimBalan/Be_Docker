using BeDocker.Models;
using BeDocker.Repositoies;
using Microsoft.AspNetCore.Mvc;

namespace BeDocker.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ISearchHistoryRepostitory searchHistoryRepostitory;

        public HomeController(ILogger<HomeController> logger, ISearchHistoryRepostitory searchHistoryRepostitory)
        {
            this.searchHistoryRepostitory = searchHistoryRepostitory;
            _logger = logger;
        }

        public IActionResult Index()
        {
            //searchHistoryRepostitory.CreateTable();
            return View();
        }

        public IActionResult ShowHistory()
        {
            return View();
        }

        public IActionResult Chat()
        {
            return View();
        }

        public IActionResult AddSearchHistory([FromBody] AddSearchHistoryModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var searchResultCSV = model.Links.Aggregate((a, b) => $"{a},{b}");

            if (!searchHistoryRepostitory.Create(new SearchHistoryModel()
            {
                searchKey = model.Key,
                searchResultCSV = searchResultCSV
            }))
            {
                return Problem();
            }

            return Ok();
        }

        public IActionResult GetAllSearchHistory()
        {
            var dbResult = searchHistoryRepostitory.GetAll();
            if (dbResult != null)
            {
                return Json(dbResult.Select(t => new
                {
                    id = t.id,
                    searchKey = t.searchKey,
                    links = t.searchResultCSV.Split(',').Select(t => t).ToArray()
                }).ToList());
            }

            return Json(Array.Empty<object>());
        }
    }
}