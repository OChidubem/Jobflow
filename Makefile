up:
	docker compose -f infra/docker-compose.yml up -d

down:
	docker compose -f infra/docker-compose.yml down

logs:
	docker compose -f infra/docker-compose.yml logs -f

ps:
	docker compose -f infra/docker-compose.yml ps

dev:
	cd apps/api && uvicorn app.main:app --reload --port 8000

migrate:
	cd apps/api && alembic upgrade head

migration:
	cd apps/api && alembic revision --autogenerate -m "$(msg)"

test:
	cd apps/api && python -m pytest tests/ -v

web:
	cd apps/web && npm run dev
