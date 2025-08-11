FROM node:22

RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    procps \
    chromium \
    chromium-sandbox \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY package.json .
COPY server.js .
COPY ./dashboard/dist ./dist
COPY ./dashboard/config.js ./config.mjs
COPY ./api ./api
COPY ./mcp ./mcp

RUN cd api && npm rebuild sqlite3
RUN npm install -g concurrently
RUN npm install express

EXPOSE 3000

ENTRYPOINT npm run serve