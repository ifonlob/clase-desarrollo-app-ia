# TDAI — Asistente Turístico con IA

Plataforma web de asistencia turística con tres módulos independientes: un chatbot agente con herramientas de búsqueda, un extractor de entidades nombradas desde PDFs y un dashboard interactivo para datos CSV.

**Estado actual: fase mock-first** — todas las interfaces están implementadas y funcionales contra servicios mock; la integración real con LLMs y APIs externas se implementará en la fase 2.

---

## Módulos

| Módulo | Ruta | Descripción |
|--------|------|-------------|
| **Chat Agente** | `/chat` | Chatbot conversacional que puede consultar el tiempo, buscar en internet, buscar vuelos/hoteles y recuperar FAQs de monumentos desde una base de datos vectorial |
| **Extractor PDF** | `/pdf` | Sube un PDF y extrae entidades nombradas (lugares, monumentos, personas, fechas, organizaciones, eventos) |
| **Dashboard CSV** | `/dashboard` | Sube un CSV y genera gráficas interactivas configurables (barras, líneas, pastel, dispersión, área) |

---

## Stack tecnológico

**Frontend:** React 18 · TypeScript strict · Vite · TanStack Router · TanStack Query v5 · Redux Toolkit · PrimeReact · TailwindCSS · PapaParse

**Backend:** FastAPI · Pydantic v2 · SQLAlchemy 2 async · Alembic · Celery 5 · Python 3.12+

**Infraestructura:** PostgreSQL 16 · Valkey 9 (Redis-compatible) · ChromaDB

---

## Requisitos

- [uv](https://docs.astral.sh/uv/) ≥ 0.4
- [pnpm](https://pnpm.io/) ≥ 9
- [Docker](https://www.docker.com/) con Compose v2

---

## Inicio rápido

### 1. Infraestructura

```bash
docker compose up -d
```

Levanta PostgreSQL (`:5432`), Valkey (`:6379`) y ChromaDB (`:8000`).

### 2. Backend

```bash
cd backend
cp ../.env.example .env   # ajusta si es necesario
uv sync
uv run uvicorn app.main:app --reload --port 8080
```

API disponible en `http://localhost:8080`. Documentación interactiva en `http://localhost:8080/docs`.

### 3. Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Aplicación disponible en `http://localhost:5173`. Las llamadas a `/api` se redirigen automáticamente al backend.

---

## Variables de entorno

Copia `.env.example` a `backend/.env`. Las variables principales:

| Variable | Valor por defecto | Descripción |
|----------|-------------------|-------------|
| `USE_MOCKS` | `true` | Activa los servicios mock (fase actual) |
| `DATABASE_URL` | `postgresql+asyncpg://tdai:tdai_pass@localhost:5432/tdai_db` | Conexión a PostgreSQL |
| `REDIS_URL` | `redis://localhost:6379/0` | Caché / sesiones (Valkey) |
| `CELERY_BROKER_URL` | `redis://localhost:6379/1` | Broker de Celery (Valkey) |
| `CELERY_RESULT_BACKEND` | `redis://localhost:6379/2` | Backend de resultados de Celery (Valkey) |

---

## Comandos de desarrollo

### Backend

```bash
# Servidor de desarrollo
uv run uvicorn app.main:app --reload --port 8080

# Worker de Celery
uv run celery -A app.tasks.celery_app worker --loglevel=info

# Migraciones
uv run alembic upgrade head
uv run alembic revision --autogenerate -m "descripción"

# Linting y formato
uv run ruff check .
uv run ruff format .
```

### Frontend

```bash
pnpm dev          # servidor de desarrollo (puerto 5173)
pnpm build        # build de producción
pnpm type-check   # verificación de tipos sin emitir
pnpm lint         # ESLint
```

### Infraestructura

```bash
docker compose up -d        # levantar servicios
docker compose down -v      # parar y eliminar volúmenes
docker compose logs -f      # ver logs
```

---

## Estructura del proyecto

```
.
├── backend/
│   ├── app/
│   │   ├── api/v1/          # Routers: chat.py, pdf.py, dashboard.py
│   │   ├── agents/          # travel_agent.py (stub — fase 2)
│   │   ├── core/            # config.py, database.py
│   │   ├── models/          # Modelos SQLAlchemy
│   │   ├── schemas/         # Schemas Pydantic (request/response)
│   │   ├── services/        # mock_*_service.py
│   │   └── tasks/           # celery_app.py
│   └── alembic/             # Migraciones de BD
├── frontend/
│   └── src/
│       ├── app/             # store.ts, router.tsx
│       ├── features/
│       │   ├── chat/        # ChatWindow, MessageBubble, ToolCallBadge
│       │   ├── pdf-extractor/   # PdfPage, EntityCard, EntityTable
│       │   └── dashboard/   # DashboardPage, ChartSelector, DynamicChart
│       └── shared/
│           ├── components/  # Layout, Sidebar, LoadingOverlay
│           ├── mocks/       # Datos de referencia (no usados por la UI directamente)
│           └── types/       # Tipos TypeScript compartidos
└── docker-compose.yml
```

---

## API

Todos los endpoints bajo `/api/v1`. Con `USE_MOCKS=true` los datos son simulados con latencia realista.

```
POST /api/v1/chat/message              # Envía mensaje al agente
GET  /api/v1/chat/sessions/{id}        # Recupera historial de sesión

POST /api/v1/pdf/extract               # Sube PDF y extrae entidades
GET  /api/v1/pdf/{job_id}              # Consulta estado de extracción

POST /api/v1/dashboard/parse           # Sube CSV e infiere columnas
GET  /api/v1/dashboard/datasets/{id}   # Recupera dataset persistido
```

---

## Herramientas del agente (fase 2)

El chatbot dispone de cuatro herramientas que se mostrarán como badges desplegables en la interfaz:

| Herramienta | Descripción |
|-------------|-------------|
| `weather_search` | Consulta el tiempo atmosférico |
| `web_search` | Búsqueda general en internet |
| `travel_search` | Vuelos, hoteles y experiencias |
| `faq_vector_search` | FAQs de monumentos desde ChromaDB |

---

## Roadmap

- **Fase 1 (actual):** Mock-first — interfaces completas con datos simulados
- **Fase 2:** Agente real (LangGraph/LlamaIndex), extracción PDF con LLM, Celery async, ChromaDB embeddings
- **Fase 3:** Authentik (OIDC), Traefik (TLS), NGINX (load balancer), migraciones Alembic iniciales
- **Fase 4:** Tests (Vitest + pytest), OpenTelemetry, logging estructurado
