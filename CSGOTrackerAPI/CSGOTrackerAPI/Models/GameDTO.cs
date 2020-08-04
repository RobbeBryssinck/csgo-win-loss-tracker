using System.ComponentModel.DataAnnotations;

namespace CSGOTrackerAPI.Models
{
    public class GameDTO
    {
        public int Id { get; set; }
        [Required]
        public string Rank { get; set; }
        [Required]
        public string WinLoss { get; set; }
    }
}
