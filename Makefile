.PHONY: restart
restart: down up

.PHONY: down
down:
	docker compose down -v

.PHONY: up
up:
	docker compose up -d --build