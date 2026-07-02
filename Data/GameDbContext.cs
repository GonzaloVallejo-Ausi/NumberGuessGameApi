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

            // Fluent API configurations
            modelBuilder.Entity<Player>(entity =>
            {
                entity.HasKey(p => p.Id);
                entity.HasIndex(p => p.Email).IsUnique(); // Correo único
                entity.Property(p => p.Email).IsRequired();
                entity.Property(p => p.PasswordHash).IsRequired();
                entity.HasMany(p => p.Games)
                      .WithOne(g => g.Player)
                      .HasForeignKey(g => g.PlayerId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Game>(entity =>
            {
                entity.HasKey(g => g.Id);
                entity.Property(g => g.SecretNumber).IsRequired().HasMaxLength(4);
                entity.Property(g => g.Status).IsRequired();
                entity.HasMany(g => g.Attempts)
                      .WithOne(a => a.Game)
                      .HasForeignKey(a => a.GameId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Attempt>(entity =>
            {
                entity.HasKey(a => a.Id);
                entity.Property(a => a.AttemptedNumber).IsRequired().HasMaxLength(4);
            });
        }
    }
}
