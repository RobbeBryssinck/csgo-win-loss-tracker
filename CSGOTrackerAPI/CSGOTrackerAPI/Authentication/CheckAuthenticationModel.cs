using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CSGOTrackerAPI.Authentication
{
    public class CheckAuthenticationModel
    {
        [Required(ErrorMessage = "Token is required")]
        public string Token { get; set; }
    }
}
