using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RoomBooking.API.Data;
using RoomBooking.API.DTOs;
using RoomBooking.API.Models;

namespace RoomBooking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingsController : ControllerBase
{
    private readonly AppDbContext _context;

    public BookingsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Bookings
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Booking>>> GetBookings()
    {
        var bookings = await _context.Bookings.OrderByDescending(b => b.Date).ToListAsync();
        return Ok(bookings);
    }

    // POST: api/Bookings
    [HttpPost]
    public async Task<ActionResult<Booking>> CreateBooking([FromBody] BookingDto dto)
    {
        var booking = new Booking
        {
            Id = Guid.NewGuid().ToString(),
            RoomId = dto.RoomId,
            RoomName = dto.RoomName,
            UserName = dto.UserName,
            UserEmail = dto.UserEmail,
            Date = dto.Date,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            Purpose = dto.Purpose,
            Attendees = dto.Attendees,
            Status = "pending",
            CreatedAt = DateTime.UtcNow
        };

        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();

        return Ok(booking);
    }

    // PUT: api/Bookings/confirm/{id}
    [HttpPut("confirm/{id}")]
    public async Task<IActionResult> ConfirmBooking(string id)
    {
        var booking = await _context.Bookings.FindAsync(id);
        if (booking == null) return NotFound();
        booking.Status = "confirmed";
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // PUT: api/Bookings/cancel/{id}
    [HttpPut("cancel/{id}")]
    public async Task<IActionResult> CancelBooking(string id)
    {
        var booking = await _context.Bookings.FindAsync(id);
        if (booking == null) return NotFound();
        booking.Status = "cancelled";
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
