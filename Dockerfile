FROM node:15-alpine

WORKDIR /app

VOLUME /app/data

COPY package*.json ./

RUN yarn --prod

COPY . .

ENV PORT=3001

EXPOSE 3001

CMD ["yarn","start"]