# 🎭 Orchestrate Microservices Manual Test Guide

This guide provides step-by-step manual testing of your microservices architecture.

## Prerequisites
- All services running via `docker-compose up`
- `curl` and `jq` installed (for JSON parsing)

## Service URLs
- **Auth Service**: http://localhost:3001
- **Event Service**: http://localhost:3002  
- **Venue Service**: http://localhost:3003
- **Attendee Service**: http://localhost:3004
- **API Gateway**: http://localhost:3000

## 1. Health Checks ✅

Test all services are running:

```bash
curl http://localhost:3001/health  # Auth Service
curl http://localhost:3002/health  # Event Service  
curl http://localhost:3003/health  # Venue Service
curl http://localhost:3004/health  # Attendee Service
curl http://localhost:3000/health  # API Gateway
```

**Expected**: All should return `{"status":"ok"}`

## 2. User Registration & Authentication 🔐

### Register Users

**Admin User:**
```bash
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123",
    "name": "Admin User",
    "roles": ["ADMIN"]
  }'
```

{"statusCode":201,"data":{"user":{"id":"f5504e74-0cb0-4652-bd44-63b7c2b5a91f","email":"admin@test.com","name":"Admin User","roles":["ADMIN"]},"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNTUwNGU3NC0wY2IwLTQ2NTItYmQ0NC02M2I3YzJiNWE5MWYiLCJyb2xlcyI6WyJBRE1JTiJdLCJpYXQiOjE3NDg5NjYyMDAsImV4cCI6MTc0OTA1MjYwMH0.jdD-ytL19DrBeohbX-mQaVmSS-_KfeDWt8ealqTFh_Q"},"message":"User registered successfully","success":true}% 

**Organizer User:**
```bash
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "organizer@test.com", 
    "password": "organizer123",
    "name": "Event Organizer",
    "roles": ["ORGANIZER"]
  }'
```

**Attendee User:**
```bash
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "attendee@test.com",
    "password": "attendee123", 
    "name": "Event Attendee",
    "roles": ["ATTENDEE"]
  }'
```

**Save the access tokens** from responses for subsequent requests!

### Test Login
```bash
curl -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "attendee@test.com",
    "password": "attendee123"
  }'
```

## 3. Venue Management (Admin Only) 🏢

### Create Venue
```bash
curl -X POST http://localhost:3003/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNTUwNGU3NC0wY2IwLTQ2NTItYmQ0NC02M2I3YzJiNWE5MWYiLCJyb2xlcyI6WyJBRE1JTiJdLCJpYXQiOjE3NDg5NjYyMDAsImV4cCI6MTc0OTA1MjYwMH0.jdD-ytL19DrBeohbX-mQaVmSS-_KfeDWt8ealqTFh_Q"" \
  -d '{
    "name": "Convention Center",
    "address": "123 Main St",
    "capacity": 500
  }'
```

**Save the venue ID** from response!

### Get All Venues (Public)
```bash
curl http://localhost:3003/
```

### Get Specific Venue
```bash
curl http://localhost:3003/YOUR_VENUE_ID
```

## 4. Event Management (Organizer) 🎪

### Create Event (Tests Venue Validation)
```bash
curl -X POST http://localhost:3002/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ORGANIZER_TOKEN" \
  -d '{
    "title": "Tech Conference 2025",
    "description": "Annual tech conference",
    "date": "2025-12-15T10:00:00Z",
    "venueId": "YOUR_VENUE_ID",
    "capacity": 200,
    "price": 99.99
  }'
```

**This tests cross-service communication**: Event service validates venue exists and has sufficient capacity.

**Save the event ID** from response!

### Get Event Details
```bash
curl http://localhost:3002/YOUR_EVENT_ID
```

### Check Venue Availability
```bash
curl -X POST http://localhost:3002/venue-availability \
  -H "Content-Type: application/json" \
  -d '{
    "venueIds": ["YOUR_VENUE_ID"],
    "date": "2025-12-15T10:00:00Z"
  }'
```

## 5. Attendee Registration (Cross-Service) 🎫

### Check Registration Availability
```bash
curl http://localhost:3002/YOUR_EVENT_ID/registration-availability
```

**This tests cross-service communication**: Event service checks with Attendee service for current registrations.

### Register for Event
```bash
curl -X POST http://localhost:3004/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ATTENDEE_TOKEN" \
  -d '{
    "eventId": "YOUR_EVENT_ID"
  }'
```

**This tests cross-service communication**: Attendee service validates event exists via Event service.

### Check Registration Status
```bash
curl -H "Authorization: Bearer YOUR_ATTENDEE_TOKEN" \
  http://localhost:3004/event/YOUR_EVENT_ID/status
```

### Get User's Events
```bash
curl -H "Authorization: Bearer YOUR_ATTENDEE_TOKEN" \
  http://localhost:3004/user/events
```

## 6. Organizer Operations 👨‍💼

### Get Organizer's Events
```bash
curl -H "Authorization: Bearer YOUR_ORGANIZER_TOKEN" \
  http://localhost:3002/organizer/events
```

### Get Event Attendees  
```bash
curl -H "Authorization: Bearer YOUR_ORGANIZER_TOKEN" \
  http://localhost:3004/event/YOUR_EVENT_ID
```

**This tests cross-service communication**: Organizer can view attendee list across services.

## 7. Security Testing 🛡️

### Test Unauthenticated Access (Should Fail)
```bash
curl http://localhost:3002/organizer/events
# Expected: 401 Unauthorized
```

### Test Wrong Role Access (Should Fail)
```bash
curl -X POST http://localhost:3003/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ATTENDEE_TOKEN" \
  -d '{
    "name": "Unauthorized Venue",
    "address": "Nowhere", 
    "capacity": 100
  }'
# Expected: 403 Forbidden (Attendee can't create venues)
```

## 8. Update Operations ✏️

### Update Event
```bash
curl -X PUT http://localhost:3002/YOUR_EVENT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ORGANIZER_TOKEN" \
  -d '{
    "title": "Tech Conference 2025 - Updated",
    "capacity": 250
  }'
```

### Update Venue
```bash
curl -X PUT http://localhost:3003/YOUR_VENUE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Convention Center - Renovated",
    "capacity": 600
  }'
```

## 9. Cleanup Operations 🧹

### Cancel Registration
```bash
curl -X DELETE http://localhost:3004/event/YOUR_EVENT_ID \
  -H "Authorization: Bearer YOUR_ATTENDEE_TOKEN"
```

### Delete Event
```bash
curl -X DELETE http://localhost:3002/YOUR_EVENT_ID \
  -H "Authorization: Bearer YOUR_ORGANIZER_TOKEN"
```

### Delete Venue
```bash
curl -X DELETE http://localhost:3003/YOUR_VENUE_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## 🎯 What This Tests

### ✅ Core Functionality
- User authentication and authorization
- Role-based access control (ADMIN, ORGANIZER, ATTENDEE)
- CRUD operations across all services
- Data validation and error handling

### ✅ Cross-Service Communication
- **Event ↔ Venue**: Venue validation during event creation
- **Event ↔ Attendee**: Registration availability checks  
- **Attendee ↔ Event**: Event validation during registration
- **All Services ↔ Auth**: JWT token validation

### ✅ Security Features  
- JWT authentication across microservices
- Protected routes and proper error responses
- Role-based access control enforcement

### ✅ Data Integrity
- Registration constraints and availability
- Event-attendee relationship management
- Proper foreign key validations

## 🚀 Success Indicators

If all tests pass, you've successfully demonstrated:
1. **Microservices Architecture**: Independent services communicating effectively
2. **Security**: JWT-based authentication and role-based authorization
3. **Data Consistency**: Cross-service data validation and integrity
4. **Error Handling**: Proper HTTP status codes and error messages
5. **Business Logic**: Complete event management workflow

Your microservices architecture is production-ready! 🎉
