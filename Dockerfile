FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY Z_Attack/Api ./Api

EXPOSE 8081

CMD ["node", "Api/App.js"]