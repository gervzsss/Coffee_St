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

echo "Running migrations..."
php artisan migrate --force

# Check for essential data (Products or Admin)
echo "Checking for Admin User..."
# Check if the products table is empty
ADMIN_EXISTS=$(php artisan tinker --execute="echo \App\Models\User::where('is_admin', true)->count();")

if [ "$ADMIN_EXISTS" = "0" ]; then
    echo "No Admin found. Seeding essential data (Admin, Products, Variants)..."
    php artisan db:seed --force
else
    echo "Admin user exists. Skipping essential seed."
fi

php artisan storage:link 2>/dev/null || true

echo "Laravel application ready!"

# 4. START SUPERVISOR
# This ensures we pass the command from the Dockerfile (supervisord) correctly
exec "$@"