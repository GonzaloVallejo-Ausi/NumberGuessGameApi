using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using NumberGuessGameApi.Data;
using NumberGuessGameApi.DataTransferObjects;
using NumberGuessGameApi.Models;

namespace NumberGuessGameApi.Services
{
    public class AuthService : IAuthService
    {
        private readonly GameDbContext _context;
        private readonly IConfiguration _config;
        private readonly ILogger<AuthService> _logger;

        public AuthService(GameDbContext context, IConfiguration config, ILogger<AuthService> logger)
        {
            _context = context;
            _config = config;
            _logger = logger;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterPlayerRequest request)
        {
            _logger.LogInformation("Intentando registrar al usuario: {Email}", request.Email);

            if (await _context.Players.AnyAsync(p => p.Email == request.Email))
            {
                _logger.LogWarning("El correo {Email} ya está registrado.", request.Email);
                throw new InvalidOperationException("El correo ya se encuentra registrado.");
            }

            var player = new Player
            {
                Id = Guid.NewGuid(),
                FirstName = request.FirstName,
                LastName = request.LastName,
                Age = request.Age,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                CreatedAt = DateTime.UtcNow
            };

            _context.Players.Add(player);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Usuario registrado exitosamente con ID: {Id}", player.Id);

            var token = GenerateJwtToken(player);
            return new AuthResponse { token = token };
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            _logger.LogInformation("Intentando autenticar al usuario: {Email}", request.Email);

            var player = await _context.Players.SingleOrDefaultAsync(p => p.Email == request.Email);
            if (player == null || !BCrypt.Net.BCrypt.Verify(request.Password, player.PasswordHash))
            {
                _logger.LogWarning("Credenciales inválidas para el correo {Email}.", request.Email);
                throw new UnauthorizedAccessException("Usuario o contraseña incorrectos.");
            }

            var token = GenerateJwtToken(player);
            _logger.LogInformation("Usuario autenticado exitosamente: {Id}", player.Id);
            
            return new AuthResponse { token = token };
        }

        private string GenerateJwtToken(Player player)
        {
            var jwtSettings = _config.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, player.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, player.Email),
                new Claim("playerId", player.Id.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
