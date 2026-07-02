using System;

namespace NumberGuessGameApi.Models
{
    public class Attempt
    {
        public int Id { get; set; }
        public int GameId { get; set; }
        public required string AttemptedNumber { get; set; }
        public int Famas { get; set; }
        public int Picas { get; set; }
        public DateTime CreatedAt { get; set; }

        public Game Game { get; set; } = null!;
    }
}
