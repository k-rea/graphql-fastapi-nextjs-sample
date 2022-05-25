.PHONY: test
test:
	docker compose exec api python -m pytest "src/tests" --durations=5 -p no:warnings --cov="src" --cov-report=html

.PHONY: flake
flake:
	docker compose exec api flake8 src

.PHONY: black
black:
	docker compose exec api black src


.PHONY: isort
isort:
	docker compose exec api isort src

.PHONY: check
check:
	docker compose exec api flake8 src
	docker compose exec api black src --check
	docker compose exec api isort src --check-only

.PHONY: db-init
db-init:
	docker compose exec api alembic revision -m "DB Init. Create tasks." --autogenerate

