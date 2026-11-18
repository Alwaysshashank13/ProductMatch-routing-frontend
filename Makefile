.DEFAULT_GOAL := help
PY ?= python
EXPERIMENT ?= sample

.PHONY: help install install-semantic lint format test sample run api web dev build up down clean

help:  ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-18s %s\n", $$1, $$2}'

install:  ## Install backend (editable, with dev tools) and frontend
	$(PY) -m pip install -e "./backend[dev]"
	cd frontend && npm ci
	@pre-commit install 2>/dev/null || echo "(Tip: run 'git init' then 'pre-commit install' to enable git hooks)"

install-semantic:  ## Add the local embedding model support (large download)
	$(PY) -m pip install -e "./backend[semantic]"

lint:  ## Lint backend and type-check frontend
	cd backend && ruff check src tests && ruff format --check src tests
	cd frontend && npm run typecheck

format:  ## Auto-format backend code
	cd backend && ruff format src tests && ruff check --fix src tests

test:  ## Run backend tests with coverage
	cd backend && $(PY) -m pytest --cov=productmatch_routing --cov-report=term-missing

sample:  ## Generate synthetic development data
	pmr make-sample --out data/sample

run:  ## Run an experiment: make run EXPERIMENT=amazon_google
	pmr run --config configs/experiments/$(EXPERIMENT).yaml

api:  ## Start the API on :8000
	ARTIFACTS_DIR=artifacts pmr serve --reload

web:  ## Start the dashboard on :5173
	cd frontend && npm run dev

dev:  ## Start API and dashboard together (Ctrl+C stops both)
	$(MAKE) -j2 api web

build:  ## Production build of the frontend
	cd frontend && npm run build

up:  ## Run API + dashboard in Docker (http://localhost:8080)
	docker compose up --build

down:  ## Stop Docker services
	docker compose down

clean:  ## Remove caches and build output
	find . -name "__pycache__" -type d -prune -exec rm -rf {} +
	rm -rf backend/.pytest_cache backend/.ruff_cache backend/.coverage frontend/dist
