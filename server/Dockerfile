FROM node:22.22.2-bookworm-slim
RUN sed -i 's/deb.debian.org/mirrors.cloud.tencent.com/g' /etc/apt/sources.list.d/debian.sources && apt-get -o Acquire::Retries=2 -o Acquire::http::Timeout=30 update && apt-get -o Acquire::Retries=2 -o Acquire::http::Timeout=30 install -y --no-install-recommends chromium ca-certificates fonts-noto-cjk && rm -rf /var/lib/apt/lists/*
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY server/*.mjs ./
COPY dist /app/site
USER node
EXPOSE 8080
CMD ["node","start.mjs"]
