FROM node:18-alpine



WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Clear npm cache and install dependencies with clean slate
RUN npm cache clean --force && \
    rm -rf node_modules package-lock.json && \
    npm install 

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 3003

# Start the application
CMD ["npm", "run", "dev"]