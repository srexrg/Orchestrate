# Manual Curl Testing Commands for Orchestrate Microservices

This guide provides curl commands to manually test all microservices and their interactions.

## 1. Health Checks

```bash
# Test all service health endpoints
curl http://localhost:3001/health  # Auth Service
curl http://localhost:3002/health  # Event Service  
curl http://localhost:3003/health  # Venue Service
curl http://localhost:3004/health  # Attendee Service
curl http://localhost:3000/health  # API Gateway
```

## 2. Authentication Service (Port 3001)

### Register Users
```bash
# Register Admin User
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@orchestrate.com",
    "password": "admin123",
    "name": "Admin User",
    "roles": ["ADMIN"]
  }' | jq '.'

# Register Organizer User
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "organizer@orchestrate.com", 
    "password": "organizer123",
    "name": "Event Organizer",
    "roles": ["ORGANIZER"]
  }' | jq '.'

# Register Attendee User
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "attendee@orchestrate.com",
    "password": "attendee123", 
    "name": "Event Attendee",
    "roles": ["ATTENDEE"]
  }' | jq '.'
```

### Login Users (Get Tokens)
```bash
# Login Admin (copy the accessToken from response)
curl -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@orchestrate.com",
    "password": "admin123"
  }' | jq '.'

# Login Organizer (copy the accessToken from response)
curl -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "organizer@orchestrate.com",
    "password": "organizer123"
  }' | jq '.'

# Login Attendee (copy the accessToken from response)
curl -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "attendee@orchestrate.com",
    "password": "attendee123"
  }' | jq '.'
```

## 3. Set Token Variables

After login, set these environment variables with the actual tokens:

```bash
# Replace these with actual tokens from login responses
export ADMIN_TOKEN="your-admin-jwt-token-here"
export ORGANIZER_TOKEN="your-organizer-jwt-token-here" 
export ATTENDEE_TOKEN="your-attendee-jwt-token-here"
```

## 4. Venue Service (Port 3003) - Admin Operations

### Create Venue
```bash
curl -X POST http://localhost:3003/venues \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "Grand Convention Center",
    "address": "123 Main Street, Downtown",
    "capacity": 500,
    "amenities": ["WiFi", "Parking", "Catering", "AV Equipment"]
  }' | jq '.'
```

### Get All Venues
```bash
curl -X GET http://localhost:3003/venues \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'
```

### Get Venue by ID
```bash
# Replace VENUE_ID with actual ID from create response
export VENUE_ID="your-venue-id-here"

curl -X GET http://localhost:3003/venues/$VENUE_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'
```

### Update Venue
```bash
curl -X PUT http://localhost:3003/venues/$VENUE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "Grand Convention Center - Updated",
    "capacity": 600,
    "amenities": ["WiFi", "Parking", "Catering", "AV Equipment", "Stage"]
  }' | jq '.'
```

## 5. Event Service (Port 3002) - Organizer Operations

### Create Event
```bash
curl -X POST http://localhost:3002/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ORGANIZER_TOKEN" \
  -d '{
    "title": "Tech Conference 2025",
    "description": "Annual technology conference featuring the latest innovations",
    "startDate": "2025-08-15T09:00:00Z",
    "endDate": "2025-08-15T17:00:00Z", 
    "venueId": "'$VENUE_ID'",
    "maxAttendees": 300,
    "ticketPrice": 99.99
  }' | jq '.'
```

### Get All Events
```bash
curl -X GET http://localhost:3002/events \
  -H "Authorization: Bearer $ORGANIZER_TOKEN" | jq '.'
```

### Get Event by ID
```bash
# Replace EVENT_ID with actual ID from create response
export EVENT_ID="your-event-id-here"

curl -X GET http://localhost:3002/events/$EVENT_ID \
  -H "Authorization: Bearer $ORGANIZER_TOKEN" | jq '.'
```

### Update Event
```bash
curl -X PUT http://localhost:3002/events/$EVENT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ORGANIZER_TOKEN" \
  -d '{
    "title": "Tech Conference 2025 - Extended",
    "maxAttendees": 350,
    "ticketPrice": 89.99
  }' | jq '.'
```

## 6. Attendee Service (Port 3004) - Registration Operations

### Register for Event
```bash
curl -X POST http://localhost:3004/registrations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ATTENDEE_TOKEN" \
  -d '{
    "eventId": "'$EVENT_ID'"
  }' | jq '.'
```

### Get User's Registrations
```bash
curl -X GET http://localhost:3004/registrations \
  -H "Authorization: Bearer $ATTENDEE_TOKEN" | jq '.'
```

### Get Registration Status for Event
```bash
curl -X GET "http://localhost:3004/registrations/status?eventId=$EVENT_ID" \
  -H "Authorization: Bearer $ATTENDEE_TOKEN" | jq '.'
```

### Cancel Registration
```bash
curl -X DELETE "http://localhost:3004/registrations/$EVENT_ID" \
  -H "Authorization: Bearer $ATTENDEE_TOKEN" | jq '.'
```

## 7. Cross-Service Communication Tests

### Check Event Attendees (Organizer View)
```bash
curl -X GET "http://localhost:3002/events/$EVENT_ID/attendees" \
  -H "Authorization: Bearer $ORGANIZER_TOKEN" | jq '.'
```

### Check Venue Availability
```bash
curl -X GET "http://localhost:3003/venues/$VENUE_ID/availability" \
  -H "Authorization: Bearer $ORGANIZER_TOKEN" | jq '.'
```

### Check Registration Availability
```bash
curl -X GET "http://localhost:3004/events/$EVENT_ID/availability" \
  -H "Authorization: Bearer $ATTENDEE_TOKEN" | jq '.'
```

## 8. API Gateway Tests (Port 3000)

All the above endpoints should also work through the API Gateway:

```bash
# Example: Create venue through API Gateway
curl -X POST http://localhost:3000/venues \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "Secondary Venue",
    "address": "456 Oak Avenue",
    "capacity": 200,
    "amenities": ["WiFi", "Parking"]
  }' | jq '.'

# Example: Register for event through API Gateway  
curl -X POST http://localhost:3000/registrations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ATTENDEE_TOKEN" \
  -d '{
    "eventId": "'$EVENT_ID'"
  }' | jq '.'
```

## 9. Error Testing

### Test Unauthorized Access
```bash
# Try to create venue without admin token
curl -X POST http://localhost:3003/venues \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ATTENDEE_TOKEN" \
  -d '{
    "name": "Test Venue",
    "address": "Test Address", 
    "capacity": 100
  }' | jq '.'
```

### Test Invalid Event Registration
```bash
# Try to register for non-existent event
curl -X POST http://localhost:3004/registrations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ATTENDEE_TOKEN" \
  -d '{
    "eventId": "non-existent-event-id"
  }' | jq '.'
```

### Test Duplicate Registration
```bash
# Try to register for same event twice
curl -X POST http://localhost:3004/registrations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ATTENDEE_TOKEN" \
  -d '{
    "eventId": "'$EVENT_ID'"
  }' | jq '.'
```

## 10. Cleanup Operations

### Delete Event
```bash
curl -X DELETE http://localhost:3002/events/$EVENT_ID \
  -H "Authorization: Bearer $ORGANIZER_TOKEN" | jq '.'
```

### Delete Venue
```bash
curl -X DELETE http://localhost:3003/venues/$VENUE_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'
```

## Quick Test Sequence

Here's a condensed sequence to test the full flow:

```bash
# 1. Login and get tokens
ADMIN_RESPONSE=$(curl -s -X POST http://localhost:3001/login -H "Content-Type: application/json" -d '{"email": "admin@orchestrate.com", "password": "admin123"}')
ADMIN_TOKEN=$(echo $ADMIN_RESPONSE | jq -r '.data.accessToken')

ORGANIZER_RESPONSE=$(curl -s -X POST http://localhost:3001/login -H "Content-Type: application/json" -d '{"email": "organizer@orchestrate.com", "password": "organizer123"}') 
ORGANIZER_TOKEN=$(echo $ORGANIZER_RESPONSE | jq -r '.data.accessToken')

ATTENDEE_RESPONSE=$(curl -s -X POST http://localhost:3001/login -H "Content-Type: application/json" -d '{"email": "attendee@orchestrate.com", "password": "attendee123"}')
ATTENDEE_TOKEN=$(echo $ATTENDEE_RESPONSE | jq -r '.data.accessToken')

# 2. Create venue
VENUE_RESPONSE=$(curl -s -X POST http://localhost:3003/venues -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" -d '{"name": "Test Venue", "address": "123 Test St", "capacity": 100, "amenities": ["WiFi"]}')
VENUE_ID=$(echo $VENUE_RESPONSE | jq -r '.data.id')

# 3. Create event
EVENT_RESPONSE=$(curl -s -X POST http://localhost:3002/events -H "Content-Type: application/json" -H "Authorization: Bearer $ORGANIZER_TOKEN" -d '{"title": "Test Event", "description": "Test Description", "startDate": "2025-08-15T09:00:00Z", "endDate": "2025-08-15T17:00:00Z", "venueId": "'$VENUE_ID'", "maxAttendees": 50, "ticketPrice": 25.00}')
EVENT_ID=$(echo $EVENT_RESPONSE | jq -r '.data.id')

# 4. Register for event
curl -X POST http://localhost:3004/registrations -H "Content-Type: application/json" -H "Authorization: Bearer $ATTENDEE_TOKEN" -d '{"eventId": "'$EVENT_ID'"}' | jq '.'

# 5. Check registration
curl -X GET http://localhost:3004/registrations -H "Authorization: Bearer $ATTENDEE_TOKEN" | jq '.'

echo "✅ Full test sequence completed!"
echo "Venue ID: $VENUE_ID"
echo "Event ID: $EVENT_ID"
```

## Notes

- Replace `your-*-token-here` and `your-*-id-here` with actual values from API responses
- Use `| jq '.'` to format JSON responses nicely
- Check HTTP status codes - 200/201 for success, 4xx/5xx for errors
- All services should be running via `docker-compose up`
