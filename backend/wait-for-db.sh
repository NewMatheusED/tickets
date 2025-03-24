#!/bin/bash
# wait-for-db.sh

set -e

host="$1"
shift
cmd="$@"

until mysqladmin ping -h "$host" --silent; do
  >&2 echo "Aguardando o banco de dados estar disponível..."
  sleep 1
done

>&2 echo "Banco de dados pronto. Iniciando o backend."
exec $cmd
