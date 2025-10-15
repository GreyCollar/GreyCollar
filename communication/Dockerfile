FROM node:16

RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    libaio1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Download and install Oracle Instant Client
RUN mkdir -p /app/oracle && \
    wget https://download.oracle.com/otn_software/linux/instantclient/2326000/instantclient-basic-linux.x64-23.26.0.0.0.zip -O /tmp/instantclient.zip && \
    unzip /tmp/instantclient.zip -d /app/oracle && \
    mv /app/oracle/instantclient_23_26 /app/oracle/instantclient && \
    rm /tmp/instantclient.zip

# Download and extract Oracle Wallet
RUN wget https://cdn.nucleoid.com/tmp/Wallet_GAS3P3TSBA5E6JCH.zip -O /tmp/wallet.zip && \
    unzip /tmp/wallet.zip -d /app/oracle && \
    mv /app/oracle/Wallet_GAS3P3TSBA5E6JCH /app/oracle/wallet && \
    rm /tmp/wallet.zip

ENV LD_LIBRARY_PATH=/app/oracle/instantclient:$LD_LIBRARY_PATH

COPY . /app

EXPOSE 3000

ENTRYPOINT npm run dev
