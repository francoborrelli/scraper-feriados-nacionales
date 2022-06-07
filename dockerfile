FROM node:17.8-alpine

RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont 

ENV TZ=America/Argentina/Buenos_Aires

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY package.json yarn.lock startScrapper.js ./

RUN yarn install

EXPOSE 3000

