FROM node:20

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY . .

# React / Vite app ke liye
CMD ["npm", "run", "dev"]   # ya "start" agar package.json me defined hai
