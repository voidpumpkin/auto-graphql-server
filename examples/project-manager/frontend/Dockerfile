FROM node:15-alpine

WORKDIR /app

VOLUME /app/public

COPY package*.json ./

RUN yarn
# TODO: remove
ADD "https://www.random.org/cgi-bin/randbyte?nbytes=10&format=h" skipcache

COPY . .

CMD ["yarn","build"]