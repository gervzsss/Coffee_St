#!/bin/bash
set -e

# Wait for database to be ready
echo "Waiting for database connection..."
until php artisan db:show 2>/dev/null; do
    echo "Database is unavailable - sleeping"
    sleep 2
done

echo "Database is up - executing migrations"

# Run migrations
php artisan migrate --force

# Check if we should seed (only if tables are empty)
echo "Checking if seeding is needed..."
php artisan db:seed --force

echo "Starting Laravel development server..."
exec php artisan serve --host=0.0.0.0 --port=8000
