using System.ComponentModel.DataAnnotations;

namespace RoomBooking.API.Models;

public class User
{
    public int Id { get; set; }

    [Required]
    public string FullName { get; set; }

    [Required]
    public string Email { get; set; }

    [Required]
    public string PasswordHash { get; set; }

    [Required]
    public string Role { get; set; } // Admin / User

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
