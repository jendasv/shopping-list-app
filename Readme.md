# Listmania

A household management app that brings all your shared lists into one place — grocery runs, packing for trips, to-do tasks, and anything else your household needs to coordinate.

The core idea: **you shouldn't have to think**. The app knows your product catalog, your templates, and what you have at home. You confirm and go — shopping or packing.

---

## What it does

- **Shared lists in real-time** — add items on your phone, your partner sees them instantly (WebSockets via Laravel Reverb)
- **Household model** — one household per registration, invite your partner, items and catalog are shared
- **Product catalog** — build your household's catalog naturally as you shop; search-as-you-type when adding items
- **Barcode scanner** — scan a product barcode to auto-fill the form; looks up Open Food/Beauty/Products/Pet Food Facts if not in local DB
- **List types** — Shopping, Packing, To-do; each with appropriate UI (quantity hidden for todos)
- **Units** — grouped by type (count / weight / volume), nullable; smart display (`3×` vs `1 kg`)
- **PWA** — installable on any phone from the browser, no app store required
- **Superadmin panel** — Filament-based at `/admin`; manage users, households, global products
- **Localization** — English and Czech; UI language per user account

### What's planned next (not yet built)
Labels & grouping → Shopping mode → Templates & Recipes → Inventory → Push notifications → Billing (Stripe, €2–4/month Pro plan)

---

## Tech stack

| Layer | Technology |
|---|---|
| Backend | Laravel 13, PHP 8.3 |
| Auth | Laravel Sanctum (cookie-based SPA auth) |
| Real-time | Laravel Reverb (WebSockets) |
| Admin panel | Filament v4 |
| Frontend | Vue 3, TypeScript, Tailwind CSS, Vite |
| Database | PostgreSQL 17 |
| Search | Open Food Facts / Open Beauty Facts / Open Products Facts / Open Pet Food Facts |
| Email (dev) | Mailpit |
| Email (prod) | Resend |
| Barcode scanning | `@zxing/browser` (BrowserMultiFormatReader) |

---

## Project structure

```
shopping-list-laravel/
├── backend/                    Laravel 13 app
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   ├── Service/
│   │   ├── Mapper/
│   │   ├── Models/
│   │   └── Events/
│   ├── database/migrations/
│   ├── lang/                   Backend translations (email, admin)
│   ├── routes/api.php
│   └── tests/
│       ├── Feature/            Auth, List, Item, Household, Invitation tests
│       └── Unit/               Mapper and Service unit tests
├── frontend/                   Vue 3 SPA
│   └── src/
│       ├── components/
│       ├── views/
│       ├── stores/             Pinia (auth)
│       ├── services/           API layer (authService, listService, ...)
│       ├── types/
│       └── locales/            vue-i18n (en, cs)
├── docker/
│   ├── php/                    PHP-FPM Dockerfiles (dev + prod)
│   ├── nginx/                  Nginx configs (dev + prod, multi-stage prod build)
│   ├── postgres/               PostgreSQL init
│   └── certs/                  Dev TLS certs (gitignored — generate with mkcert)
├── docker-compose.prod.yml     Production stack
├── deploy.sh                   Deployment helper (setup / update)
└── frontend/.env.production.example
```

---

## Local development setup

### 1. Clone and copy env files

```bash
git clone <repo-url>
cd shopping-list-laravel

cp backend/.env.example backend/.env
cp frontend/.env.development.example frontend/.env.development
```

Edit `backend/.env` — the important values:

```env
APP_KEY=                        # generate with: php artisan key:generate
APP_URL=http://localhost:8080
FRONTEND_URL=http://localhost:5173

DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=shopping
DB_USERNAME=postgres
DB_PASSWORD=postgres

REVERB_APP_ID=1
REVERB_APP_KEY=listmania-key
REVERB_APP_SECRET=listmania-secret
REVERB_HOST=localhost
REVERB_PORT=6001

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
```

### 2. Start Docker containers

The project uses a Docker Compose dev stack with PHP-FPM, Nginx, PostgreSQL, Reverb, and Mailpit.

```bash
docker compose up -d
```

Services and ports:

| Service | Local URL |
|---|---|
| API + Filament admin | `http://localhost:8080` |
| Frontend (Vite HMR) | `http://localhost:5173` |
| Adminer (DB browser) | `http://localhost:8081` |
| Mailpit (catch-all email) | `http://localhost:8025` |
| Reverb WebSocket | `ws://localhost:6001` |

### 3. Install dependencies and migrate

```bash
# Backend (inside PHP container)
docker compose exec php composer install
docker compose exec php php artisan key:generate
docker compose exec php php artisan migrate --seed

# Frontend (from host)
cd frontend && npm install
npm run dev
```

### 4. Create a superadmin

```bash
docker compose exec php php artisan admin:create your@email.com
```

Filament admin panel is at `http://localhost:8080/admin`.

---

## HTTPS in dev (required for barcode scanner)

The camera API (`getUserMedia`) requires a secure context. On your local machine, `localhost` counts as secure — the scanner works fine in desktop browsers without HTTPS.

**For testing on a real phone (iOS/Android):**

1. Install [mkcert](https://github.com/FiloSottile/mkcert) on your machine
2. Generate certs:
   ```bash
   mkcert -install
   mkdir -p docker/certs
   mkcert -cert-file docker/certs/cert.pem -key-file docker/certs/key.pem localhost 192.168.x.x "*.local"
   ```
3. The Vite dev server reads certs from `docker/certs/` (configured in `vite.config.ts`)
4. On iOS — install the mkcert root CA on the iPhone, then open the app in **Safari** (Chrome on iOS does not support the camera API)
5. On Windows/WSL2 — add a port proxy to forward from the Windows IP to WSL: `netsh interface portproxy add v4tov4 listenport=5173 listenaddress=0.0.0.0 connectport=5173 connectaddress=<WSL-IP>`

---

## Running tests

### Backend

```bash
# Run full test suite (requires shopping_test PostgreSQL database)
docker compose exec php php artisan test

# Code style check
docker compose exec php ./vendor/bin/pint --test

# Static analysis
docker compose exec php ./vendor/bin/phpstan analyse --memory-limit=512M
```

> The test suite uses a separate `shopping_test` database. Create it in Adminer or: `docker compose exec postgres createdb -U postgres shopping_test`

### Frontend

```bash
cd frontend

# TypeScript type check
npm run type-check

# Lint
npm run lint

# Production build (includes type-check)
npm run build
```

---

## API overview

All endpoints are prefixed with `/api`. Auth uses Laravel Sanctum cookie sessions — the frontend must first hit `GET /sanctum/csrf-cookie` before any POST.

### Auth (unauthenticated)
```
POST /auth/register
POST /auth/login
POST /auth/forgot-password
POST /auth/reset-password
POST /invitations/{token}/accept
POST /invitations/{token}/decline
```

### Auth (authenticated, `sanctum` middleware)
```
POST /auth/logout
GET  /auth/user
PUT  /auth/profile
PUT  /auth/password
POST /auth/email/resend
```

### Household
```
GET    /household                        → { ownHousehold, joinedHouseholds[] }
PUT    /household
POST   /household/{id}/leave
DELETE /household/members/{userId}       → remove member (owner only)
```

### Invitations
```
POST /invitations                        → send invite by email
```

### Lists
```
GET    /lists
POST   /lists
GET    /lists/{id}
PUT    /lists/{id}
DELETE /lists/{id}
```

List types: `shopping` | `packing` | `todo`
Visibility: `shared` | `private`

### List items
```
POST   /lists/{id}/items
GET    /lists/{id}/items/{itemId}
PUT    /lists/{id}/items/{itemId}
DELETE /lists/{id}/items/{itemId}
```

### Product catalog
```
GET    /products/search?q=&limit=        → autocomplete (min 2 chars)
GET    /products                         → full catalog with pagination
POST   /products
PUT    /products/{id}
DELETE /products/{id}                    → soft delete
```

### Categories, Units, Global products
```
GET    /categories                       → global + household categories
POST   /categories
PUT    /categories/{id}
DELETE /categories/{id}

GET    /units                            → grouped by type with translations

GET    /global-products/search?barcode=  → barcode lookup (checks local DB, then 4 external APIs)
POST   /global-products                  → save user-contributed product (household-scoped)
```

---

## Production deployment

The production stack runs on a single VPS (Hetzner CX22, ~€4.51/month) via Docker Compose.

### Stack

| Container | Role |
|---|---|
| `php` | Laravel PHP-FPM |
| `nginx` | HTTPS termination + Vue SPA serving + API proxy + Reverb WebSocket proxy |
| `postgres` | Database (persistent volume) |
| `reverb` | WebSocket server (internal port 6001) |
| `queue` | `php artisan queue:work` |
| `scheduler` | `php artisan schedule:work` |
| `certbot` | Let's Encrypt certificate + auto-renewal every 12h |

The frontend is built **inside the nginx Docker image** (multi-stage build). Only two env vars are baked in at build time: `VITE_APP_NAME` and `VITE_REVERB_APP_KEY`. All other config comes from `backend/.env` at runtime.

### First deployment

On a fresh VPS (Ubuntu/Debian):

```bash
apt install docker.io docker-compose-plugin
git clone <repo-url> && cd shopping-list-laravel

# Fill in all values (APP_KEY, DB_PASSWORD, REVERB_*, MAIL_*, RESEND_API_KEY, ...)
cp backend/.env.example backend/.env
nano backend/.env

# Create a root-level .env for Docker build args (baked into frontend JS)
echo 'VITE_APP_NAME=Listmania' > .env
echo 'VITE_REVERB_APP_KEY=your-reverb-app-key' >> .env

./deploy.sh setup yourdomain.com
```

### Updates

```bash
./deploy.sh update
# Runs: git pull → rebuild images → restart containers → migrate
```

### WebSocket in production

nginx proxies `wss://yourdomain.com/app/*` → `http://reverb:6001`. The frontend auto-detects environment via `import.meta.env.DEV` and uses port 443 in production builds.

---

## Barcode scanner notes

- Works on any HTTPS page with camera access
- **iOS Safari only** — Chrome and other iOS browsers do not expose the camera API (WKWebView limitation)
- Looks up product by EAN-13 / UPC-A / QR code:
  1. Local `global_products` table (instant)
  2. If not found — parallel HTTP requests to 4 Open \*Facts APIs (max 5s timeout)
  3. If found externally — saved to local DB for future lookups
- User-contributed products (scanned + manually named) are household-scoped until an admin promotes them to global

---

## Localization

Supported languages: `en`, `cs` — configured in `config/locales.php`.

- **Backend emails** — `lang/{en,cs}/mail.php`
- **Filament admin** — `lang/cs.json`
- **Frontend** — `frontend/src/locales/` via `vue-i18n`

Locale is stored per user (`users.locale`), with `en` as fallback.
