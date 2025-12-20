
# Step 1: Build the React/Vite app
FROM node:20 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve the build using a lightweight server
FROM node:20-slim
WORKDIR /usr/src/app
RUN npm install -g serve
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000

# Serve the production build on 0.0.0.0
CMD ["serve", "-s", "dist", "-l", "3000"]
