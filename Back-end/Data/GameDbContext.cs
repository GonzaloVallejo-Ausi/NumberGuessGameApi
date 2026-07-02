using Microsoft.EntityFrameworkCore;
using NumberGuessGameApi.Models;

namespace NumberGuessGameApi.Data
{
    public class GameDbContext : DbContext
    {
        public GameDbContext(DbContextOptions<GameDbContext> options) : base(options)
        {
        }

        public DbSet<Player> Players { get; set; } = null!;
        public DbSet<Game> Games { get; set; } = null!;
        public DbSet<Attempt> Attempts { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Player>()
                .HasIndex(p => p.Email)
                .IsUnique();

            modelBuilder.Entity<Game>()
                .HasOne(g => g.Player)
                .WithMany(p => p.Games)
                .HasForeignKey(g => g.PlayerId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Attempt>()
                .HasOne(a => a.Game)
                .WithMany(g => g.Attempts)
                .HasForeignKey(a => a.GameId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
