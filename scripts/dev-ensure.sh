#!/usr/bin/env bash
set -euo pipefail
PORT=55803
URL="http://localhost:${PORT}/api/dev/health"
LOG_DIR="$(cd "$(dirname "$0")/.." && pwd)"
LOG="${LOG_DIR}/dev-${PORT}.log"
PIDFILE="/workspace/dev-${PORT}.pid"

check() {
  curl -fsS --max-time 2 "$URL" >/dev/null 2>&1
}

rotate_logs() {
  if [ -f "$LOG" ]; then
    if size=$(stat -c%s "$LOG" 2>/dev/null); then :; else size=$(stat -f%z "$LOG" 2>/dev/null); fi
    if [ "${size:-0}" -gt 1048576 ]; then
      ts=$(date +%Y%m%d-%H%M%S)
      mv "$LOG" "${LOG}.${ts}" || true
      ls -1t "${LOG}".* 2>/dev/null | tail -n +6 | xargs -r rm -f || true
    fi
  fi
}

if check; then
  echo "Dev server is responding on ${PORT}. Nothing to do."
  exit 0
fi

echo "Starting dev server on ${PORT}..."
cd "$LOG_DIR"
rotate_logs
nohup npm run dev > "$LOG" 2>&1 &
PID=$!
echo $PID > "$PIDFILE"
echo "Started (pid $PID). Logs: $LOG"
