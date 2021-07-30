FROM node:16

WORKDIR /app

EXPOSE 3001

COPY . .

RUN npm install

CMD ["npm", "run", "dev"]