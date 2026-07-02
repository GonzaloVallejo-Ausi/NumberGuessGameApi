using System;
using System.Linq;
using System.Threading.Tasks;
using GameCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NumberGuessGameApi.Data;
using NumberGuessGameApi.DataTransferObjects;
using NumberGuessGameApi.Models;

namespace NumberGuessGameApi.Services
{
    public class GameService : IGameService
    {
        private readonly GameDbContext _context;
        private readonly ILogger<GameService> _logger;

        public GameService(GameDbContext context, ILogger<GameService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<StartGameResponse> StartGameAsync(Guid playerId)
        {
            _logger.LogInformation("Verificando si el jugador {PlayerId} tiene un juego activo.", playerId);
            var activeGame = await _context.Games
                .FirstOrDefaultAsync(g => g.PlayerId == playerId && g.Status == "Active");

            if (activeGame != null)
            {
                _logger.LogWarning("El jugador {PlayerId} ya tiene un juego activo (GameId: {GameId}).", playerId, activeGame.Id);
                throw new InvalidOperationException("Ya tienes un juego activo.");
            }

            var secretNumber = GenerateSecretNumber();
            var game = new Game
            {
                PlayerId = playerId,
                SecretNumber = secretNumber,
                Status = "Active",
                CreatedAt = DateTime.UtcNow
            };

            _context.Games.Add(game);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Nuevo juego generado para el jugador {PlayerId} con ID {GameId}.", playerId, game.Id);

            return new StartGameResponse
            {
                GameId = game.Id,
                PlayerId = game.PlayerId,
                CreatedAt = game.CreatedAt
            };
        }

        public async Task<GuessNumberResponse> MakeGuessAsync(Guid playerId, GuessNumberRequest request)
        {
            _logger.LogInformation("Intento de adivinanza en el juego {GameId} por el jugador {PlayerId}.", request.GameId, playerId);

            var game = await _context.Games
                .FirstOrDefaultAsync(g => g.Id == request.GameId && g.PlayerId == playerId);

            if (game == null)
                throw new InvalidOperationException("Juego no encontrado o no pertenece a este usuario.");

            if (game.Status == "Finished")
                throw new InvalidOperationException($"El juego {game.Id} ya ha finalizado.");

            if (request.AttemptedNumber.Distinct().Count() != 4 || request.AttemptedNumber.Length != 4)
                throw new ArgumentException("El número debe tener 4 dígitos y no deben repetirse.");

            // Uso de ESCMB.GameCore
            var result = Evaluator.Validate(request.AttemptedNumber, game.SecretNumber);

            var attempt = new Attempt
            {
                GameId = game.Id,
                AttemptedNumber = request.AttemptedNumber,
                Famas = result.Fama,
                Picas = result.Pica,
                CreatedAt = DateTime.UtcNow
            };

            _context.Attempts.Add(attempt);

            if (result.Fama == 4)
            {
                game.Status = "Finished";
                _logger.LogInformation("El juego {GameId} ha finalizado. El usuario adivinó el número.", game.Id);
            }

            await _context.SaveChangesAsync();

            return new GuessNumberResponse
            {
                GameId = game.Id,
                AttemptedNumber = request.AttemptedNumber,
                Message = result.Message
            };
        }

        private string GenerateSecretNumber()
        {
            var rnd = new Random();
            var digits = Enumerable.Range(0, 10).OrderBy(x => rnd.Next()).Take(4).ToList();
            return string.Join("", digits);
        }
    }
}
