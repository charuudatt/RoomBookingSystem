#  Room Booking Management System

A full-stack **Room Booking Management System** developed using **React + TypeScript** for the frontend and **ASP.NET Core Web API** for the backend.  
This project demonstrates secure authentication, role-based authorization, clean architecture, and modern UI practices.

---

##  Project Purpose

This application was built as part of a **technical coding assignment** to demonstrate real-world software development skills, including:

- Secure authentication & authorization
- RESTful API design
- Clean, maintainable code
- Modern frontend UI/UX
- Backend–frontend integration

---

##  Features

###  Authentication & Authorization
- JWT-based authentication
- Encrypted passwords using **BCrypt**
- Role-based access control (Admin only)
- Protected routes on frontend

###  Room Booking Management
- Admin login portal
- Secure session handling
- Scalable backend design for room & booking management

###  User Interface
- Responsive design
- Clean, modern UI
- User-friendly notifications
- Loading and error handling states

---

##  Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- React Router DOM
- Lucide Icons
- Sonner (Toast Notifications)

### Backend
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- JWT Authentication
- BCrypt Password Hashing

---

##  Demo Admin Credentials
Email: admin@sachin.tech
Password: admin123

---

##  Project Structure

RoomBookingSystem/
│
├── RoomBooking.API/ # ASP.NET Core Web API
│ ├── Controllers/
│ ├── Data/
│ ├── Models/
│ ├── appsettings.json
│ ├── Program.cs
│
├── room-booking-ui/ # React Frontend
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── context/
│ │ ├── routes/
│ ├── package.json
│
└── README.md

yaml
Copy code

---

##  Backend Setup

### Prerequisites
- .NET 7 SDK
- SQL Server
- Visual Studio

### Steps
1. Open `RoomBooking.API` in Visual Studio
2. Update `appsettings.json` with your SQL Server connection string
3. Install required NuGet packages:
   - Microsoft.EntityFrameworkCore
   - Microsoft.EntityFrameworkCore.SqlServer
   - Microsoft.AspNetCore.Authentication.JwtBearer
   - BCrypt.Net-Next
4. Run the project
5. Admin user is auto-seeded on first run

---

##  Frontend Setup

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Steps
```bash
npm install
npm run dev
