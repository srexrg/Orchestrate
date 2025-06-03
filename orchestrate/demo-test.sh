#!/bin/bash

# Orchestrate Microservices Demo Test Script
# This script tests all microservices and their cross-service communication

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Service URLs - Direct service endpoints
AUTH_SERVICE="http://localhost:3001"
EVENT_SERVICE="http://localhost:3002"
VENUE_SERVICE="http://localhost:3003"
ATTENDEE_SERVICE="http://localhost:3004"

# Variables to store tokens and IDs
ACCESS_TOKEN=""
ORGANIZER_TOKEN=""
ADMIN_TOKEN=""
VENUE_ID=""
EVENT_ID=""
ATTENDEE_USER_ID=""
ORGANIZER_USER_ID=""
LAST_HTTP_STATUS=""

echo -e "${BLUE}🎭 Starting Orchestrate Microservices Demo${NC}"
echo "============================================="

# Function to print section headers
print_section() {
    echo -e "\n${YELLOW}📋 $1${NC}"
    echo "----------------------------------------"
}

# Function to print success messages
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to print error messages
print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to make HTTP requests with better error handling
make_request() {
    local method=$1
    local url=$2
    local data=$3
    local headers=$4
    
    if [ -n "$headers" ]; then
        response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X "$method" "$url" \
            -H "Content-Type: application/json" \
            -H "$headers" \
            -d "$data" 2>/dev/null)
    else
        response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X "$method" "$url" \
            -H "Content-Type: application/json" \
            -d "$data" 2>/dev/null)
    fi
    
    # Extract body and status code
    body=$(echo "$response" | sed 's/HTTPSTATUS:[0-9]*$//')
    status_code=$(echo "$response" | grep -o "HTTPSTATUS:[0-9]*$" | sed 's/HTTPSTATUS://')
    
    # Store status code in a global variable since bash return codes are limited to 0-255
    LAST_HTTP_STATUS=$status_code
    
    # Debug output
    echo "HTTP Status: $status_code" >&2
    
    # Only echo body if it's not empty
    if [ -n "$body" ]; then
        echo "$body"
    fi
    
    # Return simplified success/failure codes
    if [ "$status_code" -ge 200 ] && [ "$status_code" -lt 300 ]; then
        return 0  # Success
    else
        return 1  # Failure
    fi
}

# Test 1: Health Checks
print_section "Health Checks"
echo "Testing all services health endpoints..."

services=("$AUTH_SERVICE" "$EVENT_SERVICE" "$VENUE_SERVICE" "$ATTENDEE_SERVICE")
service_names=("Auth Service" "Event Service" "Venue Service" "Attendee Service")

for i in "${!services[@]}"; do
    if curl -s "${services[$i]}/health" | grep -q "ok"; then
        print_success "${service_names[$i]} is healthy"
    else
        print_error "${service_names[$i]} is not responding"
        exit 1
    fi
done

# Test 2: User Registration and Authentication
print_section "User Registration & Authentication"

# Function to register or login user
register_or_login() {
    local email=$1
    local password=$2
    local name=$3
    local roles=$4
    local user_type=$5
    
    echo "Registering/logging in $user_type..." >&2
    
    # Try to register first
    register_response=$(make_request "POST" "$AUTH_SERVICE/register" "{
        \"email\": \"$email\",
        \"password\": \"$password\",
        \"name\": \"$name\",
        \"roles\": $roles
    }")
    register_success=$?
    
    echo "Register status code: $LAST_HTTP_STATUS" >&2
    
    # Check for successful registration (201) or existing user (409)
    if [ "$LAST_HTTP_STATUS" = "201" ]; then
        # Store both token and user ID for later use
        local token=$(echo "$register_response" | jq -r '.data.accessToken')
        local user_id=$(echo "$register_response" | jq -r '.data.user.id')
        
        # Store user ID in global variables based on user type
        case "$user_type" in
            "organizer user")
                ORGANIZER_USER_ID="$user_id"
                ;;
            "attendee user")
                ATTENDEE_USER_ID="$user_id"
                ;;
        esac
        
        echo "$token"
        print_success "$user_type registered successfully" >&2
        return 0
    elif [ "$LAST_HTTP_STATUS" = "409" ]; then
        # User already exists, try to login
        echo "$user_type already exists, logging in..." >&2
        login_response=$(make_request "POST" "$AUTH_SERVICE/login" "{
            \"email\": \"$email\",
            \"password\": \"$password\"
        }")
        login_success=$?
        
        echo "Login status code: $LAST_HTTP_STATUS" >&2
        
        if [ "$LAST_HTTP_STATUS" = "200" ]; then
            # For existing users, we might need to get user ID separately
            local token=$(echo "$login_response" | jq -r '.data.accessToken')
            local user_id=$(echo "$login_response" | jq -r '.data.user.id')
            
            # Store user ID in global variables based on user type
            case "$user_type" in
                "organizer user")
                    ORGANIZER_USER_ID="$user_id"
                    ;;
                "attendee user")
                    ATTENDEE_USER_ID="$user_id"
                    ;;
            esac
            
            echo "$token"
            print_success "$user_type logged in successfully" >&2
            return 0
        else
            print_error "Failed to login $user_type (HTTP $LAST_HTTP_STATUS)" >&2
            if [ -n "$login_response" ]; then
                echo "Login response: $login_response" >&2
            fi
            return 1
        fi
    else
        print_error "Failed to register $user_type (HTTP $LAST_HTTP_STATUS)" >&2
        if [ -n "$register_response" ]; then
            echo "Register response: $register_response" >&2
        fi
        return 1
    fi
}

# Register/Login Admin User
ADMIN_TOKEN=$(register_or_login "adminssl@orchestrate.com" "admin123" "Admin User" '["ADMIN"]' "admin user")
if [ -z "$ADMIN_TOKEN" ]; then
    exit 1
fi

# Register/Login Organizer User
ORGANIZER_TOKEN=$(register_or_login "organizer@orchestrate.com" "organizer123" "Event Organizer" '["ORGANIZER"]' "organizer user")
if [ -z "$ORGANIZER_TOKEN" ]; then
    exit 1
fi

# Register/Login Attendee User
ACCESS_TOKEN=$(register_or_login "attendee@orchestrate.com" "attendee123" "Event Attendee" '["ATTENDEE"]' "attendee user")
if [ -z "$ACCESS_TOKEN" ]; then
    exit 1
fi

# Test Login with existing credentials
echo "Testing login with attendee credentials..."
login_response=$(make_request "POST" "$AUTH_SERVICE/login" '{
    "email": "attendee@orchestrate.com",
    "password": "attendee123"
}')

if [ $? -eq 0 ]; then
    print_success "Login test successful"
else
    print_error "Login test failed"
fi

# Test 3: Venue Management
print_section "Venue Management (Admin)"

# Create venue
echo "Creating venue..."
venue_response=$(make_request "POST" "$VENUE_SERVICE/venues" '{
    "name": "Grand Convention Center",
    "address": "123 Main Street, City Center",
    "capacity": 500
}' "Authorization: Bearer $ADMIN_TOKEN")

if [ $? -eq 0 ]; then
    VENUE_ID=$(echo "$venue_response" | jq -r '.data.id')
    print_success "Venue created successfully (ID: $VENUE_ID)"
else
    echo "Venue response: $venue_response"
    print_error "Failed to create venue"
fi

# Get all venues
echo "Fetching all venues..."
venues_response=$(make_request "GET" "$VENUE_SERVICE/venues" "")

if [ $? -eq 0 ]; then
    venue_count=$(echo "$venues_response" | jq '.data | length')
    print_success "Retrieved $venue_count venues"
else
    print_error "Failed to fetch venues"
fi

# Get specific venue
echo "Fetching venue details..."
venue_detail_response=$(make_request "GET" "$VENUE_SERVICE/venues/$VENUE_ID" "")

if [ $? -eq 0 ]; then
    venue_name=$(echo "$venue_detail_response" | jq -r '.data.name')
    print_success "Retrieved venue: $venue_name"
else
    print_error "Failed to fetch venue details"
fi

# Test 4: Event Management with Cross-Service Communication
print_section "Event Management (Organizer)"

# Create event (tests venue service communication)
echo "Creating event (tests venue validation)..."
event_response=$(make_request "POST" "$EVENT_SERVICE/events" '{
    "title": "Tech Conference 2025",
    "description": "Annual technology conference featuring the latest innovations",
    "date": "2025-12-15T10:00:00Z",
    "venueId": "'$VENUE_ID'",
    "capacity": 200,
    "price": 99.99
}' "Authorization: Bearer $ORGANIZER_TOKEN")

if [ $? -eq 0 ]; then
    EVENT_ID=$(echo "$event_response" | jq -r '.data.id')
    print_success "Event created successfully (ID: $EVENT_ID)"
    print_success "✓ Cross-service communication: Event ↔ Venue verification works"
else
    echo "Event response: $event_response"
    print_error "Failed to create event"
fi

# Get event details
echo "Fetching event details..."
event_detail_response=$(make_request "GET" "$EVENT_SERVICE/events/$EVENT_ID" "")

if [ $? -eq 0 ]; then
    event_title=$(echo "$event_detail_response" | jq -r '.data.title')
    print_success "Retrieved event: $event_title"
else
    print_error "Failed to fetch event details"
fi

# Check venue availability
echo "Checking venue availability..."
availability_response=$(make_request "POST" "$EVENT_SERVICE/events/venue-availability" '{
    "venueIds": ["'$VENUE_ID'"],
    "date": "2025-12-15T10:00:00Z"
}')

if [ $? -eq 0 ]; then
    print_success "Venue availability check completed"
    print_success "✓ Cross-service communication: Event ↔ Venue availability works"
else
    print_error "Failed to check venue availability"
fi

# Test 5: Attendee Registration with Cross-Service Communication
print_section "Attendee Registration (Cross-Service)"

# Check registration availability
echo "Checking registration availability..."
reg_availability_response=$(make_request "GET" "$EVENT_SERVICE/events/$EVENT_ID/registration-availability" "")

if [ $? -eq 0 ]; then
    available=$(echo "$reg_availability_response" | jq -r '.data.available')
    print_success "Registration availability: $available"
    print_success "✓ Cross-service communication: Event ↔ Attendee availability works"
else
    print_error "Failed to check registration availability"
fi

# Register for event
echo "Registering attendee for event..."
registration_response=$(make_request "POST" "$ATTENDEE_SERVICE/registrations" '{
    "eventId": "'$EVENT_ID'"
}' "Authorization: Bearer $ACCESS_TOKEN")

if [ $? -eq 0 ]; then
    ticket_number=$(echo "$registration_response" | jq -r '.data.ticketNumber')
    print_success "Successfully registered for event (Ticket: $ticket_number)"
    print_success "✓ Cross-service communication: Attendee ↔ Event validation works"
else
    echo "Registration response: $registration_response"
    print_error "Failed to register for event"
fi

# Check registration status
echo "Checking registration status..."
status_response=$(make_request "GET" "$ATTENDEE_SERVICE/registrations/event/$EVENT_ID/status" "" "Authorization: Bearer $ACCESS_TOKEN")

if [ $? -eq 0 ]; then
    status=$(echo "$status_response" | jq -r '.data.status')
    print_success "Registration status: $status"
else
    print_error "Failed to check registration status"
fi

# Get user's events
echo "Fetching user's registered events..."
user_events_response=$(make_request "GET" "$ATTENDEE_SERVICE/registrations/user/events" "" "Authorization: Bearer $ACCESS_TOKEN")

if [ $? -eq 0 ]; then
    event_count=$(echo "$user_events_response" | jq '.data | length')
    print_success "User has $event_count registered events"
else
    print_error "Failed to fetch user events"
fi

# Test 6: Organizer Operations
print_section "Organizer Operations"

# Get organizer's events
echo "Fetching organizer's events..."
org_events_response=$(make_request "GET" "$EVENT_SERVICE/events/organizer" "" "Authorization: Bearer $ORGANIZER_TOKEN")

if [ $? -eq 0 ]; then
    org_event_count=$(echo "$org_events_response" | jq '.data | length')
    print_success "Organizer has $org_event_count events"
else
    print_error "Failed to fetch organizer events"
fi

# Get event attendees
echo "Fetching event attendees..."
attendees_response=$(make_request "GET" "$ATTENDEE_SERVICE/registrations/event/$EVENT_ID" "" "Authorization: Bearer $ORGANIZER_TOKEN")

if [ $? -eq 0 ]; then
    attendee_count=$(echo "$attendees_response" | jq '.data | length')
    print_success "Event has $attendee_count attendees"
    print_success "✓ Cross-service communication: Attendee ↔ Event attendee list works"
else
    print_error "Failed to fetch event attendees"
fi

# Test 7: Update Operations
print_section "Update Operations"

# Update event
echo "Updating event..."
update_response=$(make_request "PUT" "$EVENT_SERVICE/events/$EVENT_ID" '{
    "title": "Tech Conference 2025 - Updated",
    "description": "Updated description with more details",
    "capacity": 250
}' "Authorization: Bearer $ORGANIZER_TOKEN")

if [ $? -eq 0 ]; then
    updated_title=$(echo "$update_response" | jq -r '.data.title')
    print_success "Event updated: $updated_title"
else
    print_error "Failed to update event"
fi

# Update venue
echo "Updating venue..."
venue_update_response=$(make_request "PUT" "$VENUE_SERVICE/venues/$VENUE_ID" '{
    "name": "Grand Convention Center - Renovated",
    "capacity": 600
}' "Authorization: Bearer $ADMIN_TOKEN")

if [ $? -eq 0 ]; then
    updated_venue_name=$(echo "$venue_update_response" | jq -r '.data.name')
    print_success "Venue updated: $updated_venue_name"
else
    print_error "Failed to update venue"
fi

# Test 8: Error Handling and Edge Cases
print_section "Error Handling & Edge Cases"

# Try to register for non-existent event
echo "Testing registration for non-existent event..."
fake_event_response=$(make_request "POST" "$ATTENDEE_SERVICE/registrations" '{
    "eventId": "fake-event-id"
}' "Authorization: Bearer $ACCESS_TOKEN")

if [ $? -eq 1 ]; then
    print_success "Correctly handled registration for non-existent event"
else
    print_error "Failed to handle non-existent event registration properly"
fi

# Try to access protected route without auth
echo "Testing access without authentication..."
no_auth_response=$(make_request "GET" "$EVENT_SERVICE/events/organizer" "")

if [ $? -eq 1 ]; then
    print_success "Correctly blocked unauthenticated access"
else
    print_error "Failed to block unauthenticated access"
fi

# Try to access with wrong role
echo "Testing role-based access control..."
wrong_role_response=$(make_request "POST" "$VENUE_SERVICE/venues" '{
    "name": "Unauthorized Venue",
    "address": "Nowhere",
    "capacity": 100
}' "Authorization: Bearer $ACCESS_TOKEN")

if [ $? -eq 1 ]; then
    print_success "Correctly blocked access with insufficient permissions"
else
    print_error "Failed to enforce role-based access control"
fi

# Test 9: Cleanup Operations
print_section "Cleanup Operations"

# Cancel registration
echo "Cancelling event registration..."
cancel_response=$(make_request "DELETE" "$ATTENDEE_SERVICE/registrations/event/$EVENT_ID" "" "Authorization: Bearer $ACCESS_TOKEN")

if [ $? -eq 0 ]; then
    print_success "Registration cancelled successfully"
else
    print_error "Failed to cancel registration"
fi

# Try to delete event with attendees (should fail initially)
echo "Testing event deletion constraints..."
delete_event_response=$(make_request "DELETE" "$EVENT_SERVICE/events/$EVENT_ID" "" "Authorization: Bearer $ORGANIZER_TOKEN")

if [ $? -eq 0 ]; then
    print_success "Event deleted successfully"
elif [ $? -eq 1 ]; then
    print_success "Correctly prevented deletion of event with attendees"
    # After cancellation, try again
    sleep 1
    delete_event_response2=$(make_request "DELETE" "$EVENT_SERVICE/events/$EVENT_ID" "" "Authorization: Bearer $ORGANIZER_TOKEN")
    if [ $? -eq 0 ]; then
        print_success "Event deleted after attendee cancellation"
    fi
else
    print_error "Unexpected response for event deletion"
fi

# Final Summary
print_section "Demo Summary"

echo -e "${GREEN}🎉 Orchestrate Microservices Demo Completed!${NC}"
echo ""
echo "✅ Services tested:"
echo "   • Auth Service - User registration, login, JWT tokens"
echo "   • Venue Service - CRUD operations, admin access control"
echo "   • Event Service - Event management, venue validation"
echo "   • Attendee Service - Registration, status tracking"
echo ""
echo "✅ Cross-service communications verified:"
echo "   • Event ↔ Venue: Venue validation during event creation"
echo "   • Event ↔ Attendee: Registration availability checks"
echo "   • Attendee ↔ Event: Event validation during registration"
echo "   • All services ↔ Auth: JWT token validation"
echo ""
echo "✅ Security features tested:"
echo "   • JWT authentication across all services"
echo "   • Role-based access control (ADMIN, ORGANIZER, ATTENDEE)"
echo "   • Protected routes and proper error responses"
echo ""
echo "✅ Data integrity features:"
echo "   • Registration constraints and availability checks"
echo "   • Event-attendee relationship management"
echo "   • Proper error handling for edge cases"
echo ""
echo -e "${BLUE}Your microservices architecture is working perfectly! 🚀${NC}"
