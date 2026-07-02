using System;
using System.Threading.Tasks;
using NumberGuessGameApi.DataTransferObjects;

namespace NumberGuessGameApi.Services
{
    public interface IGameService
    {
        Task<StartGameResponse> StartGameAsync(Guid playerId);
        Task<GuessNumberResponse> MakeGuessAsync(Guid playerId, GuessNumberRequest request);
    }
}
