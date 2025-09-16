FROM grafana/k6:latest

COPY scripts /scripts

WORKDIR /scripts

ENV BASE_URL=https://communication-land.gentleflower-99ef02e0.eastus.azurecontainerapps.io

EXPOSE 6565

ENTRYPOINT ["k6"]
CMD ["run", "load-test-ws.js"]
