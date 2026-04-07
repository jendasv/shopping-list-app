FROM php:8.3-fpm

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libicu-dev \
    libzip-dev \
    libonig-dev \
    zip \
    curl \
    && docker-php-ext-install \
        pdo \
        pdo_mysql \
        intl \
        zip \
        mbstring \
        pcntl

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# prepare laravel folders
RUN mkdir -p \
    storage/app \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

# give wide permissions so both host + container can write
RUN chmod -R 777 storage bootstrap/cache