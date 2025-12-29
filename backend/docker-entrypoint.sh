#!/bin/sh
set -e

# 1. INJECT THE RAILWAY PORT (The Fix for 502)
# This replaces the string ${PORT} in your nginx config with the actual number provided by Railway
if [ -z "$PORT" ]; then
  export PORT=80
fi
sed -i "s/\${PORT}/$PORT/g" /etc/nginx/http.d/default.conf

echo "Configuring Nginx to listen on port $PORT"

# 2. WAIT FOR DATABASE
echo "Waiting for database connection..."
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if php artisan db:show 2>/dev/null; then
        echo "Database is up!"
        break
    fi
    attempt=$((attempt + 1))
    echo "Database unavailable - attempt $attempt/$max_attempts"
    sleep 2
done

# 3. PRODUCTION OPTIMIZATIONS
echo "Optimizing Laravel..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
php artisan storage:link 2>/dev/null || true

echo "Laravel application ready!"

# 4. START SUPERVISOR
# This ensures we pass the command from the Dockerfile (supervisord) correctly
exec "$@"