FROM grafana/k6:latest

COPY scripts /scripts

WORKDIR /scripts

ENV TARGET_URL=https://land.greycollar.ai/api
ENV K6_PROMETHEUS_RW_SERVER_URL=http://host.docker.internal:9090/api/v1/write
ENV K6_PROMETHEUS_RW_TREND_AS_NATIVE_HISTOGRAM=true

EXPOSE 6565

ENTRYPOINT ["k6"]
CMD ["run", "--out", "experimental-prometheus-rw", "load-test.js"]