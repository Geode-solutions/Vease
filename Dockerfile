ARG BRANCH=next

FROM ghcr.io/geode-solutions/opengeodeweb-router:$BRANCH AS router

FROM ghcr.io/geode-solutions/vease-back:$BRANCH AS back

FROM ghcr.io/geode-solutions/vease-viewer:$BRANCH AS viewer

FROM debian:12-slim

RUN apt-get update

# Setup router
RUN apt-get install -y curl jq bash supervisor nginx
COPY --from=router /etc/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=router /etc/supervisord.conf /etc/supervisord.conf
RUN mkdir -p /var/log/supervisor
RUN mkdir -p /etc/supervisor/conf.d
COPY --from=router /etc/supervisor/conf.d /etc/supervisor/conf.d
COPY --from=router /usr/local/bin/cleanup.bash /usr/local/bin/cleanup.bash
RUN chmod +x /usr/local/bin/cleanup.bash

# Setup back
RUN apt-get install -y libgomp1
COPY --from=back /usr/local/bin/vease-back /usr/local/bin/vease-back
RUN chmod +x /usr/local/bin/vease-back

# Setup viewer
RUN apt-get install -y libosmesa6-dev libx11-dev libxrender-dev
COPY --from=viewer /usr/local/bin/vease-viewer /usr/local/bin/vease-viewer
RUN chmod +x /usr/local/bin/vease-viewer
RUN mkdir www && touch www/healthcheck

ENV PYTHON_ENV=prod
ENV DISPLAY=:0

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]