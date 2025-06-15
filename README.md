# EventPulse

EventPulse is a full-stack event management application that allows users to create, manage, and participate in events.

## Project Overview

This project consists of two main components:

- Frontend (React application)
- Backend (Node.js/Express API)

## Quick Start

### Using Docker Compose (Recommended)

1. Make sure you have Docker and Docker Compose installed
2. Clone the repository
3. Create a `.env` file in the root directory with the following variables:

```
# Server Environment Variables
PORT=5000
MONGO_DB_URL=mongodb+srv://root:root@eventpulse.6dubk.mongodb.net/?retryWrites=true&w=majority&appName=EventPulse
BASE_API_PATH=https://app.ticketmaster.com/discovery/v2
API_KEY=UhfSmuzp6h2tAPsSQrsJ0Cbc7BqvGQfL
JWT_SECRET=my_top_secret
REFRESH_TOKEN_SECRET=my_secure_secret

# Client Environment Variables
REACT_APP_API_URL=http://localhost:5000
```

4. Run the application:

```bash
docker-compose up --build
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Manual Setup

#### Backend Setup

1. Navigate to the server directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with the required environment variables
4. Start the server:

```bash
npm run dev
```

#### Frontend Setup

1. Navigate to the client directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with the required environment variables
4. Start the development server:

```bash
npm start
```

## Project Structure

```
eventpulse/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   ├── src/              # Source files
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── redux/        # Redux store and slices
│   │   ├── services/     # API services
│   │   └── utils/        # Utility functions
│   └── package.json      # Frontend dependencies
│
├── server/                # Backend Node.js application
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── common/           # Shared utilities
│   ├── __tests__/        # Test files
│   └── index.js          # Application entry point
│
├── docker-compose.yml    # Docker Compose configuration
└── README.md            # This file
```

## Features

- User authentication and authorization
- Event creation and management
- Event registration and participation
- Real-time updates
- Responsive design
- RESTful API

## Technologies Used

### Frontend

- React 18
- Material-UI (MUI) v5
- Redux Toolkit
- React Router
- Axios
- JWT

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Jest for testing
- Express Validator
- Bcrypt

## API Documentation

The backend API provides the following endpoints:

- `/api/auth` - Authentication routes
- `/api/events` - Event management routes
- `/api/users` - User management routes

## Development

### Running Tests

Backend tests:

```bash
cd server
npm test
```

### Code Style

- Frontend: ESLint with React configuration
- Backend: ESLint with Node.js configuration
