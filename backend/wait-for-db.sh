#!/bin/bash
echo "Aguardando MySQL..."
while ! nc -z db 3306; do
  sleep 3
done
echo "MySQL está pronto!"
exec "$@"
