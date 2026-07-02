using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace NumberGuessGameApi.DataTransferObjects
{
    public class GuessNumberRequest
    {
        [Required]
        [JsonPropertyName("gameId")]
        public int GameId { get; set; }

        [Required]
        [StringLength(4, MinimumLength = 4)]
        [JsonPropertyName("attemptedNumber")]
        public string AttemptedNumber { get; set; } = string.Empty;
    }
}
