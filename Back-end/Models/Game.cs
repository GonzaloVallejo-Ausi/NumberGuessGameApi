using System;
using System.Collections.Generic;

namespace NumberGuessGameApi.Models
{
    public class Game
    {
        public int Id { get; set; }
        public Guid PlayerId { get; set; }
        public required string SecretNumber { get; set; }
        public required string Status { get; set; } = "Active"; // "Active", "Finished"
        public DateTime CreatedAt { get; set; }

        public Player Player { get; set; } = null!;
        public ICollection<Attempt> Attempts { get; set; } = new List<Attempt>();
    }
}
