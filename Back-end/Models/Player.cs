using System;
using System.Collections.Generic;

namespace NumberGuessGameApi.Models
{
    public class Player
    {
        public Guid Id { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public int Age { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }
        public DateTime CreatedAt { get; set; }

        public ICollection<Game> Games { get; set; } = new List<Game>();
    }
}
