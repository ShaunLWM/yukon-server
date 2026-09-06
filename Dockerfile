FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 6111 6112

CMD ["npx", "babel-watch", "./src/World.js", "Login", "Blizzard"]
