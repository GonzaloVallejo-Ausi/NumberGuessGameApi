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

            return result.Select(r => new { Date = r.Date.ToString("yyyy-MM-dd"), Count = r.Count }).ToList();
        }

        public async Task<object> GetTop5GamesAsync()
        {
            var result = await _context.Games
                .Where(g => g.Status == "Finished")
                .Select(g => new
                {
                    GameId = g.Id,
                    PlayerEmail = g.Player.Email,
                    Attempts = g.Attempts.Count
                })
                .OrderBy(g => g.Attempts)
                .Take(5)
                .ToListAsync();

            return result;
        }

        public async Task<object> GetAttemptsStatsAsync()
        {
            var totalGames = await _context.Games.CountAsync();
            var totalAttempts = await _context.Attempts.CountAsync();

            double averageAttempts = totalGames > 0 ? (double)totalAttempts / totalGames : 0;
            double averagePicas = totalAttempts > 0 ? await _context.Attempts.AverageAsync(a => a.Picas) : 0;

            return new
            {
                TotalGames = totalGames,
                TotalAttempts = totalAttempts,
                AverageAttempts = averageAttempts,
                AveragePicas = averagePicas
            };
        }
    }
}
