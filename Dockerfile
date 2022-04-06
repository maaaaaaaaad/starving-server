FROM node:16.14.2-alpine

WORKDIR /app/starving/server

COPY package*.json ./

RUN npm ci

COPY ./ ./

RUN npm run build

CMD ["npm", "run", "start:prod"]