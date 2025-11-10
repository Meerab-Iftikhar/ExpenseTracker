# Step 1: Build the React/Vite app
FROM node:20 AS build

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build the production version
RUN npm run build

# Step 2: Serve the build using a lightweight server
FROM node:20-slim

WORKDIR /usr/src/app

# Install serve globally
RUN npm install -g serve

# Copy built files from previous stage
COPY --from=build /usr/src/app/dist ./dist

# Expose port
EXPOSE 8081

# Command to run the app
CMD ["serve", "-s", "dist", "-l", "8081"]
