using NumberGuessGameApi.DataTransferObjects;
using System.Threading.Tasks;

namespace NumberGuessGameApi.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterPlayerRequest request);
        Task<AuthResponse> LoginAsync(LoginRequest request);
    }
}
