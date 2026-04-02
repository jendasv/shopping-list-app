PHP = docker compose exec php
FRONT = docker compose exec frontend

up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose up -d --build

init:
	docker compose up -d --build
	docker compose exec php composer install


clear:
	docker compose down -v --rmi all

reset:
	docker compose down -v --rmi all
	docker compose up -d --build

php:
	$(PHP) bash

artisan:
	$(PHP) php artisan $(filter-out $@,$(MAKECMDGOALS))

composer:
	$(PHP) composer $(filter-out $@,$(MAKECMDGOALS))

phpstan:
	$(PHP) ./vendor/bin/phpstan analyse --memory-limit=512M

pint:
	$(PHP) ./vendor/bin/pint

pint-test:
	$(PHP) ./vendor/bin/pint --test