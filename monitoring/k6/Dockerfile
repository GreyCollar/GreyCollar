FROM grafana/k6:latest

COPY scripts /scripts

WORKDIR /scripts

ENV TARGET_URL=https://land.greycollar.ai/api
ENV K6_PROMETHEUS_RW_SERVER_URL=http://52.191.251.120:9090
ENV K6_PROMETHEUS_RW_TREND_AS_NATIVE_HISTOGRAM=true

EXPOSE 6565

#ENTRYPOINT ["k6"]
#CMD ["run", "--out", "experimental-prometheus-rw", "load-test-ws.js"]
