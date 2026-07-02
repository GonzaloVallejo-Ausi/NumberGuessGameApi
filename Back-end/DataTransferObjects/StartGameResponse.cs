using System;
using System.Text.Json.Serialization;

namespace NumberGuessGameApi.DataTransferObjects
{
    public class StartGameResponse
    {
        [JsonPropertyName("gameId")]
        public int GameId { get; set; }
        
        [JsonPropertyName("playerid")]
        public Guid PlayerId { get; set; }

        [JsonPropertyName("createat")]
        public DateTime CreatedAt { get; set; }
    }
}
