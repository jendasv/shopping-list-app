#!/bin/bash
set -e

DOMAIN="${1:-}"
COMPOSE="docker compose -f docker-compose.prod.yml"

# ─── helpers ────────────────────────────────────────────────────────────────

usage() {
  echo "Usage:"
  echo "  ./deploy.sh setup <yourdomain.com>   # first time: get SSL cert + start stack"
  echo "  ./deploy.sh update                   # pull code, rebuild, migrate, restart"
  exit 1
}

require_env() {
  if [ ! -f backend/.env ]; then
    echo "ERROR: backend/.env not found. Copy backend/.env.example and fill in values."
    exit 1
  fi
}

# ─── setup (first deployment) ────────────────────────────────────────────────

setup() {
  DOMAIN="${1:-}"
  [ -z "$DOMAIN" ] && { echo "ERROR: domain required. Usage: ./deploy.sh setup yourdomain.com"; exit 1; }

  require_env

  # Replace DOMAIN placeholder in nginx config
  sed -i "s/DOMAIN/$DOMAIN/g" docker/nginx/default.prod.conf

  echo "→ Starting nginx on port 80 for ACME challenge..."
  $COMPOSE up -d nginx certbot postgres

  echo "→ Obtaining SSL certificate for $DOMAIN..."
  docker run --rm \
    -v shopping_certbot_certs:/etc/letsencrypt \
    -v shopping_certbot_www:/var/www/certbot \
    certbot/certbot certonly \
      --webroot \
      --webroot-path /var/www/certbot \
      --email "$(grep APP_URL backend/.env | grep -oP '(?<=@)[^>]+' || echo admin@$DOMAIN)" \
      --agree-tos \
      --no-eff-email \
      -d "$DOMAIN"

  echo "→ Building and starting full stack..."
  $COMPOSE up -d --build

  echo "→ Running migrations..."
  $COMPOSE exec php php artisan migrate --force

  echo "✓ Done. App is running at https://$DOMAIN"
}

# ─── update (subsequent deployments) ─────────────────────────────────────────

update() {
  require_env

  echo "→ Pulling latest code..."
  git pull

  echo "→ Rebuilding images..."
  $COMPOSE build --no-cache php nginx

  echo "→ Restarting services..."
  $COMPOSE up -d

  echo "→ Running migrations..."
  $COMPOSE exec php php artisan migrate --force

  echo "→ Clearing old caches..."
  $COMPOSE exec php php artisan cache:clear

  echo "✓ Update complete."
}

# ─── entry point ─────────────────────────────────────────────────────────────

case "${1:-}" in
  setup)  setup "$2" ;;
  update) update ;;
  *)      usage ;;
esac
