# Wersel CRM Backend

This is the production-grade backend for the Wersel CRM system, built with Node.js, Express, and MongoDB.

## Features
- **Lead Management**: Capture, qualify, and convert leads.
- **Account & Contact Tracking**: Manage customer relationships.
- **Sales Pipeline**: Opportunity tracking with automated project creation.
- **AI Project Delivery**: Manage AI projects, phases, and model configurations.
- **RBAC Security**: Role-based access control with JWT authentication.
- **Automated Workflows**: Event-driven architecture for business processes.
- **API Documentation**: Interactive Swagger UI.

## Tech Stack
- **Node.js** & **Express.js**
- **MongoDB Atlas** with **Mongoose**
- **JWT** for Authentication
- **Winston** for Logging
- **Swagger** for Documentation
- **Docker** for Containerization

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)

### Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=24h
   NODE_ENV=development
   ```

### Running the App
- **Development**: `npm run dev`
- **Production**: `npm start`
- **Docker**: `docker-compose up --build`

## API Documentation
Once the server is running, visit:
`http://localhost:3000/api-docs`

## Project Structure
- `src/models`: Mongoose schemas.
- `src/services`: Business logic & services.
- `src/controllers`: Route handlers.
- `src/routes`: API endpoint definitions.
- `src/middleware`: Auth & Error handling.
- `src/events`: Event emitters and handlers.
- `src/utils`: Helper functions.
