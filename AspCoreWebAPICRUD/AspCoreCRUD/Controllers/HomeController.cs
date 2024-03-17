using AspCoreCRUD.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.Net.Http.Headers;
using System.Diagnostics;


namespace AspCoreCRUD.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IWebHostEnvironment _hostEnvironment;

        public HomeController(ILogger<HomeController> logger, IWebHostEnvironment hostEnvironment)
        {
            _logger = logger;
            _hostEnvironment = hostEnvironment;
        }
       
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        [HttpPost]
        public async Task<ActionResult> UploadFiles(IList<IFormFile> files)
        {
            string fileName = null;

            foreach (IFormFile source in files)
            {
                // Get original file name to get the extension from it.
                string orgFileName = ContentDispositionHeaderValue.Parse(source.ContentDisposition).FileName.Value;

                // Create a new file name to avoid existing files on the server with the same names.
                fileName = DateTime.Now.ToFileTime() + Path.GetExtension(orgFileName);

                string fullPath = GetFullPathOfFile(fileName);

                // Create the directory.
                Directory.CreateDirectory(Directory.GetParent(fullPath).FullName);

                // Save the file to the server.
                await using FileStream output = System.IO.File.Create(fullPath);
                await source.CopyToAsync(output);
            }

            var response = new { FileName = fileName };

            return Ok(response);
        }

        private string GetFullPathOfFile(string fileName)
        {
            return $"{_hostEnvironment.WebRootPath}\\uploads\\{fileName}";
        }
    }
}
