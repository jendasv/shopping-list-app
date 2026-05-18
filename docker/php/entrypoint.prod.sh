#!/bin/sh
set -e

php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Create storage symlink if it doesn't exist
if [ ! -L public/storage ]; then
    php artisan storage:link
fi

exec "$@"
