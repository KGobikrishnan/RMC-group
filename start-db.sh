#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
DATA_DIR="$DIR/backend/.pgdata"
SOCK_DIR="$DIR/backend/.pgsockets"

mkdir -p "$SOCK_DIR"
if [ ! -d "$DATA_DIR/base" ]; then
  echo "Initializing PostgreSQL cluster..."
  /usr/bin/initdb -D "$DATA_DIR" -U postgres --auth=trust
fi

echo "Starting PostgreSQL on port 5433..."
/usr/bin/pg_ctl -D "$DATA_DIR" -o "-p 5433 -k \"$SOCK_DIR\"" -l "$DIR/backend/postgres.log" start
