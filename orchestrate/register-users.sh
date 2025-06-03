#!/bin/bash

# User Registration Script
# This script registers all user types needed for testing

echo "👥 Registering users for testing..."

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

AUTH_SERVICE="http://localhost:3001"

# Function to register user
register_user() {
    local email=$1
    local password=$2
    local name=$3
    local roles=$4
    local user_type=$5
    
    echo -e "${YELLOW}Registering $user_type...${NC}"
    
    response=$(curl -s -X POST "$AUTH_SERVICE/register" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$email\",
            \"password\": \"$password\",
            \"name\": \"$name\",
            \"roles\": $roles
        }")
    
    if echo "$response" | grep -q '"accessToken"'; then
        echo -e "${GREEN}✅ $user_type registered successfully${NC}"
        user_id=$(echo "$response" | jq -r '.data.user.id')
        echo -e "${GREEN}User ID: $user_id${NC}"
        echo ""
    elif echo "$response" | grep -q '"statusCode":409'; then
        echo -e "${YELLOW}⚠️  $user_type already exists${NC}"
        echo ""
    else
        echo -e "${RED}❌ Failed to register $user_type${NC}"
        echo "Response: $response"
        echo ""
    fi
}

# Register all users
register_user "admin@orchestrate.com" "admin123" "Admin User" '["ADMIN"]' "Admin"
register_user "organizer@orchestrate.com" "organizer123" "Event Organizer" '["ORGANIZER"]' "Organizer"
register_user "attendee@orchestrate.com" "attendee123" "Event Attendee" '["ATTENDEE"]' "Attendee"

echo -e "${GREEN}🎉 User registration completed!${NC}"
echo -e "${YELLOW}💡 Now run ./get-tokens.sh to get authentication tokens${NC}"
