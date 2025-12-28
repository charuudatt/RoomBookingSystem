using System.ComponentModel.DataAnnotations;

namespace RoomBooking.API.Models
{
    public class Booking
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        // Room information without foreign key
        public string RoomId { get; set; } = string.Empty;
        public string RoomName { get; set; } = string.Empty;

        // User information
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;

        // Booking details
        public DateTime Date { get; set; }
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        public string Purpose { get; set; } = string.Empty;
        public int Attendees { get; set; }

        // Status: pending | confirmed | cancelled
        public string Status { get; set; } = "pending";

        // Created timestamp
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
