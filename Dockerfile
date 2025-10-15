FROM node:20

RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    gnupg \
    ca-certificates \
    procps \
    chromium \
    chromium-sandbox \
    libaio1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

WORKDIR /app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

    RUN mkdir -p /app/oracle && \
    wget https://download.oracle.com/otn_software/linux/instantclient/2326000/instantclient-basic-linux.x64-23.26.0.0.0.zip -O /tmp/instantclient.zip && \
    unzip /tmp/instantclient.zip -d /app/oracle && \
    mv /app/oracle/instantclient_23_26 /app/oracle/instantclient && \
    rm /tmp/instantclient.zip

    RUN mkdir -p /app/oracle/wallet && \
    wget https://cdn.nucleoid.com/tmp/Wallet_GAS3P3TSBA5E6JCH_v2.zip -O /tmp/wallet.zip && \
    unzip -j /tmp/wallet.zip -d /app/oracle/wallet && \
    rm /tmp/wallet.zip

ENV LD_LIBRARY_PATH=/app/oracle/instantclient

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

ENTRYPOINT ["npm", "run", "serve"]