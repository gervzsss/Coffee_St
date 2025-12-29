# Production Dockerfile for Laravel Backend
# Multi-stage build for smaller image size

# Stage 1: Composer dependencies
FROM composer:2 AS composer
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --optimize-autoloader --no-dev --no-scripts --ignore-platform-reqs

# Stage 2: Production image
FROM php:8.2-fpm-alpine

# Install system dependencies including nginx and supervisor
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    icu-dev \
    nginx \
    supervisor

# Install PHP extensions
RUN docker-php-ext-install \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip \
    intl \
    opcache

# Configure OPcache for production
RUN { \
    echo 'opcache.memory_consumption=128'; \
    echo 'opcache.interned_strings_buffer=8'; \
    echo 'opcache.max_accelerated_files=4000'; \
    echo 'opcache.revalidate_freq=0'; \
    echo 'opcache.fast_shutdown=1'; \
    echo 'opcache.enable_cli=1'; \
    echo 'opcache.enable=1'; \
    echo 'opcache.validate_timestamps=0'; \
    } > /usr/local/etc/php/conf.d/opcache.ini

# Configure PHP for production
RUN { \
    echo 'memory_limit=256M'; \
    echo 'upload_max_filesize=100M'; \
    echo 'post_max_size=100M'; \
    echo 'max_execution_time=60'; \
    echo 'expose_php=Off'; \
    } > /usr/local/etc/php/conf.d/production.ini

# Configure nginx with a placeholder for the port
RUN echo 'server { \
    listen ${PORT}; \
    server_name localhost; \
    root /var/www/html/public; \
    index index.php; \
    charset utf-8; \
    location / { \
    try_files $uri $uri/ /index.php?$query_string; \
    } \
    location ~ \.php$ { \
    fastcgi_pass 127.0.0.1:9000; \
    fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name; \
    include fastcgi_params; \
    } \
    location ~ /\.(?!well-known).* { \
    deny all; \
    } \
    }' > /etc/nginx/http.d/default.conf

# Updated Supervisor Config to prevent "Invalid seek"
RUN echo '[supervisord]' > /etc/supervisord.conf && \
    echo 'nodaemon=true' >> /etc/supervisord.conf && \
    echo 'user=root' >> /etc/supervisord.conf && \
    echo 'logfile=/dev/null' >> /etc/supervisord.conf && \
    echo 'logfile_maxbytes=0' >> /etc/supervisord.conf && \
    echo '' >> /etc/supervisord.conf && \
    echo '[program:php-fpm]' >> /etc/supervisord.conf && \
    echo 'command=php-fpm -F' >> /etc/supervisord.conf && \
    # We change stderr_logfile to /dev/stdout to remove red flags
    echo 'stdout_logfile=/dev/stdout' >> /etc/supervisord.conf && \
    echo 'stdout_logfile_maxbytes=0' >> /etc/supervisord.conf && \
    echo 'stderr_logfile=/dev/stdout' >> /etc/supervisord.conf && \
    echo 'stderr_logfile_maxbytes=0' >> /etc/supervisord.conf && \
    echo '' >> /etc/supervisord.conf && \
    echo '[program:nginx]' >> /etc/supervisord.conf && \
    echo 'command=nginx -g "daemon off;"' >> /etc/supervisord.conf && \
    # We change stderr_logfile to /dev/stdout here as well
    echo 'stdout_logfile=/dev/stdout' >> /etc/supervisord.conf && \
    echo 'stdout_logfile_maxbytes=0' >> /etc/supervisord.conf && \
    echo 'stderr_logfile=/dev/stdout' >> /etc/supervisord.conf && \
    echo 'stderr_logfile_maxbytes=0' >> /etc/supervisord.conf

# Set working directory
WORKDIR /var/www/html

# Copy composer dependencies from stage 1
COPY --from=composer /app/vendor ./vendor

# Copy application code
COPY . .

# Copy and set permissions for entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Run composer dump-autoload for production optimization
RUN php -d memory_limit=-1 /usr/local/bin/composer dump-autoload --optimize --classmap-authoritative --no-dev 2>/dev/null || true

# Force PHP-FPM to listen on port 9000 instead of a socket
RUN sed -i 's/listen = \/usr\/local\/var\/run\/php-fpm.sock/listen = 9000/g' /usr/local/etc/php-fpm.d/zz-docker.conf || true \
    && sed -i 's/listen = 127.0.0.1:9000/listen = 9000/g' /usr/local/etc/php-fpm.d/www.conf || true

# Expose port 80 for nginx
EXPOSE 80

# Use custom entrypoint
ENTRYPOINT ["docker-entrypoint.sh"]

# Start supervisor (runs both nginx and php-fpm)
CMD ["supervisord", "-c", "/etc/supervisord.conf"]
