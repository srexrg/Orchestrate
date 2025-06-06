FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

RUN rm -f package-lock.json && npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3005

# Start the service
CMD ["npm", "start"]
