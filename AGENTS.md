# AGENTS.md

Guía de referencia para agentes de IA (Cursor, Copilot, Claude Code, etc.) que trabajen en este repositorio.
**Lee este fichero completo antes de tocar cualquier fichero del repositorio.**

---

## Tabla de contenidos

1. [Descripción del proyecto](#1-descripción-del-proyecto)
2. [Stack tecnológico](#2-stack-tecnológico)
3. [Estructura de ficheros](#3-estructura-de-ficheros)
4. [Fase actual: Mock-first](#4-fase-actual-mock-first)
5. [Módulo Chat](#5-módulo-chat)
6. [Módulo PDF Extractor](#6-módulo-pdf-extractor)
7. [Módulo Dashboard CSV](#7-módulo-dashboard-csv)
8. [Shared Components](#8-shared-components)
9. [Backend — estructura y convenciones](#9-backend--estructura-y-convenciones)
10. [Infraestructura y servicios](#10-infraestructura-y-servicios)
11. [Contratos de API](#11-contratos-de-api)
12. [Tipos compartidos frontend ↔ backend](#12-tipos-compartidos-frontend--backend)
13. [Convenciones de código](#13-convenciones-de-código)
14. [Flujos de trabajo por módulo](#14-flujos-de-trabajo-por-módulo)
15. [Decisiones de arquitectura](#15-decisiones-de-arquitectura)
16. [Roadmap de fases futuras](#16-roadmap-de-fases-futuras)

---

## 1. Descripción del proyecto

Plataforma web de asistencia turística con tres módulos completamente independientes entre sí:

| Módulo | Ruta | Descripción |
|---|---|---|
| **ChatBot Agente** | `/chat` | Chatbot conversacional respaldado por un agente capaz de consultar el tiempo atmosférico, realizar búsquedas en internet, consultar webs de viajes y recuperar FAQs de monumentos y destinos turísticos desde una base de datos vectorial (ChromaDB). |
| **Extractor PDF** | `/pdf` | El usuario sube un PDF y el sistema extrae entidades nombradas (lugares, monumentos, personas, fechas, organizaciones, eventos) mediante un LLM. |
| **Dashboard CSV** | `/dashboard` | El usuario sube un CSV y configura gráficas dinámicas e interactivas a partir de los datos. |

---

## 2. Stack tecnológico

### Frontend

| Herramienta | Rol |
|---|---|
| **pnpm** | Gestor de paquetes |
| **Vite** | Bundler y servidor de desarrollo |
| **React 18** | Framework de UI |
| **PrimeReact** | Biblioteca de componentes (DataTable, Charts, FileUpload, Dialog…) |
| **TailwindCSS** | Utilidades CSS, complementa el tema de PrimeReact |
| **Redux Toolkit** | Estado global de UI (no del servidor) |
| **TanStack Query v5** | Fetching, caché y sincronización de datos asíncronos |
| **TanStack Router** | Enrutamiento con tipado estático |
| **TypeScript** | Strict mode habilitado, sin `any` implícito |
| **PapaParse** | Parsing de CSV en el cliente |

### Backend

| Herramienta | Rol |
|---|---|
| **uv** | Gestión de entornos virtuales y dependencias Python |
| **FastAPI** | Framework HTTP asíncrono |
| **Pydantic v2** | Validación y serialización de datos |
| **SQLAlchemy 2 (async)** | ORM + acceso a base de datos |
| **Alembic** | Migraciones de esquema de BD |
| **Celery 5** | Cola de tareas asíncronas |
| **Valkey 9** | Broker y backend de Celery (sustituye a Redis completamente) |

### Bases de datos

| Sistema | Uso | Puerto por defecto |
|---|---|---|
| **PostgreSQL 16** | Persistencia relacional (historial de chats, extracciones PDF) | `5432` |
| **Valkey 9** | Caché L2, sesiones, rate-limiting y broker/backend de Celery | `6379` |
| **ChromaDB** | Base de datos vectorial para FAQs turísticas | `8000` |

### Infraestructura

| Sistema | Rol |
|---|---|
| **Authentik** | Identity Provider (OIDC/OAuth2), gestión de usuarios |
| **Traefik** | Reverse proxy, TLS automático vía Let's Encrypt |
| **NGINX** | API Gateway y load balancer interno entre réplicas de FastAPI |

---

## 3. Estructura de ficheros

```
.
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── store.ts               # Redux store central
│   │   │   └── router.tsx             # TanStack Router — rutas /chat, /pdf, /dashboard
│   │   ├── features/
│   │   │   ├── chat/
│   │   │   │   ├── components/
│   │   │   │   │   ├── ChatWindow.tsx       # Contenedor principal del chat
│   │   │   │   │   ├── MessageBubble.tsx    # Burbuja de mensaje (user/assistant)
│   │   │   │   │   └── ToolCallBadge.tsx    # Badge que muestra herramienta usada por el agente
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useChat.ts           # Lógica de envío/recepción de mensajes
│   │   │   │   ├── store/
│   │   │   │   │   └── chatSlice.ts         # Slice Redux del chat
│   │   │   │   └── api/
│   │   │   │       └── chatApi.ts           # Llama al backend (mockeado en fase 1)
│   │   │   ├── pdf-extractor/
│   │   │   │   ├── components/
│   │   │   │   │   ├── PdfUploader.tsx      # Drag & drop de PDF
│   │   │   │   │   ├── EntityCard.tsx       # Tarjeta por entidad extraída
│   │   │   │   │   └── EntityTable.tsx      # Tabla resumen de entidades
│   │   │   │   ├── hooks/
│   │   │   │   │   └── usePdfExtraction.ts
│   │   │   │   ├── store/
│   │   │   │   │   └── pdfSlice.ts
│   │   │   │   └── api/
│   │   │   │       └── pdfApi.ts
│   │   │   └── dashboard/
│   │   │       ├── components/
│   │   │       │   ├── CsvUploader.tsx      # Drag & drop de CSV
│   │   │       │   ├── ChartSelector.tsx    # Configurador de tipo de gráfica y ejes
│   │   │       │   ├── DynamicChart.tsx     # Renderiza la gráfica (PrimeReact Charts)
│   │   │       │   └── DataPreviewTable.tsx # Vista previa tabular del CSV
│   │   │       ├── hooks/
│   │   │       │   └── useCsvParse.ts       # Parsing local del CSV con PapaParse
│   │   │       ├── store/
│   │   │       │   └── dashboardSlice.ts
│   │   │       └── api/
│   │   │           └── dashboardApi.ts
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── Layout.tsx           # Shell con sidebar y área de contenido
│   │   │   │   ├── Sidebar.tsx          # Navegación lateral entre módulos
│   │   │   │   └── LoadingOverlay.tsx   # Spinner global con backdrop
│   │   │   ├── mocks/                   # ← DATOS MOCKEADOS (fase actual)
│   │   │   │   ├── chatMocks.ts
│   │   │   │   ├── pdfMocks.ts
│   │   │   │   └── dashboardMocks.ts
│   │   │   └── types/
│   │   │       ├── chat.types.ts
│   │   │       ├── pdf.types.ts
│   │   │       └── dashboard.types.ts
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── main.py                    # FastAPI app factory + CORS + lifespan
│   │   ├── core/
│   │   │   ├── config.py              # pydantic-settings, lee variables de .env
│   │   │   └── database.py            # AsyncEngine SQLAlchemy + get_session (dependency)
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── router.py          # APIRouter raíz que incluye los sub-routers
│   │   │       ├── chat.py            # Endpoints /chat/*
│   │   │       ├── pdf.py             # Endpoints /pdf/*
│   │   │       └── dashboard.py       # Endpoints /dashboard/*
│   │   ├── agents/                    # ← PENDIENTE (stubs vacíos)
│   │   │   ├── __init__.py
│   │   │   └── travel_agent.py        # Stub — eleva NotImplementedError
│   │   ├── services/
│   │   │   ├── mock_chat_service.py   # Simula respuestas del agente con tool calls
│   │   │   ├── mock_pdf_service.py    # Simula extracción de entidades
│   │   │   └── mock_dashboard_service.py  # Simula parsing de CSV
│   │   ├── tasks/
│   │   │   ├── __init__.py
│   │   │   └── celery_app.py          # Configuración de Celery + broker Valkey
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── chat.py                # ChatSession, ChatMessage (SQLAlchemy)
│   │   │   └── pdf_extraction.py      # PdfJob, ExtractedEntity (SQLAlchemy)
│   │   └── schemas/
│   │       ├── chat.py                # Pydantic schemas de request y response del chat
│   │       ├── pdf.py                 # Pydantic schemas de request y response de PDF
│   │       └── dashboard.py           # Pydantic schemas de request y response del dashboard
│   ├── pyproject.toml
│   └── alembic/
│       └── versions/
│
├── docker-compose.yml
├── .env.example
└── AGENTS.md
```

---

## 4. Fase actual: Mock-first

### Reglas críticas para esta fase

- **No implementar** integraciones reales con APIs externas (clima, búsqueda web, scraping, LLMs).
- **No conectar** la aplicación a ChromaDB, PostgreSQL ni Valkey desde el código de negocio — solo arrancarlos vía `docker-compose.yml`.
- **No implementar** lógica de agente real en `agents/travel_agent.py`; debe permanecer como stub que eleva `NotImplementedError`.
- **Sí implementar** todas las interfaces de usuario, tipos TypeScript y contratos de API (schemas Pydantic) completos y definitivos.
- **Sí implementar** todos los endpoints FastAPI, delegando a los servicios `mock_*_service.py`.
- Los mocks deben ser **realistas y variados**: al menos 5 respuestas distintas por módulo, no un único objeto repetido.
- Los servicios mock deben simular latencia con un pequeño delay asíncrono.

### Flag de mock

`backend/app/core/config.py` expone el flag `USE_MOCKS: bool`, controlado por la variable de entorno `USE_MOCKS`. Cuando vale `True`, los routers delegan en los servicios `mock_*`. Cuando vale `False`, deben delegar en la implementación real (que en esta fase todavía no existe, por lo que se eleva `NotImplementedError`).

### Principio de sustitución

Los ficheros `*Api.ts` del frontend **siempre** llaman a las URLs del backend (`/api/v1/...`). Nunca importan los mocks directamente. El backend es quien sirve los datos mockeados. Esto garantiza que, cuando se implemente la lógica real, el frontend no necesite cambios.

---

## 5. Módulo Chat

### Responsabilidad

Interfaz de conversación con un agente de viajes. El agente puede invocar cuatro herramientas:

| Herramienta | Descripción | Icono / Color |
|---|---|---|
| `weather_search` | Consulta el tiempo atmosférico en una ciudad | ☁️ azul |
| `web_search` | Búsqueda general en internet | 🔍 gris |
| `travel_search` | Consulta webs de viajes (vuelos, hoteles, experiencias) | ✈️ verde |
| `faq_vector_search` | Recupera FAQs de monumentos y destinos desde ChromaDB | 🏛️ ámbar |

### Tipos (`chat.types.ts`)

- `MessageRole`: unión de `'user'`, `'assistant'` y `'system'`.
- `ToolName`: unión de los cuatro identificadores de herramienta listados arriba.
- `ToolCall`: registra la herramienta invocada, su input, su output en texto y la duración en milisegundos.
- `ChatMessage`: id, role, content, lista opcional de `ToolCall` (solo en mensajes del asistente) y timestamp ISO 8601.
- `ChatSession`: id, lista de mensajes y timestamp de creación.

### Estado Redux (`chatSlice.ts`)

El slice gestiona: el id de la sesión activa (o null si no hay sesión), la lista de mensajes de esa sesión, un flag booleano de streaming en curso y el error actual si lo hay.

Acciones: `setSessionId`, `addMessage`, `setStreaming`, `setError`, `clearChat`.

### API frontend (`chatApi.ts`)

Expone una única función de mutación que hace `POST /api/v1/chat/message` con el id de sesión (o null para sesión nueva) y el contenido del mensaje del usuario. Devuelve el `ChatMessage` del asistente junto con el `session_id` asignado.

### Mocks de referencia (`chatMocks.ts`)

Debe incluir al menos un mensaje de respuesta para cada caso:
- Consulta del tiempo → activa `weather_search`
- Búsqueda general → activa `web_search`
- Consulta de hoteles o vuelos → activa `travel_search`
- Pregunta sobre un monumento → activa `faq_vector_search`
- Conversación general → sin tool calls

### Componentes

**`ChatWindow.tsx`**: contenedor principal. Renderiza la lista de mensajes con scroll automático al último. Input de texto en la parte inferior con botón de envío. Muestra un indicador animado de "escribiendo…" mientras espera la respuesta. Integra TanStack Query mutation para el envío.

**`MessageBubble.tsx`**: recibe un `ChatMessage`. Las burbujas de usuario y asistente son visualmente distintas. Si el mensaje tiene `toolCalls`, renderiza un `ToolCallBadge` por cada uno, ordenados cronológicamente.

**`ToolCallBadge.tsx`**: chip colapsable que muestra el icono y nombre de la herramienta y la duración en ms. Al expandirlo, muestra el input y output de la llamada. El color del badge varía según `ToolName`.

### Hook (`useChat.ts`)

Encapsula: leer el estado del slice, gestionar el `session_id`, llamar a `chatApi`, hacer dispatch de `addMessage` para el mensaje del usuario y para la respuesta del asistente, y gestionar estados de loading y error.

---

## 6. Módulo PDF Extractor

### Responsabilidad

El usuario sube un PDF; el backend extrae entidades nombradas y las devuelve. En fase mock, la respuesta es inmediata con datos simulados. En producción, será una tarea Celery asíncrona con polling de estado.

### Tipos de entidad

`LOCATION`, `MONUMENT`, `PERSON`, `DATE`, `ORGANIZATION`, `EVENT`.

### Tipos (`pdf.types.ts`)

- `EntityType`: unión de los seis tipos anteriores.
- `ExtractedEntity`: id, type, value (texto de la entidad), context (fragmento del documento donde aparece), confidence (0.0–1.0) y pageNumber.
- `ExtractionStatus`: unión de `'idle'`, `'uploading'`, `'processing'`, `'done'`, `'error'`.
- `PdfExtractionJob`: jobId, filename, status, lista de entidades, pageCount y processedAt.

### Estado Redux (`pdfSlice.ts`)

Gestiona: el job actual (`PdfExtractionJob | null`), el status de la extracción, el filtro de tipo de entidad activo (`EntityType | 'ALL'`) y el error si lo hay.

### API frontend (`pdfApi.ts`)

Dos funciones:
- `POST /api/v1/pdf/extract` con el fichero como `multipart/form-data`. Devuelve un `job_id`.
- `GET /api/v1/pdf/{job_id}` para consultar el estado y resultado del job.

### Mocks de referencia (`pdfMocks.ts`)

Simular un PDF turístico sobre Granada con al menos 15 entidades distribuidas entre todos los `EntityType`. Incluir variedad de `confidence` (entre 0.6 y 0.99) para que el color semafórico sea visible.

### Componentes

**`PdfUploader.tsx`**: zona de drag & drop o click para seleccionar fichero. Solo acepta `.pdf`, máximo 10 MB. Muestra nombre y tamaño del fichero seleccionado. Botón "Extraer entidades" que dispara la mutation. Muestra barra de progreso indeterminada mientras procesa.

**`EntityCard.tsx`**: recibe una `ExtractedEntity`. Muestra badge de tipo (con color distintivo por `EntityType`), el valor principal, el contexto truncado y un indicador de confianza con semáforo de color (verde > 0.85, ámbar > 0.6, rojo ≤ 0.6).

**`EntityTable.tsx`**: DataTable de PrimeReact con todas las entidades. Columnas: Tipo, Valor, Página, Confianza. Filtros por `EntityType` y búsqueda libre por texto. Permite exportar a CSV desde el lado cliente.

### Hook (`usePdfExtraction.ts`)

Encapsula: estado de upload, llamada a `pdfApi.extractEntities`, polling a `pdfApi.getJob` mientras `status !== 'done'` (en producción), dispatch al slice, y gestión de errores.

---

## 7. Módulo Dashboard CSV

### Responsabilidad

El usuario sube un CSV; el sistema infiere las columnas, muestra una preview tabular y permite configurar y renderizar múltiples gráficas. El parsing ocurre en el cliente con PapaParse. El backend solo registra metadatos del dataset para persistencia opcional.

### Tipos de columna

`numeric`, `categorical`, `date`.

### Tipos de gráfica

`bar`, `line`, `pie`, `scatter`, `area`.

### Tipos (`dashboard.types.ts`)

- `CsvColumn`: nombre, tipo inferido y los primeros 5 valores de muestra.
- `CsvDataset`: id, filename, rowCount, lista de columnas y los datos crudos (máximo 1000 filas en el cliente).
- `ChartConfig`: tipo de gráfica, columna del eje X, columna del eje Y, columna de agrupación opcional y título.

### Estado Redux (`dashboardSlice.ts`)

Gestiona: el dataset cargado (`CsvDataset | null`), la configuración de gráfica activa (`ChartConfig | null`), el estado de carga y el error si lo hay.

### API frontend (`dashboardApi.ts`)

Dos funciones:
- `POST /api/v1/dashboard/parse` con el CSV como `multipart/form-data`. Devuelve metadatos del dataset (columnas inferidas y row count).
- `GET /api/v1/dashboard/datasets/{dataset_id}` para recuperar un dataset persistido.

### Mocks de referencia (`dashboardMocks.ts`)

Dataset de turismo español con columnas: `ciudad` (categorical, 10 ciudades), `mes` (categorical, enero–diciembre), `visitantes` (numeric), `valoracion_media` (numeric, escala 1–5), `tipo_turismo` (categorical: cultural, playa, rural, gastronómico).

### Componentes

**`CsvUploader.tsx`**: análogo a `PdfUploader`. Solo acepta `.csv` y `.tsv`, máximo 50 MB. Tras la carga, muestra resumen de filas y columnas detectadas.

**`ChartSelector.tsx`**: formulario con selector visual de tipo de gráfica (iconos para cada `ChartType`), dropdowns de eje X, eje Y y agrupación (opciones dinámicas desde las columnas del dataset), y campo de título. Botón "Generar gráfica".

**`DynamicChart.tsx`**: renderiza la gráfica usando PrimeReact Charts (wrapper de Chart.js). Soporta los 5 tipos de `ChartType`. Botón de descarga como PNG. Responsive: ocupa el ancho del contenedor.

**`DataPreviewTable.tsx`**: DataTable de PrimeReact con las primeras 50 filas del CSV. Columnas virtualizadas para datasets grandes. Paginación en el cliente.

### Hook (`useCsvParse.ts`)

Parsea el fichero con PapaParse antes de enviarlo al backend para mostrar una preview inmediata. Infiere el tipo de cada columna analizando los valores (numérico, fecha o categórico).

---

## 8. Shared Components

### `Layout.tsx`

Shell principal con `Sidebar` a la izquierda y el contenido del módulo activo a la derecha (vía `<Outlet />`). Incluye header con logo, nombre del módulo activo y avatar de usuario (mockeado en fase 1). El sidebar es colapsable en pantallas menores de 768px.

### `Sidebar.tsx`

Navegación con tres entradas usando TanStack Router `<Link>`:
- 💬 Chat Agente → `/chat`
- 📄 Extractor PDF → `/pdf`
- 📊 Dashboard CSV → `/dashboard`

Indica la ruta activa visualmente (resaltado de ítem).

### `LoadingOverlay.tsx`

Overlay semitransparente con spinner de PrimeReact, centrado en el contenedor padre. Controlado por prop `isLoading: boolean` y prop opcional `message: string`.

---

## 9. Backend — estructura y convenciones

### `app/core/config.py`

Usa `pydantic-settings` para leer todas las variables de entorno desde `.env`. Variables principales: `APP_NAME`, `DEBUG`, `USE_MOCKS`, `DATABASE_URL`, `REDIS_URL` (Valkey), `CELERY_BROKER_URL`, `CELERY_RESULT_BACKEND`, `CHROMA_HOST`, `CHROMA_PORT`, `AUTHENTIK_URL`, `AUTHENTIK_CLIENT_ID`, `AUTHENTIK_CLIENT_SECRET`. Nunca hardcodear valores; siempre leer desde `settings`.

### `app/core/database.py`

Configura `AsyncEngine` de SQLAlchemy con la `DATABASE_URL` de settings. Expone `get_session` como dependency de FastAPI (usando `yield`). La `Base` declarativa la comparten todos los modelos.

### `app/api/v1/router.py`

Incluye los tres sub-routers (`chat`, `pdf`, `dashboard`) con sus prefijos y tags correspondientes. Prefijo global de la aplicación: `/api/v1`.

### `app/agents/travel_agent.py`

Stub. Su función principal (`run`) recibe el payload de chat y eleva `NotImplementedError` con un mensaje claro. Este fichero no debe tener lógica real en esta fase.

### `app/services/mock_*_service.py`

Cada servicio mock implementa la misma firma que el servicio real tendrá en el futuro. Devuelve datos estáticos variados y simula latencia con un delay asíncrono. Si `USE_MOCKS=False`, eleva `NotImplementedError`.

### `app/tasks/celery_app.py`

Configura la instancia de Celery con broker y backend apuntando a Valkey (puerto 6379, bases de datos 1 y 2 respectivamente). Valkey es compatible con la API de Redis, por lo que no se requiere ningún cambio en el cliente Celery más allá de la URL de conexión. En esta fase, las tareas son stubs sin lógica real.

### `app/models/`

- `chat.py`: modelos `ChatSession` (id, created_at, relación con mensajes) y `ChatMessage` (id, session_id FK, role, content, tool_calls serializado como JSON, created_at).
- `pdf_extraction.py`: modelos `PdfJob` (id, filename, status, created_at) y `ExtractedEntity` (id, job_id FK, type, value, context, confidence, page_number).

### `app/schemas/`

Separar siempre schemas de entrada (`*Request`) de schemas de salida (`*Response`). Los nombres deben corresponderse con los tipos TypeScript del frontend (ver sección 12).

---

## 10. Infraestructura y servicios

### `docker-compose.yml`

Debe levantar los siguientes servicios para el entorno de desarrollo local:

| Servicio | Imagen recomendada | Puerto expuesto |
|---|---|---|
| `postgres` | `postgres:16-alpine` | `5432` |
| `valkey` | `valkey/valkey:9-alpine` | `6379` |
| `chromadb` | `chromadb/chroma:latest` | `8000` |

Valkey actúa como sustituto completo de Redis: sirve tanto de caché L2/sesiones (base de datos 0) como de broker y backend de Celery (bases de datos 1 y 2). No se levanta ningún contenedor Redis adicional.

Traefik, NGINX y Authentik se configuran en una fase posterior de infraestructura y no son necesarios para el entorno de desarrollo.

### `.env.example`

Debe incluir todas las variables listadas en `config.py` con valores de desarrollo seguros. Las variables sensibles deben tener el valor `changeme` o estar vacías con comentario indicativo. Las URLs de Valkey siguen el esquema `redis://` (Valkey es compatible con el protocolo Redis): base de datos 0 para caché, base de datos 1 para broker de Celery y base de datos 2 para el backend de resultados de Celery. Incluir también las variables de prefijo `VITE_` para el frontend.

### Comandos de desarrollo

**Frontend:**
- `pnpm install` para instalar dependencias.
- `pnpm dev` para el servidor de desarrollo de Vite en el puerto 5173.
- `pnpm build` para el build de producción.
- `pnpm type-check` para verificar tipos sin emitir.
- `pnpm lint` para ESLint.

**Backend:**
- `uv sync` para instalar dependencias de `pyproject.toml`.
- `uv run uvicorn app.main:app --reload --port 8080` para el servidor de desarrollo.
- `uv run celery -A app.tasks.celery_app worker --loglevel=info` para el worker de Celery.
- `uv run alembic upgrade head` para aplicar migraciones.

**Infraestructura:**
- `docker compose up -d` para levantar todos los servicios.
- `docker compose down -v` para parar y limpiar volúmenes.

---

## 11. Contratos de API

Todos los endpoints comparten el prefijo `/api/v1`. Formato de datos: JSON, salvo los endpoints de subida de ficheros que usan `multipart/form-data`.

### Chat

| Método | Path | Descripción |
|---|---|---|
| `POST` | `/chat/message` | Envía un mensaje del usuario. Body: `session_id` (nullable) + `content`. Respuesta: `session_id` + `ChatMessage` del asistente con sus `tool_calls`. Latencia simulada ~800 ms. |
| `GET` | `/chat/sessions/{session_id}` | Recupera el historial de una sesión. |

### PDF

| Método | Path | Descripción |
|---|---|---|
| `POST` | `/pdf/extract` | Sube un PDF. Respuesta: `job_id` con `status: "done"` en mock (en producción será `"pending"`). |
| `GET` | `/pdf/{job_id}` | Consulta estado y resultado de un job de extracción. |

### Dashboard

| Método | Path | Descripción |
|---|---|---|
| `POST` | `/dashboard/parse` | Sube un CSV. Respuesta: `dataset_id`, columnas inferidas y row count. |
| `GET` | `/dashboard/datasets/{dataset_id}` | Recupera metadatos de un dataset. |

---

## 12. Tipos compartidos frontend ↔ backend

Los tipos TypeScript en `shared/types/` y los schemas Pydantic en `backend/app/schemas/` deben ser **estructuralmente equivalentes**. Si se modifica uno, hay que actualizar el otro en el mismo commit.

| TypeScript (`camelCase`) | Pydantic (`snake_case`) |
|---|---|
| `ChatMessage` | `ChatMessageResponse` |
| `ToolCall` | `ToolCallSchema` |
| `ChatSession` | `ChatSessionResponse` |
| `PdfExtractionJob` | `PdfJobResponse` |
| `ExtractedEntity` | `ExtractedEntitySchema` |
| `EntityType` | `EntityType` (Enum) |
| `CsvDataset` | `CsvDatasetResponse` |
| `CsvColumn` | `CsvColumnSchema` |
| `ChartConfig` | — (solo cliente) |

---

## 13. Convenciones de código

### Frontend

- TypeScript con `strict: true`. Sin `any` implícito. Sin `// @ts-ignore` sin justificación.
- Componentes funcionales con hooks. Sin class components.
- Exportaciones: `export default` solo para páginas/rutas. Todo lo demás, named exports.
- Estilos: TailwindCSS utility-first. Sin ficheros `.css` salvo excepciones documentadas.
- Nombrado: componentes en `PascalCase`, hooks en `camelCase` con prefijo `use`, slices con sufijo `Slice`, tipos con sufijo `.types.ts`.
- Estado del servidor: siempre TanStack Query. Redux solo para estado de UI (flags de loading, selecciones, modo oscuro).
- Imports: absolutos mediante alias `@/` → `src/`. Configurar en `vite.config.ts` y `tsconfig.json`.
- Nunca importar desde `features/` en `shared/` (dependencia unidireccional: `features → shared`, nunca al revés).

### Backend

- Python 3.12+. Type hints obligatorios en todas las funciones públicas.
- Todos los endpoints y métodos de servicio deben ser `async def`.
- Schemas Pydantic v2: separar siempre request de response.
- Rutas en snake_case (`/pdf/extract`, no `/pdf/Extract`).
- Errores: usar `HTTPException` con `detail` descriptivo. Nunca exponer stack traces en respuestas de producción.
- Variables de entorno: nunca hardcodear. Siempre desde `core/config.py`.
- Formatear con `ruff format` y lintear con `ruff check` antes de cada commit.
- Los servicios no importan nada de `api/`. Los routers no contienen lógica de negocio.

### Git

- Ramas: `feature/<módulo>/<descripción>`, `fix/<descripción>`, `chore/<descripción>`.
- Commits en español, en imperativo: `Añadir endpoint de carga de CSV`, `Corregir tipado de ToolCall`.
- Nunca commitear ficheros `.env`.

---

## 14. Flujos de trabajo por módulo

### Antes de generar código

1. Leer este fichero completo antes de empezar cualquier tarea.
2. Identificar el módulo afectado (chat / pdf / dashboard / shared / infra).
3. Verificar que `USE_MOCKS=true` si se está en la fase actual.
4. Comprobar si los tipos TypeScript o schemas Pydantic ya existen antes de crearlos.

### Al modificar un contrato de API

1. Actualizar el schema Pydantic en `schemas/`.
2. Actualizar el tipo TypeScript correspondiente en `shared/types/`.
3. Actualizar el mock en `shared/mocks/` y en `services/mock_*_service.py`.
4. Actualizar la función de API en `features/<módulo>/api/`.

### Al añadir un componente UI

1. Crearlo en `features/<módulo>/components/`.
2. Exportarlo con named export.
3. Tipar todas las props explícitamente.
4. Usar TanStack Query para estado del servidor; Redux solo para estado de UI.

### Chat — flujo de datos

El usuario escribe un mensaje → `ChatWindow` llama a `useChat.sendMessage` → `chatApi` hace `POST /api/v1/chat/message` → el router de FastAPI delega en `mock_chat_service` → el servicio espera y devuelve una respuesta aleatoria del pool de mocks → el frontend hace dispatch de ambos mensajes (usuario y asistente) al slice → `ChatWindow` re-renderiza con los nuevos `MessageBubble`, cada uno con sus `ToolCallBadge` si procede.

### PDF — flujo de datos

El usuario arrastra un PDF → `PdfUploader` llama a `usePdfExtraction.upload` → `pdfApi` hace `POST /api/v1/pdf/extract` → el router delega en `mock_pdf_service` → el servicio espera y devuelve las entidades mock con `status: done` → el frontend hace dispatch al slice → `EntityTable` y `EntityCard` se renderizan con las entidades. En producción, el POST devolverá `status: pending` y el frontend hará polling a `GET /pdf/{job_id}` hasta completar.

### Dashboard — flujo de datos

El usuario arrastra un CSV → `useCsvParse` lo parsea localmente con PapaParse (preview inmediata en `DataPreviewTable`) → botón "Procesar" llama a `dashboardApi.uploadCsv` → el router delega en `mock_dashboard_service` → el frontend hace dispatch del dataset al slice → `ChartSelector` permite configurar una `ChartConfig` → dispatch de `setChartConfig` → `DynamicChart` renderiza usando las filas del dataset y la configuración.

---

## 15. Decisiones de arquitectura

| Decisión | Alternativas descartadas | Motivo |
|---|---|---|
| TanStack Router | React Router v6 | Enrutamiento type-safe; integración nativa con TanStack Query |
| Redux Toolkit | Zustand, Jotai | Experiencia del equipo; DevTools; escalabilidad en proyectos grandes |
| PrimeReact + Tailwind | MUI, shadcn/ui | Componentes complejos listos (DataTable, Charts) con libertad de styling via Tailwind |
| FastAPI async | Django, Flask | Rendimiento; tipado nativo con Pydantic; OpenAPI automático |
| Celery + Redis broker | FastAPI BackgroundTasks, ARQ | Estándar del ecosistema; retry, monitoring, múltiples workers |
| Valkey para caché | Redis | Drop-in replacement; open source; misma API |
| ChromaDB | Qdrant, Weaviate, pgvector | Setup más simple en desarrollo; buena integración con LangChain/LlamaIndex |
| Authentik | Keycloak, Auth0 | Self-hosted; open source; admin UI moderno; OIDC y SAML |
| Traefik | NGINX como proxy externo | Autodiscovery de contenedores Docker; SSL automático vía Let's Encrypt |

---

## 16. Roadmap de fases futuras

Los elementos siguientes están **fuera del scope actual**. No implementar hasta que se indique explícitamente.

### Fase 2 — Agente real

- [ ] Implementar `agents/travel_agent.py` con framework de agentes (LangGraph, LlamaIndex u otro por decidir)
- [ ] Tool `weather_search`: integrar OpenWeatherMap API o similar
- [ ] Tool `web_search`: integrar Tavily, Brave Search o SerpAPI
- [ ] Tool `travel_search`: API o scraping de Booking, Skyscanner o similar
- [ ] Tool `faq_vector_search`: generación de embeddings + consultas de similaridad en ChromaDB
- [ ] Streaming de respuestas vía SSE en `/api/v1/chat/stream`
- [ ] Adaptar `useChat.ts` para consumir SSE con `fetchEventSource`

### Fase 2 — Extracción PDF real

- [ ] Extracción de texto del PDF con `pdfminer` o `pypdf`
- [ ] Llamada a LLM con prompt de NER estructurado para identificar entidades
- [ ] Lanzar extracción como tarea Celery asíncrona real
- [ ] Persistencia de jobs y entidades en PostgreSQL
- [ ] Activar polling real en `usePdfExtraction`

### Fase 2 — Dashboard real

- [ ] Persistencia de datasets en PostgreSQL
- [ ] Análisis estadístico automático de columnas en el backend

### Fase 3 — Infraestructura

- [ ] Configurar Authentik: application, provider OAuth2, scopes y middleware JWT en FastAPI
- [ ] Configurar Traefik: certificados TLS y routing por host/path
- [ ] Configurar NGINX como load balancer interno para réplicas de FastAPI
- [ ] Migraciones Alembic iniciales para los modelos de chat y pdf_extraction
- [ ] Pipeline CI/CD (GitHub Actions o GitLab CI)

### Fase 4 — Calidad y observabilidad

- [ ] Tests unitarios frontend con Vitest + Testing Library
- [ ] Tests de integración backend con pytest + httpx
- [ ] OpenTelemetry → Grafana / Prometheus
- [ ] Logging estructurado en JSON con `structlog`

---

*Generado en la fase mock-first del proyecto — v0.1.0*
