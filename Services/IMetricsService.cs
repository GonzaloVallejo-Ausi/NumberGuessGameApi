using System.Threading.Tasks;

namespace NumberGuessGameApi.Services
{
    public interface IMetricsService
    {
        Task<object> GetUsersRegisteredPerDayAsync();
        Task<object> GetTop5GamesAsync();
        Task<object> GetAttemptsStatsAsync();
    }
}
