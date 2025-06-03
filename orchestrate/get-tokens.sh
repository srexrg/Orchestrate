#!/bin/bash

# Quick Token Setup Script for Manual Testing
# This script gets authentication tokens for all user types

echo "🔑 Getting authentication tokens for manual testing..."

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

AUTH_SERVICE="http://localhost:3001"

# Function to get token
get_token() {
    local email=$1
    local password=$2
    local user_type=$3
    
    echo -e "${YELLOW}Getting token for $user_type...${NC}"
    
    response=$(curl -s -X POST "$AUTH_SERVICE/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\": \"$email\", \"password\": \"$password\"}")
    
    if echo "$response" | grep -q '"accessToken"'; then
        token=$(echo "$response" | jq -r '.data.accessToken')
        user_id=$(echo "$response" | jq -r '.data.user.id')
        echo -e "${GREEN}✅ $user_type token obtained${NC}"
        echo -e "${GREEN}Token: $token${NC}"
        echo -e "${GREEN}User ID: $user_id${NC}"
        echo ""
        
        # Export as environment variable
        case "$user_type" in
            "Admin")
                export ADMIN_TOKEN="$token"
                export ADMIN_USER_ID="$user_id"
                ;;
            "Organizer")
                export ORGANIZER_TOKEN="$token"
                export ORGANIZER_USER_ID="$user_id"
                ;;
            "Attendee")
                export ATTENDEE_TOKEN="$token"
                export ATTENDEE_USER_ID="$user_id"
                ;;
        esac
    else
        echo -e "${RED}❌ Failed to get $user_type token${NC}"
        echo "Response: $response"
        echo ""
    fi
}

# Get all tokens
get_token "admin@orchestrate.com" "admin123" "Admin"
get_token "organizer@orchestrate.com" "organizer123" "Organizer" 
get_token "attendee@orchestrate.com" "attendee123" "Attendee"

echo -e "${YELLOW}📋 Environment Variables Set:${NC}"
echo "ADMIN_TOKEN=$ADMIN_TOKEN"
echo "ORGANIZER_TOKEN=$ORGANIZER_TOKEN"
echo "ATTENDEE_TOKEN=$ATTENDEE_TOKEN"
echo ""

echo -e "${YELLOW}📋 Export Commands (copy these to set in your shell):${NC}"
echo "export ADMIN_TOKEN=\"$ADMIN_TOKEN\""
echo "export ORGANIZER_TOKEN=\"$ORGANIZER_TOKEN\""
echo "export ATTENDEE_TOKEN=\"$ATTENDEE_TOKEN\""
echo "export ADMIN_USER_ID=\"$ADMIN_USER_ID\""
echo "export ORGANIZER_USER_ID=\"$ORGANIZER_USER_ID\""
echo "export ATTENDEE_USER_ID=\"$ATTENDEE_USER_ID\""
echo ""

echo -e "${GREEN}🚀 Ready for manual testing! Use the tokens above in your curl commands.${NC}"
echo -e "${YELLOW}💡 See CURL_TEST_COMMANDS.md for complete testing guide.${NC}"


export ADMIN_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiNDU1YzMyYi02MWFiLTQ2YTktODRkOC01MTVkZWFlNjFmNmMiLCJyb2xlcyI6WyJBRE1JTiJdLCJpYXQiOjE3NDg5NjY1NDYsImV4cCI6MTc0OTA1Mjk0Nn0.KvGHseDN_9bBMWScyfzzwlMH2FJVWX17ODlEY5_3fnU"
export ORGANIZER_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhNTJlZTJkZi0yNzhkLTRjYTktYjYzNi0yNGYyY2VjYzRhY2IiLCJyb2xlcyI6WyJPUkdBTklaRVIiXSwiaWF0IjoxNzQ4OTY2NTQ2LCJleHAiOjE3NDkwNTI5NDZ9.0l7_LNCyZY8yty5o5pYNBZZ8d9fmK5WoZJL80VSVOoA"
export ATTENDEE_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyNjM5YjczMy04ZDBkLTQ0MGQtYmI4Ni0xYmFjZTg1ZTdmMzIiLCJyb2xlcyI6WyJBVFRFTkRFRSJdLCJpYXQiOjE3NDg5NjY1NDYsImV4cCI6MTc0OTA1Mjk0Nn0.3Vpe8kQuF_5YVtT2NLye0DdSj5DpoD7rsQBnoy9PhiU"
export ADMIN_USER_ID="b455c32b-61ab-46a9-84d8-515deae61f6c"
export ORGANIZER_USER_ID="a52ee2df-278d-4ca9-b636-24f2cecc4acb"
export ATTENDEE_USER_ID="2639b733-8d0d-440d-bb86-1bace85e7f32"