# Room Booking Portal

A full-stack room booking application with Next.js frontend and Express.js backend.

## Project Structure

- **`/client`**: Next.js frontend application
- **`/server`**: Express.js backend API

## Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database

### Backend Setup (Server)

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Check `.env` file contains:
```
DATABASE_URL="your-postgresql-connection-string"
JWT_SECRET="your-secret-key"
PORT=5000
```

4. Seed the database with sample data:
```bash
python seed_data.py
```

5. Start the server:
```bash
npm run dev
```

The backend API will run on http://localhost:5000

### Frontend Setup (Client)

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend application will run on http://localhost:3000

## Testing the API

After running the backend server, you can test the API endpoints using:

1. The Tailwind test page at http://localhost:3000/tailwind-test
2. API testing tools like Postman or cURL
3. The example API requests documented in the project

## Features

- Authentication and authorization (JWT)
- Room management
- Building and department management
- Booking management
- Approval workflow for bookings
- Schedule management

## API Endpoints

### Auth
- `POST /api/auth/login` - Login for user/admin

### Public endpoints
- `GET /api/rooms` - List all rooms
- `GET /api/rooms/:id` - View room details
- `GET /api/bookings` - View all approved bookings
- `GET /api/bookings/room/:roomId` - View approved bookings for a room
- `GET /api/buildings` - View list of buildings
- `GET /api/departments` - View list of departments

### User endpoints
- `GET /api/bookings/my` - View user's bookings
- `GET /api/bookings/:id` - View specific booking
- `POST /api/bookings` - Create booking request

### Admin endpoints
- Department & Building Management
- Room Management
- Booking Management & Approval
- Schedule Management

For complete documentation of all endpoints, check the API documentation. 