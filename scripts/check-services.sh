#!/bin/bash

# Quick service verification script
echo "🔍 Checking Orchestrate Services..."

services=(
    "http://localhost:3001/health,Auth Service"
    "http://localhost:3002/health,Event Service" 
    "http://localhost:3003/health,Venue Service"
    "http://localhost:3004/health,Attendee Service"
    "http://localhost:3005/health,Notification Service"
    "http://localhost:3000/health,API Gateway"
)

all_healthy=true

for service in "${services[@]}"; do
    IFS=',' read -r url name <<< "$service"
    
    if curl -s "$url" | grep -q "ok"; then
        echo "✅ $name is healthy"
    else
        echo "❌ $name is not responding"
        all_healthy=false
    fi
done

if [ "$all_healthy" = true ]; then
    echo ""
    echo "🎉 All services are healthy! Ready to run demo."
    echo ""
    echo "To run the automated demo:"
    echo "  ./demo-test.sh"
    echo ""
    echo "To run manual tests:"
    echo "  See MANUAL_TEST_GUIDE.md"
else
    echo ""
    echo "⚠️  Some services are not healthy. Please check:"
    echo "  1. Run 'docker-compose up' to start all services"
    echo "  2. Wait for all services to initialize"
    echo "  3. Check docker logs for any errors"
fi
