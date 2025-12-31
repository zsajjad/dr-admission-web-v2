#!/bin/sh
# wait-for-port.sh HOST PORT TIMEOUT
# Example: ./wait-for-port.sh mariadb-e2e 3306 60

HOST="$1"
PORT="$2"
TIMEOUT="${3:-60}"

echo "Waiting for $HOST:$PORT for up to $TIMEOUT seconds..."

for i in $(seq 1 $TIMEOUT); do
  nc -z "$HOST" "$PORT" >/dev/null 2>&1 && echo "Host $HOST:$PORT is up!" && exit 0
  sleep 1
done

echo "Timeout waiting for $HOST:$PORT"
exit 1
