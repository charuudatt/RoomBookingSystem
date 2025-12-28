using System.Collections.Generic;

namespace RoomBooking.API.DTOs
{
    public class RoomDto
    {
        public string Name { get; set; } = null!;
        public int Capacity { get; set; }
        public string Description { get; set; } = null!;
        public string? Image { get; set; }
        public bool IsActive { get; set; } = true;
        public List<string> Amenities { get; set; } = new List<string>();
    }
}
