#!/bin/bash

# Setup script to ensure all databases are properly migrated
echo "🔧 Setting up Orchestrate Microservices Databases..."

services=("auth-service" "event-service" "venue-service" "attendee-service")

for service in "${services[@]}"; do
    echo "📊 Running Prisma migrations for $service..."
    
    # Try migrate deploy first (for existing migrations)
    docker exec "orchestrate-$service-1" npx prisma migrate deploy 2>/dev/null
    
    # If no migrations exist, create initial migration
    if [ $? -ne 0 ]; then
        echo "Creating initial migration for $service..."
        docker exec "orchestrate-$service-1" npx prisma migrate dev --name init
    fi
    
    echo "✅ $service database setup complete"
done

echo ""
echo "🎉 All databases are now properly set up!"
echo ""
echo "You can now run:"
echo "  ./check-services.sh  # Verify all services are healthy"
echo "  ./demo-test.sh       # Run comprehensive demo"
