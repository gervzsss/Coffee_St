# Stage 1: Composer dependencies
FROM composer:2 AS composer
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --optimize-autoloader --no-dev --no-scripts --ignore-platform-reqs

# Stage 2: Production image
FROM php:8.2-fpm-alpine

# Install system dependencies
RUN apk add --no-cache git curl libpng-dev oniguruma-dev libxml2-dev zip unzip libzip-dev icu-dev nginx supervisor

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip intl opcache

# Configure OPcache & PHP for production (Keep these inline as they are small)
RUN { \
    echo 'opcache.memory_consumption=128'; \
    echo 'opcache.interned_strings_buffer=8'; \
    echo 'opcache.max_accelerated_files=4000'; \
    echo 'opcache.revalidate_freq=0'; \
    echo 'opcache.validate_timestamps=0'; \
    } > /usr/local/etc/php/conf.d/opcache.ini

RUN { \
    echo 'memory_limit=256M'; \
    echo 'upload_max_filesize=100M'; \
    echo 'post_max_size=100M'; \
    echo 'expose_php=Off'; \
    } > /usr/local/etc/php/conf.d/production.ini

# --- THE RECOMMENDED PART: COPY EXTERNAL CONFIGS ---
COPY default.conf /etc/nginx/http.d/default.conf
COPY supervisord.conf /etc/supervisord.conf

WORKDIR /var/www/html
COPY --from=composer /app/vendor ./vendor
COPY . .

# Entrypoint setup
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Permissions
RUN chown -R www-data:www-data /var/www/html && chmod -R 755 /var/www/html/storage

# Force PHP-FPM to listen on 9000
RUN sed -i 's/listen = 127.0.0.1:9000/listen = 9000/g' /usr/local/etc/php-fpm.d/www.conf || true

# --- ADD THIS LINE TO FIX THE RED LOGS ---
RUN sed -i 's|;error_log = log/php-fpm.log|error_log = /dev/stdout|g' /usr/local/etc/php-fpm.conf || true

EXPOSE 80
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["supervisord", "-c", "/etc/supervisord.conf"]