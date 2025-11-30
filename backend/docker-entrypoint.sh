#!/bin/sh
set -e

# Wait for database to be ready
echo "Waiting for database connection..."
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if php artisan db:show 2>/dev/null; then
        echo "Database is up!"
        break
    fi
    attempt=$((attempt + 1))
    echo "Database is unavailable - sleeping (attempt $attempt/$max_attempts)"
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo "Failed to connect to database after $max_attempts attempts"
    exit 1
fi

# Cache configuration for production performance
echo "Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
echo "Running migrations..."
php artisan migrate --force

# Seed database if needed (only on first run)
echo "Checking if seeding is needed..."
php artisan db:seed --force 2>/dev/null || true

# Create storage link
php artisan storage:link 2>/dev/null || true

echo "Laravel application ready!"

# Execute the main command (supervisord)
exec "$@"
