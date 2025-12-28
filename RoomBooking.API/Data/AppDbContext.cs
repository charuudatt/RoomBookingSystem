using Microsoft.EntityFrameworkCore;
using RoomBooking.API.Models;
using System.Collections.Generic;

namespace RoomBooking.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
    : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Room> Rooms { get; set; }
    public DbSet<Booking> Bookings { get; set; }

}
