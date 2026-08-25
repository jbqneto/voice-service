#!/usr/bin/env bash
set -euo pipefail
VOICE="${PIPER_VOICE:-pt_BR-cadu-medium}"
if [ ! -f "/data/${VOICE}.onnx" ] || [ ! -f "/data/${VOICE}.onnx.json" ]; then
  echo "Downloading Piper voice: ${VOICE}"
  python3 -m piper.download_voices --data-dir /data "${VOICE}"
fi
echo "Starting Piper with voice: ${VOICE}"
exec python3 -m piper.http_server --host 0.0.0.0 --port 5000 --data-dir /data --model "${VOICE}"
