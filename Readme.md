# Shopping list

## Installation

```bash
git clone git@github.com:jendasv/shopping-list-app.git
cd shopping-list-app
```

### Environment variables

Backend — copy and adjust:
```bash
cp backend/.env.example backend/.env
```

Frontend — copy and adjust:
```bash
cp frontend/.env.development.example frontend/.env.development
```

### Docker

Build images and install dependencies:
```bash
make init
```

### Migration

Run database migrations:
```bash
make artisan migrate
```

### URLs

| Service  | URL                     |
|----------|-------------------------|
| API      | http://localhost:8080/  |
| Frontend | http://localhost:5173/  |
| Adminer  | http://localhost:8081/  |

Database: `shopping`

---

# API

## Base URL
```
http://localhost:8080/api/
```

## Shopping list endpoints

### Get all lists
Returns all shopping lists (without items).
```
GET /lists
```

### Get list with items
Returns a specific list including all its items.
```
GET /lists/:id/items
```

### Create list
Creates a new list. Items are optional and can be included in the request body.
```
POST /lists
```
```json
{
    "name": "My shopping list",
    "items": [
        { "name": "Milk", "quantity": 2 },
        { "name": "Bread", "quantity": 1 }
    ]
}
```

### Update list name
Updates the name of an existing list.
```
PUT /lists/:id
```
```json
{
    "name": "Updated list name"
}
```

### Delete list
Removes a list and all its items.
```
DELETE /lists/:id
```

---

## Item endpoints

### Get item
Returns a specific item from a list.
```
GET /lists/:id/items/:itemId
```

### Create item
Adds a new item to a list.
```
POST /lists/:id/item
```
```json
{
    "name": "Potatoes",
    "quantity": 5,
    "isCompleted": true // optional
}
```

### Update item
Updates an existing item. All fields are optional.
```
PUT /lists/:id/items/:itemId
```
```json
{
    "name": "Potatoes",
    "quantity": 5,
    "isCompleted": true
}
```

### Delete item
Removes an item from a list.
```
DELETE /lists/:id/items/:itemId
```
