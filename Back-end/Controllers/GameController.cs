using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NumberGuessGameApi.DataTransferObjects;
using NumberGuessGameApi.Services;

namespace NumberGuessGameApi.Controllers
{
    [ApiController]
    [Route("api/game/v1")]
    public class GameController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IGameService _gameService;
        private readonly ILogger<GameController> _logger;

        public GameController(IAuthService authService, IGameService gameService, ILogger<GameController> logger)
        {
            _authService = authService;
            _gameService = gameService;
            _logger = logger;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterPlayerRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var response = await _authService.RegisterAsync(request);
                return Ok(response);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning("Error al registrar: {Message}", ex.Message);
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error inesperado al registrar usuario.");
                return StatusCode(500, new { message = "Error interno del servidor." });
            }
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var response = await _authService.LoginAsync(request);
                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning("Intento de login fallido: {Message}", ex.Message);
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error inesperado al hacer login.");
                return StatusCode(500, new { message = "Error interno del servidor." });
            }
        }

        [HttpPost("start")]
        [Authorize]
        public async Task<IActionResult> StartGame()
        {
            try
            {
                var playerIdClaim = User.FindFirst("playerId")?.Value;
                if (!Guid.TryParse(playerIdClaim, out var playerId))
                    return Unauthorized(new { message = "Token inválido o falta playerId." });

                var response = await _gameService.StartGameAsync(playerId);
                return Ok(response);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning("Error al iniciar juego: {Message}", ex.Message);
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error inesperado al iniciar juego.");
                return StatusCode(500, new { message = "Error interno del servidor." });
            }
        }

        [HttpPost("guess")]
        [Authorize]
        public async Task<IActionResult> GuessNumber([FromBody] GuessNumberRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var playerIdClaim = User.FindFirst("playerId")?.Value;
                if (!Guid.TryParse(playerIdClaim, out var playerId))
                    return Unauthorized(new { message = "Token inválido o falta playerId." });

                var response = await _gameService.MakeGuessAsync(playerId, request);
                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning("Error de validación de adivinanza: {Message}", ex.Message);
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning("Error de estado de juego: {Message}", ex.Message);
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error inesperado al adivinar número.");
                return StatusCode(500, new { message = "Error interno del servidor." });
            }
        }
    }
}
