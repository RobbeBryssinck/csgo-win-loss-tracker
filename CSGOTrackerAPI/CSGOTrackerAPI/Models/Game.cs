using System.ComponentModel.DataAnnotations;

namespace CSGOTrackerAPI.Models
{
    public class Game
    {
        public int Id { get; set; }
        [Required]
        public string Rank { get; set; }
        [Required]
        public string WinLoss { get; set; }
        public string Secret { get; set; }
    }
}
