# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Tourism assistance web platform with three independent modules: `/chat` (conversational agent with tool calls), `/pdf` (named-entity extraction from PDFs), and `/dashboard` (CSV-driven dynamic charts). **Currently in Mock-first phase** — real LLM/agent integrations are not yet implemented.

## Development commands

**Infrastructure (required first):**
```bash
docker compose up -d        # starts PostgreSQL:5432, Valkey:6379, ChromaDB:8000
docker compose down -v      # stop and clean volumes
```

**Frontend** (in `frontend/`):
```bash
pnpm install
pnpm dev          # Vite dev server on port 5173
pnpm build
pnpm type-check   # tsc without emit
pnpm lint         # ESLint
```

**Backend** (in `backend/`):
```bash
uv sync
uv run uvicorn app.main:app --reload --port 8080
uv run celery -A app.tasks.celery_app worker --loglevel=info
uv run alembic upgrade head
```

Format/lint backend before committing: `ruff format` + `ruff check`.

## Architecture

### Frontend (`frontend/src/`)
- `app/store.ts` — Redux store; `app/router.tsx` — TanStack Router (routes: `/chat`, `/pdf`, `/dashboard`)
- `features/<module>/` — each module has `components/`, `hooks/`, `store/`, `api/`
- `shared/components/` — Layout, Sidebar, LoadingOverlay (shared shell)
- `shared/mocks/` — mock data served by backend (not imported directly by frontend)
- `shared/types/` — TypeScript types that mirror backend Pydantic schemas

**State rules:** TanStack Query for server state, Redux only for UI state. Never import from `features/` inside `shared/`. Use `@/` alias for all imports.

### Backend (`backend/app/`)
- `core/config.py` — all settings via `pydantic-settings`; key flag: `USE_MOCKS` env var
- `core/database.py` — async SQLAlchemy engine + `get_session` FastAPI dependency
- `api/v1/` — three routers (`chat.py`, `pdf.py`, `dashboard.py`) under prefix `/api/v1`
- `services/mock_*_service.py` — mock implementations with simulated async latency
- `agents/travel_agent.py` — **stub only**, raises `NotImplementedError`; do not add real logic here yet
- `models/` — SQLAlchemy models; `schemas/` — Pydantic request/response schemas

### API contracts
All endpoints under `/api/v1`. Key ones:
- `POST /chat/message` — sends user message, returns assistant `ChatMessage` with `tool_calls`
- `POST /pdf/extract` — uploads PDF, returns `job_id` (mock returns `status: done` immediately)
- `GET /pdf/{job_id}` — polls job status
- `POST /dashboard/parse` — uploads CSV, returns inferred columns + row count

### Type sync rule
TypeScript types in `shared/types/` and Pydantic schemas in `backend/app/schemas/` are structurally equivalent. Update both in the same commit when changing a contract.

## Mock-first phase constraints

- Do **not** implement real LLM calls, external APIs, or agent logic
- `agents/travel_agent.py` must remain a stub raising `NotImplementedError`
- Frontend `*Api.ts` files always call `/api/v1/...`; they never import mock data directly
- When `USE_MOCKS=False`, services raise `NotImplementedError` (real impl is a future phase)
- Mock services must simulate latency with an async delay

## Valkey (Redis-compatible)

Valkey replaces Redis entirely. Use `redis://` scheme in URLs. Three logical DBs: 0 = cache/sessions, 1 = Celery broker, 2 = Celery results backend.

## Git conventions

Branch names: `feature/<module>/<description>`, `fix/<description>`, `chore/<description>`. Commit messages in Spanish, imperative mood (e.g., `Añadir endpoint de carga de CSV`).
