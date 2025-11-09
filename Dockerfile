FROM node:20

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY . .

# React / Vite app ke liye
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
