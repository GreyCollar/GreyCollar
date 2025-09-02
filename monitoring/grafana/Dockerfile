FROM grafana/grafana:latest

COPY provisioning /etc/grafana/provisioning/

ENV GF_SECURITY_ADMIN_PASSWORD=admin
ENV GF_USERS_ALLOW_SIGN_UP=false
ENV GF_INSTALL_PLUGINS=grafana-clock-panel,grafana-simple-json-datasource

EXPOSE 3000

ENTRYPOINT [ "/run.sh" ]