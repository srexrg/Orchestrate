# 🎭 Orchestrate - Event Management Microservices Platform

<div align="center">

![Orchestrate System Architecture](Screenshot%20from%202025-06-01%2020-44-51.png)

*A modern, scalable microservices architecture for event management*

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://docker.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue.svg)](https://postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-blueviolet.svg)](https://prisma.io/)

</div>

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Services](#services)
- [Getting Started](#getting-started)
- [Development](#development)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🌟 Overview

**Orchestrate** is a comprehensive event management platform built using microservices architecture. It provides a scalable, maintainable solution for organizing events, managing venues, handling user authentication, and tracking attendees.

### Key Features

- 🔐 **User Authentication & Authorization** with JWT
- 📅 **Event Management** with CRUD operations
- 🏢 **Venue Management** and capacity control
- 👥 **Attendee Registration** and tracking
- 🚪 **API Gateway** for unified access
- 🐳 **Containerized** with Docker
- 📊 **Database per Service** pattern
- 🔧 **Type-safe** with TypeScript

## 🏗️ Architecture

Our microservices architecture follows industry best practices with clear service boundaries and independent deployments.

### System Overview

```
Client Applications → API Gateway → Microservices → Databases
```

### Service Communication

- **Synchronous**: HTTP/REST API calls through API Gateway
- **Asynchronous**: Event-driven communication between services using RabbitMQ (e.g., for notifications)
- **Authentication**: JWT token validation across services
- **Database**: PostgreSQL with service-specific databases
- **Network**: Docker internal networking with service discovery

## 🛠️ Services

| Service | Port | Database | Responsibility |
|---------|------|----------|---------------|
| **API Gateway** | 3000 | - | Request routing, authentication, rate limiting |
| **Auth Service** | 3001 | auth_db (5433) | User management, JWT tokens, roles, event publishing |
| **Event Service** | 3002 | event_db (5434) | Event CRUD, status management |
| **Venue Service** | 3003 | venue_db (5435) | Venue management, capacity control |
| **Attendee Service** | 3004 | attendee_db (5436) | Registration, ticket management |
| **Notification Service** | N/A (Worker) | - | Consumes events (e.g., user registration) from RabbitMQ to send notifications (e.g., welcome emails) |

### Service Details

#### 🔐 Auth Service
- User registration and authentication
- JWT token generation and validation
- Role-based access control (ATTENDEE, ORGANIZER, ADMIN)
- Password hashing with bcrypt

#### 📅 Event Service
- Event creation, update, deletion
- Event status management (DRAFT, PUBLISHED, CANCELLED, COMPLETED)
- Organizer-specific event queries
- Event-attendee relationship management

#### 🏢 Venue Service
- Venue information management
- Capacity and availability tracking
- Venue search and filtering

#### 👥 Attendee Service
- Event registration management
- Ticket generation and validation
- Attendee status tracking
- Check-in functionality

#### 🚪 API Gateway
- Route proxying to appropriate services
- Centralized authentication middleware
- Request/response logging
- Rate limiting and security headers

#### 📧 Notification Service
- Consumes events published by other services via RabbitMQ.
- Handles asynchronous tasks like sending email notifications.
- Example: Sends welcome emails upon user registration events from the Auth Service.
- Utilizes a topic exchange (`EMAIL_NOTIFICATIONS_EXCHANGE`) for flexible event routing.

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **Docker** & **Docker Compose**
- **Git**

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/srexrg/orchestrate.git
   cd orchestrate
   ```

2. **Setup environment variables**
   ```bash
   # Copy environment template for each service
   cp services/auth-service/.env.example services/auth-service/.env
   cp services/event-service/.env.example services/event-service/.env
   cp services/venue-service/.env.example services/venue-service/.env
   cp services/attendee-service/.env.example services/attendee-service/.env
   cp services/api-gateway/.env.example services/api-gateway/.env
   # Add .env for notification-service if it requires specific env vars (e.g., for email service credentials)
   # cp services/notification-service/.env.example services/notification-service/.env
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Build shared package**
   ```bash
   cd shared && npm run build && cd ..
   ```

5. **Start databases**
   ```bash
   docker compose up -d auth-db event-db venue-db attendee-db
   ```

6. **Run migrations**
   ```bash
   # Run migrations for each service
   cd services/auth-service && npx prisma migrate dev && cd ../..
   cd services/event-service && npx prisma migrate dev && cd ../..
   ```

7. **Start all services**
   ```bash
   # Using npm workspaces (recommended for development)
   npm run dev:all
   
   # Or using Docker (recommended for production)
   docker compose up -d
   ```

8. **Verify services**
   ```bash
   curl http://localhost:3000/health
   ```

### Manual Setup

1. **Start services individually**
   ```bash
   # Terminal 1 - Auth Service
   cd services/auth-service && npm run dev
   
   # Terminal 2 - Event Service  
   cd services/event-service && npm run dev
   
   # Terminal 3 - Venue Service
   cd services/venue-service && npm run dev
   
   # Terminal 4 - Attendee Service
   cd services/attendee-service && npm run dev
   
   # Terminal 5 - API Gateway
   cd services/api-gateway && npm run dev

   # Terminal 6 - Notification Service (if running as a separate process)
   # cd services/notification-service && npm run dev
   ```

## 💻 Development

### Project Structure

```
orchestrate/
├── services/
│   ├── auth-service/          # User authentication & authorization, event publishing
│   ├── event-service/         # Event management & CRUD
│   ├── venue-service/         # Venue management
│   ├── attendee-service/      # Registration & ticket management
│   ├── notification-service/  # Event consumption & notifications (e.g., email)
│   └── api-gateway/           # Request routing & centralized auth
├── shared/                    # Common utilities, types & interfaces
│   ├── types/                 # TypeScript interfaces & enums
│   └── utils/                 # Shared utility classes
├── prisma/                    # Legacy - to be removed
├── src/                       # Legacy - to be removed
├── docker-compose.yml         # Service orchestration
├── package.json              # Workspace management
└── tsconfig.json             # Root TypeScript configuration
```

### Available Scripts

```bash
# Development
npm run dev:auth             # Start auth service only
npm run dev:event            # Start event service only
npm run dev:venue            # Start venue service only
npm run dev:attendee         # Start attendee service only
npm run dev:gateway          # Start API gateway only
npm run dev:notification     # Start notification service only
npm run dev:all              # Start all services (with concurrently)

# Docker
docker compose up -d         # Start with Docker
docker compose down          # Stop containers
docker compose logs -f       # View logs

# Database
cd services/<service-name>
npx prisma migrate dev       # Run migrations
npx prisma generate          # Generate Prisma client
npx prisma studio           # Open Prisma Studio

# Building
npm run build --workspaces   # Build all services
cd shared && npm run build   # Build shared package only
```

### Environment Variables

Each service uses environment variables for configuration:

**Auth Service:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/auth"
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"
PORT=3001
NODE_ENV=development
```

**Event Service:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5434/events"
AUTH_SERVICE_URL="http://localhost:3001"
PORT=3002
NODE_ENV=development
```

## 📚 API Documentation

### Authentication

All API requests (except registration/login) require authentication:

```bash
Authorization: Bearer <jwt_token>
```

### API Endpoints

#### Auth Service (`/api/auth`)
```bash
POST /api/auth/register        # User registration
POST /api/auth/login           # User login
POST /api/auth/refresh         # Refresh token
POST /api/auth/logout          # User logout
```

#### Event Service (`/api/events`)
```bash
GET    /api/events             # List events
POST   /api/events             # Create event
GET    /api/events/:id         # Get event details
PUT    /api/events/:id         # Update event
DELETE /api/events/:id         # Delete event
GET    /api/events/organizer   # Get organizer's events
```

#### Venue Service (`/api/venues`)
```bash
GET    /api/venues             # List venues
POST   /api/venues             # Create venue
GET    /api/venues/:id         # Get venue details
PUT    /api/venues/:id         # Update venue
DELETE /api/venues/:id         # Delete venue
```

#### Attendee Service (`/api/attendees`)
```bash
POST   /api/attendees/register # Register for event
GET    /api/attendees/tickets  # Get user tickets
POST   /api/attendees/checkin  # Check-in to event
GET    /api/attendees/events/:eventId # Get event attendees
```

### Example Requests

**Register User:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Create Event:**
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Tech Conference 2025",
    "description": "Annual tech conference",
    "date": "2025-12-01T10:00:00Z",
    "capacity": 100,
    "price": 99.99
  }'
```

**Get Events:**
```bash
curl -X GET http://localhost:3000/api/events \
  -H "Authorization: Bearer <token>"
```

## 🧪 Testing

### Running Tests

```bash
# Run tests for all services
npm test --workspaces

# Run tests for specific service
cd services/auth-service && npm test
```

### Test Structure

Each service contains:
- **Unit tests**: Testing individual functions and methods
- **Integration tests**: Testing API endpoints
- **Database tests**: Testing Prisma operations

## 🚀 Deployment

### Docker Production

1. **Build production images**
   ```bash
   docker compose build
   ```

2. **Deploy with production config**
   ```bash
   docker compose up -d
   ```

### Environment-specific Configs

- **Development**: `docker-compose.yml`
- **Production**: `docker-compose.prod.yml` (to be created)
- **Testing**: `docker-compose.test.yml` (to be created)

### Database Setup

Each service maintains its own database:

```bash
# Database ports for local development
Auth DB:     localhost:5433
Event DB:    localhost:5434  
Venue DB:    localhost:5435
Attendee DB: localhost:5436
```

## 🔧 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000-3004 and 5433-5436 are available
2. **Database connection**: Verify PostgreSQL containers are running
3. **JWT tokens**: Check JWT_SECRET environment variables match across services
4. **Prisma issues**: Run `npx prisma generate` after schema changes

### Debugging

```bash
# View service logs
docker compose logs auth-service
docker compose logs event-service

# Check service health
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:3002/health
```

## 🔮 Future Roadmap

- 🎫 **Payment Integration** (Stripe/PayPal)
- 📨 **Enhanced Event-Driven Capabilities** (e.g., exploring Kafka for high-throughput scenarios, dead-letter queue strategies for RabbitMQ)
- ⚡ **Caching Layer** with Redis  
- 📊 **Monitoring & Observability** (Prometheus, Grafana)
- 🔍 **Search Service** with Elasticsearch
- 📧 **Expanded Notification Channels** (SMS, Push notifications, in-app)
- 📱 **Mobile API** optimizations
- 🧪 **Comprehensive Testing** suite
- 🚀 **CI/CD Pipeline** with GitHub Actions
- ☁️ **Cloud Deployment** guides (AWS, GCP, Azure)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Update documentation
- Follow the existing code style
- Use conventional commit messages

### Setting up Development Environment

```bash
# Clone your fork
git clone https://github.com/srexrg/orchestrate.git
cd orchestrate

# Install dependencies
npm install

# Build shared package
cd shared && npm run build && cd ..

# Start development environment
npm run dev:all
```
