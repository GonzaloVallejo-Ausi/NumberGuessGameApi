using System.Text.Json.Serialization;

namespace NumberGuessGameApi.DataTransferObjects
{
    public class GuessNumberResponse
    {
        [JsonPropertyName("gameId")]
        public int GameId { get; set; }

        [JsonPropertyName("attemptedNumber")]
        public string AttemptedNumber { get; set; } = string.Empty;

        [JsonPropertyName("famas")]
        public int Famas { get; set; }

        [JsonPropertyName("picas")]
        public int Picas { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; } = string.Empty;

        [JsonPropertyName("message")]
        public string Message { get; set; } = string.Empty;
    }
}
