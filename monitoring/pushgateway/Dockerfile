FROM prom/pushgateway:latest
# Expose the Pushgateway port
EXPOSE 9091
# Set working directory
WORKDIR /
# Run Pushgateway with configuration options
ENTRYPOINT ["/bin/pushgateway"]
CMD ["--web.listen-address=:9091", \
     "--web.telemetry-path=/metrics", \
     "--persistence.file=/tmp/pushgateway.data", \
     "--persistence.interval=5m", \
     "--log.level=info", \
     "--web.enable-lifecycle"]