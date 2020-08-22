using KorayCibikMvcProjectMap.UI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Metadata.W3cXsd2001;
using System.Web;
using System.Web.Mvc;
using System.IO;
using System.Text;
using Newtonsoft.Json;

namespace KorayCibikMvcProjectMap.UI.Controllers
{
    public class HomeController : Controller
    {
         
        public ActionResult Index()
        {
            return View();
        }
     
        [HttpPost]
        public JsonResult LocationSaveJsPanelModal(string x, string y, int no,string name)
        {

            string path = Server.MapPath("~/");
            Data _data = new Data
            {
                Latitude = x,
                Longitude = y,
                Number = no,
                Name = name
            };
            if (_data != null)
            {
                string json = System.IO.File.ReadAllText(path + "data.json");
                if (json != null)
                {
                    List<Data> dt = JsonConvert.DeserializeObject<List<Data>>(json);
                    dt.Add(_data);
                    string newJson = JsonConvert.SerializeObject(dt);
                    System.IO.File.WriteAllText(path + "data.json", newJson);
                }
                else
                {
                    string newJson = JsonConvert.SerializeObject(_data);
                    System.IO.File.WriteAllText(path + "data.json", newJson);
                }                
            }
            else
            {
                return Json("Data Boş Olarak Gönderildi");
            }           
            return Json("OK");
        }
        
        [HttpPost]
        public JsonResult ListDataViewBootstrapTable()
        {
            string path = Server.MapPath("~/");         
            string json = System.IO.File.ReadAllText(path + "data.json");
            List<Data> dt = JsonConvert.DeserializeObject<List<Data>>(json);
            string newJson = JsonConvert.SerializeObject(dt);
            return Json(newJson);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}