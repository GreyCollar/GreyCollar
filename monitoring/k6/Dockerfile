FROM grafana/k6:latest

COPY scripts /scripts

WORKDIR /scripts

ENV BASE_URL=http://172.27.112.1:3001

EXPOSE 6565

ENTRYPOINT ["k6"]
CMD ["run", "load-test-ws.js"]
