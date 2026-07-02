using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using NumberGuessGameApi.Services;

namespace NumberGuessGameApi.Controllers
{
    [ApiController]
    [Route("api/game/v1/metrics")]
    public class MetricsController : ControllerBase
    {
        private readonly IMetricsService _metricsService;

        public MetricsController(IMetricsService metricsService)
        {
            _metricsService = metricsService;
        }

        [HttpGet("users-per-day")]
        public async Task<IActionResult> GetUsersRegisteredPerDay()
        {
            var result = await _metricsService.GetUsersRegisteredPerDayAsync();
            return Ok(result);
        }

        [HttpGet("top-5-games")]
        public async Task<IActionResult> GetTop5Games()
        {
            var result = await _metricsService.GetTop5GamesAsync();
            return Ok(result);
        }

        [HttpGet("attempts-stats")]
        public async Task<IActionResult> GetAttemptsStats()
        {
            var result = await _metricsService.GetAttemptsStatsAsync();
            return Ok(result);
        }
    }
}
