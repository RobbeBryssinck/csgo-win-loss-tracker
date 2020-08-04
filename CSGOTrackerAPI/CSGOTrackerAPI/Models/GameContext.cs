using CSGOTrackerAPI.Authentication;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CSGOTrackerAPI.Models
{
    public class GameContext : IdentityDbContext<ApplicationUser>
    {
        public GameContext(DbContextOptions<GameContext> options) : base(options)
        {
        }

        public DbSet<Game> Games { get; set; }
        public DbSet<Rank> Ranks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Game>().ToTable("Game");
            modelBuilder.Entity<Rank>().ToTable("Rank");
        }
    }
}
