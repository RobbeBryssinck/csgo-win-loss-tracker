using Microsoft.EntityFrameworkCore;

namespace CSGOTrackerAPI.Models
{
    public class GameContext : DbContext
    {
        public GameContext(DbContextOptions<GameContext> options) : base(options)
        {
        }

        public DbSet<GameDTO> Games { get; set; }
    }
}
