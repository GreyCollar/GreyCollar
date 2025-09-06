FROM prom/prometheus:latest

COPY prometheus.yml /etc/prometheus/prometheus.yml

EXPOSE 9090

ENTRYPOINT [ "/bin/prometheus" ]
CMD [ "--config.file=/etc/prometheus/prometheus.yml", \
      "--storage.tsdb.path=/prometheus", \
      "--web.console.libraries=/etc/prometheus/console_libraries", \
      "--web.console.templates=/etc/prometheus/consoles", \
      "--storage.tsdb.retention.time=200h", \
      "--web.enable-lifecycle", \
      "--web.enable-remote-write-receiver", \
      "--enable-feature=native-histograms", \
      "--enable-feature=remote-write-receiver" ] 