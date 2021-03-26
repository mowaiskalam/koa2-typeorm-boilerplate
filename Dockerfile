FROM node:10.15.1-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build
RUN npm run build:post

EXPOSE 4001
EXPOSE 5858

ENTRYPOINT ["./entrypoint.sh"]
CMD ["npm", "run", "start"]
