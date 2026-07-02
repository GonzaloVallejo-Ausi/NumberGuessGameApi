using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NumberGuessGameApi.Data;

namespace NumberGuessGameApi.Services
{
    public class MetricsService : IMetricsService
    {
        private readonly GameDbContext _context;

        public MetricsService(GameDbContext context)
        {
            _context = context;
        }

        public async Task<object> GetUsersRegisteredPerDayAsync()
        {
            // Ensure EF translates the Date properly or use client side if needed, but in SQLite EF translates Date.
            var result = await _context.Players
                .GroupBy(p => p.CreatedAt.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    Count = g.Count()
                })
                .OrderByDescending(r => r.Date)
                .ToListAsync();

            return result;
        }

        public async Task<object> GetTop5GamesAsync()
        {
            var result = await _context.Games
                .Where(g => g.Status == "Finished")
                .Select(g => new
                {
                    GameId = g.Id,
                    PlayerEmail = g.Player.Email,
                    AttemptsCount = g.Attempts.Count
                })
                .OrderBy(g => g.AttemptsCount)
                .Take(5)
                .ToListAsync();

            return result;
        }

        public async Task<object> GetAttemptsStatsAsync()
        {
            var totalGames = await _context.Games.CountAsync();
            var totalAttempts = await _context.Attempts.CountAsync();
            
            var attemptsPerGame = await _context.Games
                .Select(g => new
                {
                    GameId = g.Id,
                    AttemptsCount = g.Attempts.Count
                })
                .ToListAsync();

            double averageAttempts = totalGames > 0 ? (double)totalAttempts / totalGames : 0;

            return new
            {
                OverallAverageAttempts = averageAttempts,
                AttemptsPerGame = attemptsPerGame
            };
        }
    }
}
