FROM ubuntu:jammy-20251013

COPY . .


RUN ls
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git \
    curl \
    ca-certificates \
    python3-pip \
    python3-setuptools \
    && rm -rf /var/lib/apt/lists


RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash && \
    \. "$HOME/.nvm/nvm.sh" && \
    nvm install 22 && \
    node -v && \
    npm -v
    

RUN node --version
RUN npm --version

RUN npm install && \
    npm run install:microservices && \
    npm run build:microservices && \
    npm run build:desktop








