# Publishing orchestrate-shared as NPM Package

## Step 1: Prepare for publishing
cd shared
npm login  # Login to npm registry

## Step 2: Publish the package
npm publish --access public

## Step 3: Install in each service
cd ../services/auth-service
npm install orchestrate-shared@latest

# Repeat for all services
cd ../event-service && npm install orchestrate-shared@latest
cd ../venue-service && npm install orchestrate-shared@latest
cd ../attendee-service && npm install orchestrate-shared@latest

## Step 4: Remove path mappings from tsconfig.json files
# The package will be resolved from node_modules like any other package
