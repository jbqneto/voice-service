FROM python:3.12 AS builder
ARG PIPER_VERSION=1.6.0
RUN apt-get update && apt-get install --yes --no-install-recommends build-essential cmake ninja-build git ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
RUN git clone --depth 1 --branch v${PIPER_VERSION} https://github.com/OHF-Voice/piper1-gpl.git .
RUN python3 -m venv /app/.venv && /app/.venv/bin/pip install --upgrade pip setuptools wheel && /app/.venv/bin/pip install .[http]

FROM python:3.12-slim
ENV PATH="/opt/venv/bin:${PATH}"
WORKDIR /app
COPY --from=builder /app/.venv /opt/venv
COPY docker/piper-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh && mkdir -p /data
VOLUME ["/data"]
EXPOSE 5000
ENTRYPOINT ["/entrypoint.sh"]
