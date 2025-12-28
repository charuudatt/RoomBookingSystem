using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace RoomBooking.API.Models
{
    public class Room
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = null!;

        [Required]
        public int Capacity { get; set; }

        [Required]
        public string Description { get; set; } = null!;

        public string? Image { get; set; }

        public bool IsActive { get; set; } = true;

        public string Amenities { get; set; } = "[]"; // store JSON string

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [NotMapped]
        public List<string> AmenitiesList
        {
            get => JsonConvert.DeserializeObject<List<string>>(Amenities) ?? new List<string>();
            set => Amenities = JsonConvert.SerializeObject(value);
        }
    }
}
