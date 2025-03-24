until mysql -h "$DB_HOST" -u "$DB_USERNAME" -p"$DB_PASSWORD" "$DB_NAME" -e 'select 1'; do
  echo "Waiting for database to be ready..."
  sleep 2
done
echo "Database is ready!"
exec "$@"
