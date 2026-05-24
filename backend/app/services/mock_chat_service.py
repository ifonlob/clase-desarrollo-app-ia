import asyncio
import random
import uuid
from datetime import datetime, timezone

from app.core.config import settings
from app.schemas.chat import (
    ChatMessageRequest,
    ChatMessageResponse,
    ChatMessageResponseWrapper,
    ChatSessionResponse,
    ToolCallSchema,
)

_SESSIONS: dict[str, list[dict]] = {}

_MOCK_RESPONSES = [
    {
        "content": (
            "He consultado el tiempo para Madrid. Cielo despejado con 22°C y humedad del 45%. "
            "Las temperaturas se mantendrán agradables toda la semana, perfectas para explorar "
            "la ciudad."
        ),
        "tool_calls": [
            ToolCallSchema(
                tool_name="weather_search",
                input="tiempo Madrid hoy",
                output='{"city":"Madrid","temp_c":22,"condition":"soleado","humidity":45,"wind_kmh":12}',
                duration_ms=342,
            )
        ],
    },
    {
        "content": (
            "He realizado una búsqueda sobre las mejores rutas de senderismo en los Pirineos. "
            "Las rutas más valoradas son el GR-11 (alta dificultad, 820 km), el Camino de Santiago "
            "por Roncesvalles y la Vuelta al Aneto (circular, 3 días). Te recomiendo revisar los "
            "refugios disponibles antes de planificar."
        ),
        "tool_calls": [
            ToolCallSchema(
                tool_name="web_search",
                input="mejores rutas senderismo Pirineos",
                output=(
                    "GR-11 (820 km, alta), Camino de Santiago por Roncesvalles, "
                    "Vuelta al Aneto (circular, 3 días). Fuentes: senderos.es, pirineosdigital.com"
                ),
                duration_ms=521,
            )
        ],
    },
    {
        "content": (
            "He buscado vuelos y alojamiento para Roma en junio. Los vuelos más baratos salen "
            "martes y miércoles desde 89€ ida con Vueling. En hoteles encontré opciones céntricas "
            "desde 85€/noche en Trastevere."
        ),
        "tool_calls": [
            ToolCallSchema(
                tool_name="travel_search",
                input="vuelos y hoteles Madrid-Roma junio",
                output=(
                    '{"flights":[{"airline":"Vueling","price_eur":89}],'
                    '"hotels":[{"name":"Hotel Trastevere","stars":3,"price_eur":85,"rating":8.4}]}'
                ),
                duration_ms=687,
            )
        ],
    },
    {
        "content": (
            "Según nuestra base de datos, la Alhambra es el monumento más visitado de España con "
            "más de 2,5 millones de visitantes anuales. Se recomienda reservar entradas con al "
            "menos 2 semanas de antelación, especialmente en verano. El recinto incluye los "
            "Palacios Nazaríes, el Generalife y la Alcazaba. Entradas: 14€ (general)."
        ),
        "tool_calls": [
            ToolCallSchema(
                tool_name="faq_vector_search",
                input="información Alhambra Granada visita",
                output=(
                    '[{"score":0.94,"text":"La Alhambra recibe >2.5M visitantes/año. '
                    'Entradas: 14€. Reserva anticipada obligatoria."},'
                    '{"score":0.89,"text":"Palacios Nazaríes: 30 min por grupo. '
                    'Generalife: jardines abiertos todo el día."}]'
                ),
                duration_ms=198,
            )
        ],
    },
    {
        "content": (
            "¡Hola! Soy tu asistente de viajes. Puedo ayudarte a planificar tu próximo viaje: "
            "busco vuelos y hoteles, consulto el tiempo, te informo sobre monumentos y destinos "
            "turísticos, y realizo búsquedas en internet. ¿Qué destino tienes en mente?"
        ),
        "tool_calls": [],
    },
    {
        "content": (
            "Barcelona es una ciudad imprescindible. El Barrio Gótico, la Sagrada Família, el "
            "Parque Güell y Gràcia son paradas obligadas. Gastronómicamente destacan el pan con "
            "tomate, los buñuelos de bacallà y los fideos a la cazuela. ¿Necesitas información "
            "sobre alojamiento o transporte?"
        ),
        "tool_calls": [],
    },
    {
        "content": (
            "He consultado el tiempo en Mallorca para los próximos 7 días. Las temperaturas "
            "oscilarán entre 26°C y 32°C con cielos despejados y viento moderado del noreste. "
            "Mar en calma, ideal para actividades náuticas. El miércoles se esperan tormentas "
            "ocasionales por la tarde."
        ),
        "tool_calls": [
            ToolCallSchema(
                tool_name="weather_search",
                input="tiempo Mallorca próximos 7 días",
                output=(
                    '{"city":"Palma de Mallorca","week":[{"day":"lun","max":32,"min":26,"cond":'
                    '"soleado"},{"day":"mié","max":24,"min":20,"cond":"tormentas"}]}'
                ),
                duration_ms=289,
            )
        ],
    },
    {
        "content": (
            "He encontrado información sobre el Camino de Santiago. La ruta Francesa "
            "(790 km desde Saint-Jean-Pied-de-Port) es la más popular y tarda aproximadamente "
            "30 días a pie. La mejor época es mayo-junio y septiembre-octubre. Alojamiento en "
            "albergues de peregrinos desde 10€/noche."
        ),
        "tool_calls": [
            ToolCallSchema(
                tool_name="web_search",
                input="Camino de Santiago ruta francesa duración alojamiento",
                output=(
                    "Ruta Francesa: 790 km, ~30 días. Época recomendada: may-jun, sep-oct. "
                    "Albergues: 10-20€/noche. Fuentes: caminodesantiago.gal, gronze.com"
                ),
                duration_ms=445,
            )
        ],
    },
]


async def process_message(request: ChatMessageRequest) -> ChatMessageResponseWrapper:
    if not settings.USE_MOCKS:
        raise NotImplementedError("Real agent not implemented yet")

    await asyncio.sleep(0.8)

    session_id = request.session_id or str(uuid.uuid4())
    mock = random.choice(_MOCK_RESPONSES)

    message = ChatMessageResponse(
        id=str(uuid.uuid4()),
        role="assistant",
        content=str(mock["content"]),
        tool_calls=mock["tool_calls"],
        created_at=datetime.now(timezone.utc),
    )

    if session_id not in _SESSIONS:
        _SESSIONS[session_id] = []
    _SESSIONS[session_id].append(message.model_dump(mode="json"))

    return ChatMessageResponseWrapper(session_id=session_id, message=message)


async def get_session_mock(session_id: str) -> ChatSessionResponse:
    if not settings.USE_MOCKS:
        raise NotImplementedError("Real session retrieval not implemented yet")

    messages_data = _SESSIONS.get(session_id, [])
    return ChatSessionResponse(
        id=session_id,
        messages=[ChatMessageResponse(**m) for m in messages_data],
        created_at=datetime.now(timezone.utc),
    )
