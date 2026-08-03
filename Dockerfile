ARG BRANCH=next

FROM ghcr.io/geode-solutions/opengeodeweb-router:$BRANCH AS router

FROM ghcr.io/geode-solutions/vease-back:$BRANCH AS back

FROM ghcr.io/geode-solutions/vease-viewer:$BRANCH AS viewer

FROM node:24 AS builder

RUN node -v
RUN npm -v
COPY . .
RUN if [ "$BRANCH" = "master" ]; then \
    sed -i 's/"0\.0\.0"/"latest"/g' package.json; \
    else \
    sed -i 's/"0\.0\.0"/"next"/g' package.json; \
    fi
RUN cat package.json
RUN npm install && npm list --depth=0
ENV NODE_OPTIONS="--max-old-space-size=10240"
RUN npm run build:cloud_server

FROM node:24-slim

RUN apt-get update

# Setup vease microservice
RUN mkdir -p /etc/vease/server
COPY --from=builder .output/server /etc/vease/server
COPY <<'EOT' /etc/supervisor/conf.d/vease-server.conf
[program:vease-server]
command=node /etc/vease/server/index.mjs
environment=PORT="3000"
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
EOT

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
COPY <<'EOT' /etc/supervisor/conf.d/vease-back.conf
[program:vease-back]
command=/usr/local/bin/vease-back --project_folder_path /project --timeout 2
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
EOT

# Setup viewer
RUN apt-get install -y libosmesa6-dev libx11-dev libxrender-dev
COPY --from=viewer /usr/local/bin/vease-viewer /usr/local/bin/vease-viewer
RUN chmod +x /usr/local/bin/vease-viewer
RUN mkdir www && touch www/healthcheck
COPY <<'EOT' /etc/supervisor/conf.d/vease-viewer.conf
[program:vease-viewer]
command=/usr/local/bin/vease-viewer --project_folder_path /project --content ./www --host 0.0.0.0
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
EOT

ENV DISPLAY=:0

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]