# Shopping list app

This project is a Shopping list app.

## Author
Jan Svoboda

## Introduction
Rebuild of the original Symfony + Vue shopping list app. The original project:
- GitHub: https://github.com/jan-svoboda/shopping-list
- Local: `\\wsl.localhost\Debian\home\jendasv\work-projects\shopping-list`

Backend is Laravel 13 (PHP 8.3). Frontend is Vue 3 + TypeScript (located in `../frontend/`).

---

## Backend structure

```
app/
├── Exceptions/
│   ├── ApiException.php                        ← abstract base (statusCode)
│   ├── Domain/
│   │   ├── ResourceNotFoundException.php       ← 404
│   │   └── ValidationException.php            ← 400 + details[]
│   └── Infrastructure/
│       └── DatabaseOperationException.php      ← 500
├── Http/
│   ├── Controllers/Api/
│   │   ├── ShoppingListController.php
│   │   └── ItemController.php
│   └── Requests/
│       ├── StoreShoppingListRequest.php
│       ├── UpdateShoppingListRequest.php
│       ├── StoreItemRequest.php
│       └── UpdateItemRequest.php
├── Mapper/
│   ├── ShoppingListMapper.php
│   └── ItemMapper.php
├── Models/
│   ├── ShoppingList.php                        ← table: shopping_list
│   └── Item.php                                ← table: item
└── Service/
    ├── ShoppingListService.php
    └── ItemService.php
```

---

## API endpoints

```
GET    /api/lists                          → list all shopping lists (without items)
POST   /api/lists                          → create list (+ optional items in body)
GET    /api/lists/{id}/items               → get list with its items
PUT    /api/lists/{id}                     → update list name
DELETE /api/lists/{id}                     → delete list (cascades to items)

POST   /api/lists/{id}/item                → add item to list
GET    /api/lists/{id}/items/{itemId}      → get single item
PUT    /api/lists/{id}/items/{itemId}      → update item (name, quantity, isCompleted)
DELETE /api/lists/{id}/items/{itemId}      → delete item
```

HTTP status codes: `200` (ok), `201` (created), `204` (no content), `400` (validation), `404` (not found), `500` (db error).

---

## JSON response format

All responses use camelCase field names (matches frontend types).

**ShoppingList (list only):**
```json
{ "id": 1, "name": "...", "createdAt": "2026-03-01 10:00:00", "updatedAt": "2026-03-01 10:00:00" }
```

**ShoppingList (with items):**
```json
{
  "id": 1, "name": "...", "createdAt": "...", "updatedAt": "...",
  "items": [
    { "id": 1, "name": "...", "quantity": 2, "isCompleted": false,
      "shoppingListId": 1, "createdAt": "...", "updatedAt": "..." }
  ]
}
```

**Error:** `{"error": "message"}` or `{"error": "message", "details": {"field": "reason"}}`

---

## Mapper layer

Located in `app/Mapper/`. Convert Eloquent models to response arrays.

- **`ItemMapper::map(Item)`** — camelCase keys, date format `Y-m-d H:i:s`
- **`ShoppingListMapper::map(ShoppingList, $listOnly = false)`** — `$listOnly=true` omits items array, `false` includes items mapped via `ItemMapper`

`ShoppingListMapper` receives `ItemMapper` via constructor injection (Laravel DI).

---

## Service layer

Located in `app/Service/`. Controllers delegate all business logic here.

- **`ShoppingListService`** — `getAllLists()`, `findList(int)`, `getList(int)`, `createList(array)`, `updateList(int, array)`, `deleteList(int)`
- **`ItemService`** — `getItemsForList(int)`, `getItem(int, int)`, `createItem(array, ShoppingList)`, `createItemForList(int, array)`, `updateItem(int, int, array)`, `deleteItem(int, int)`

Services throw domain exceptions (`ResourceNotFoundException`, `ValidationException`, `DatabaseOperationException`) — never return raw errors.

---

## Exception handling

Exception classes in `app/Exceptions/`. Handler registered in `bootstrap/app.php` via `withExceptions()` (Laravel 13 style — no `Handler.php`).

The handler always returns `{"error": "..."}`. For `ValidationException` with non-empty details it adds `"details": {...}`.

---

## Validation

Use `FormRequest` classes (`app/Http/Requests/`). All requests override `failedValidation()` to return HTTP 400 (not Laravel's default 422), matching the Symfony original format.

---

## Code quality

### PHPStan
Configured in `phpstan.neon`. Uses `larastan/larastan` (Laravel extension). Level 6, analyses `app/` only.

Run: `make phpstan`

### Pint (code formatter)
Configured in `pint.json`. Uses the `laravel` preset with `declare_strict_types` rule enforced. Excludes `config/`, `database/`, `public/`, `bootstrap/`, `routes/`, `tests/`.

Run: `make pint` to fix, `make pint-test` to check only.

> Every change to `app/` must pass both `make phpstan` and `make pint-test` before committing.

---

## Frontend

Located in `../frontend/src/`. Vue 3 + TypeScript + Vite + Tailwind CSS + Pinia + Vue Router.

### Stack
- **Vue 3** with `<script setup lang="ts">` composition API
- **TypeScript** — strict mode, `noUncheckedIndexedAccess` enabled
- **Tailwind CSS 4** + custom SCSS (`assets/main.scss`) for animations and paper-style theme
- **Pinia** — installed but not yet used, all state lives in composables
- **Vue Router 5** — three routes: `/`, `/list/:id`, `/lists/new`
- **Font:** Google Fonts "Caveat" (handwritten style)

### Structure
```
src/
├── views/
│   ├── HomeView.vue           ← list of all shopping lists (index)
│   ├── ListDetail.vue         ← single list with items (CRUD)
│   └── CreateShoppingList.vue ← create list with items in one step
├── composables/
│   ├── useShoppingLists.ts    ← state + logic for HomeView (lists, error, editingListId, CRUD)
│   └── useListDetail.ts       ← state + logic for ListDetail (list, error, editingItemId, CRUD)
├── services/
│   ├── api.ts                 ← generic apiFetch<T>() wrapper
│   ├── shoppingListService.ts ← fetchAllLists, fetchList, createList, updateList, deleteList
│   └── itemService.ts         ← createItem, updateItem, deleteItem
├── components/
│   ├── form/AddItemForm.vue   ← reusable add item form
│   ├── elements/              ← AlertMessage, HandDrawnDivider, HandDrawnCheckbox
│   ├── icons/                 ← hand-drawn SVG icons (arrows, pencil, close, plus)
│   └── animations/Typewrite.vue ← typing effect on new items/lists
├── types/index.ts             ← iItem, iShoppingList, iNewList interfaces
└── router/index.ts            ← route definitions + beforeEnter guard on /list/:id
```

### API communication
All API calls go through named functions in `services/shoppingListService.ts` and `services/itemService.ts`. These use `apiFetch<T>()` from `services/api.ts`. Base URL is read from `VITE_API_URL` env variable. The function throws on non-2xx responses and handles 204 No Content by returning `undefined`.

### Composables
Views contain only template logic. All state and API logic lives in composables:
- `useShoppingLists()` — used by `HomeView.vue`
- `useListDetail(id)` — used by `ListDetail.vue`

### Type checking
`vite-plugin-checker` is configured with `vueTsc: true` in `vite.config.ts` — TypeScript errors appear in the browser overlay and terminal during `npm run dev`. Full check also runs on `npm run build` via `vue-tsc --build`.

### Design patterns
- Inline editing uses an `editingId` ref (null = no edit) — toggled by pencil icon, confirmed by ✔ button
- New items/lists use `isNew: true` flag to trigger the `Typewrite` animation, reset to `false` on animation end
- `AlertMessage` auto-hides after 5s (configurable via `duration` prop)
- `beforeEnter` guard on `/list/:id` fetches the list and stores it in `to.meta.list`, then redirects to home if the list does not exist. `useListDetail` reads `route.meta.list` on mount and skips the fetch if data is already available — avoids double request on navigation.

### Requirements when modifying frontend
- Always run `npm run type-check` (or rely on dev server overlay) — no TypeScript errors allowed
- camelCase field names from the API (`isCompleted`, `shoppingListId`) — matches backend mapper output
- Do not use `Array.at()` — target lib does not include ES2022 (`array[array.length - 1]` instead)
- Keep inline editing pattern consistent across views (see `ListDetail.vue` as reference)
- All API calls go through `services/` — never call `apiFetch` directly from a view or composable
- All state and logic belong in composables — views contain only template and UI-only refs (e.g. `showItemAddForm`)
- Icon stroke color is controlled via `strokeClass` prop — never hardcode `stroke="#..."` on SVG path elements
