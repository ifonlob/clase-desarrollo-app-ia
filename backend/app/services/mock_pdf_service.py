import asyncio
import uuid
from datetime import datetime, timezone

from app.core.config import settings
from app.schemas.pdf import EntityType, ExtractedEntitySchema, PdfJobResponse

_GRANADA_ENTITIES: list[ExtractedEntitySchema] = [
    ExtractedEntitySchema(
        id="e01",
        type=EntityType.LOCATION,
        value="Granada",
        context=(
            "La ciudad de Granada, capital de la provincia homónima en Andalucía, es "
            "conocida mundialmente por su legado nazarí."
        ),
        confidence=0.98,
        page_number=1,
    ),
    ExtractedEntitySchema(
        id="e02",
        type=EntityType.MONUMENT,
        value="La Alhambra",
        context=(
            "La Alhambra es el conjunto monumental más visitado de España, con más de 2,5 "
            "millones de visitantes anuales."
        ),
        confidence=0.97,
        page_number=1,
    ),
    ExtractedEntitySchema(
        id="e03",
        type=EntityType.LOCATION,
        value="Sierra Nevada",
        context=(
            "La Sierra Nevada, situada al sureste de Granada, alberga el punto más alto de "
            "la Península Ibérica."
        ),
        confidence=0.95,
        page_number=2,
    ),
    ExtractedEntitySchema(
        id="e04",
        type=EntityType.MONUMENT,
        value="Catedral de Granada",
        context=(
            "La Catedral de Granada, construida sobre la antigua mezquita mayor, es un "
            "referente del Renacimiento español."
        ),
        confidence=0.93,
        page_number=2,
    ),
    ExtractedEntitySchema(
        id="e05",
        type=EntityType.PERSON,
        value="Carlos V",
        context=(
            "El emperador Carlos V ordenó la construcción de su palacio dentro del recinto "
            "de la Alhambra en el siglo XVI."
        ),
        confidence=0.91,
        page_number=3,
    ),
    ExtractedEntitySchema(
        id="e06",
        type=EntityType.PERSON,
        value="Isabel la Católica",
        context=(
            "Isabel la Católica eligió Granada como su lugar de descanso eterno; está "
            "enterrada en la Capilla Real junto a Fernando."
        ),
        confidence=0.96,
        page_number=3,
    ),
    ExtractedEntitySchema(
        id="e07",
        type=EntityType.DATE,
        value="1492",
        context=(
            "En 1492, los Reyes Católicos completaron la Reconquista con la toma de Granada, "
            "el último reino musulmán."
        ),
        confidence=0.99,
        page_number=4,
    ),
    ExtractedEntitySchema(
        id="e08",
        type=EntityType.EVENT,
        value="Reconquista",
        context=(
            "La Reconquista culminó en Granada con la rendición de Boabdil ante los Reyes "
            "Católicos el 2 de enero de 1492."
        ),
        confidence=0.97,
        page_number=4,
    ),
    ExtractedEntitySchema(
        id="e09",
        type=EntityType.LOCATION,
        value="Sacromonte",
        context=(
            "El barrio del Sacromonte, famoso por sus cuevas habitadas y el arte flamenco "
            "gitano, es uno de los más singulares de Granada."
        ),
        confidence=0.88,
        page_number=5,
    ),
    ExtractedEntitySchema(
        id="e10",
        type=EntityType.ORGANIZATION,
        value="Patronato de la Alhambra y el Generalife",
        context=(
            "El Patronato de la Alhambra y el Generalife gestiona el acceso y la "
            "conservación del conjunto monumental nazarí."
        ),
        confidence=0.92,
        page_number=5,
    ),
    ExtractedEntitySchema(
        id="e11",
        type=EntityType.MONUMENT,
        value="El Generalife",
        context=(
            "El Generalife, palacio de veraneo de los sultanes nazaríes, destaca por sus "
            "jardines con fuentes y cipreses."
        ),
        confidence=0.94,
        page_number=6,
    ),
    ExtractedEntitySchema(
        id="e12",
        type=EntityType.EVENT,
        value="Festival Internacional de Música y Danza de Granada",
        context=(
            "El Festival Internacional de Música y Danza de Granada se celebra cada "
            "junio-julio en los Palacios Nazaríes."
        ),
        confidence=0.86,
        page_number=7,
    ),
    ExtractedEntitySchema(
        id="e13",
        type=EntityType.DATE,
        value="siglo XIV",
        context=(
            "La mayor parte de los Palacios Nazaríes fue construida durante el siglo XIV, "
            "bajo los reinados de Yusuf I y Muhammad V."
        ),
        confidence=0.89,
        page_number=8,
    ),
    ExtractedEntitySchema(
        id="e14",
        type=EntityType.PERSON,
        value="Boabdil",
        context=(
            "Boabdil, último rey nazarí de Granada, entregó las llaves de la ciudad a los "
            "Reyes Católicos en 1492."
        ),
        confidence=0.94,
        page_number=8,
    ),
    ExtractedEntitySchema(
        id="e15",
        type=EntityType.LOCATION,
        value="Albaicín",
        context=(
            "El barrio del Albaicín, declarado Patrimonio de la Humanidad por la UNESCO, "
            "conserva el trazado de la medina medieval."
        ),
        confidence=0.96,
        page_number=9,
    ),
    ExtractedEntitySchema(
        id="e16",
        type=EntityType.ORGANIZATION,
        value="UNESCO",
        context=(
            "La UNESCO declaró la Alhambra, el Generalife y el Albaicín Patrimonio de la "
            "Humanidad en 1984 y 1994 respectivamente."
        ),
        confidence=0.98,
        page_number=9,
    ),
    ExtractedEntitySchema(
        id="e17",
        type=EntityType.MONUMENT,
        value="Capilla Real",
        context=(
            "La Capilla Real, construida entre 1505 y 1517, alberga los sepulcros de los "
            "Reyes Católicos y sus herederos."
        ),
        confidence=0.91,
        page_number=10,
    ),
    ExtractedEntitySchema(
        id="e18",
        type=EntityType.EVENT,
        value="Nochebuena Flamenca",
        context=(
            "La Nochebuena Flamenca es una de las celebraciones más emblemáticas del "
            "Sacromonte, con actuaciones en las cuevas."
        ),
        confidence=0.72,
        page_number=11,
    ),
]


async def extract_entities(filename: str) -> PdfJobResponse:
    if not settings.USE_MOCKS:
        raise NotImplementedError("Real PDF extraction not implemented yet")

    await asyncio.sleep(1.2)

    return PdfJobResponse(
        job_id=str(uuid.uuid4()),
        filename=filename,
        status="done",
        entities=_GRANADA_ENTITIES,
        page_count=12,
        processed_at=datetime.now(timezone.utc),
    )


async def get_job(job_id: str) -> PdfJobResponse:
    if not settings.USE_MOCKS:
        raise NotImplementedError("Real job retrieval not implemented yet")

    await asyncio.sleep(0.1)
    return PdfJobResponse(
        job_id=job_id,
        filename="granada_turismo.pdf",
        status="done",
        entities=_GRANADA_ENTITIES,
        page_count=12,
        processed_at=datetime.now(timezone.utc),
    )
