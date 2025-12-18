FROM ubuntu:jammy-20251013

COPY . .

ENV TZ=Europe/Paris

RUN DEBIAN_FRONTEND=noninteractive apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        gnupg \
        software-properties-common \
        build-essential \
        zlib1g-dev \
        libncurses5-dev \
        libgdbm-dev \
        libnss3-dev \
        libssl-dev \
        libreadline-dev \
        libffi-dev \
        libsqlite3-dev \
        libbz2-dev \
        liblzma-dev \
        tk-dev \
        uuid-dev \
        libxml2-dev \
        libxmlsec1-dev && \
    rm -rf /var/lib/apt/lists/*



# Install Node.js 22 and npm from NodeSource repository
RUN mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_22.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && \
    apt-get update && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Install Python 3.12 from Deadsnakes PPA (includes pip)
RUN add-apt-repository ppa:deadsnakes/ppa -y && \
    apt-get update && \
    apt-get install -y python3.12 python3.12-venv python3.12-dev && \
    rm -rf /var/lib/apt/lists/*

RUN npm install
RUN npm list
RUN npm run install:microservices
RUN npm run build:microservices
RUN ls
RUN npm run build:desktop








