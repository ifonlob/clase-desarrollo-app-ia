import asyncio
import uuid

from app.core.config import settings
from app.schemas.dashboard import ColumnType, CsvColumnSchema, CsvDatasetResponse

_MOCK_COLUMNS = [
    CsvColumnSchema(
        name="ciudad",
        type=ColumnType.categorical,
        sample_values=["Madrid", "Barcelona", "Sevilla", "Valencia", "Granada"],
    ),
    CsvColumnSchema(
        name="mes",
        type=ColumnType.categorical,
        sample_values=["enero", "febrero", "marzo", "abril", "mayo"],
    ),
    CsvColumnSchema(
        name="visitantes",
        type=ColumnType.numeric,
        sample_values=["125000", "98500", "67300", "145200", "89000"],
    ),
    CsvColumnSchema(
        name="valoracion_media",
        type=ColumnType.numeric,
        sample_values=["4.2", "4.5", "3.9", "4.7", "4.1"],
    ),
    CsvColumnSchema(
        name="tipo_turismo",
        type=ColumnType.categorical,
        sample_values=["cultural", "playa", "rural", "gastronómico", "cultural"],
    ),
]

_DATASETS: dict[str, CsvDatasetResponse] = {}


async def parse_csv(filename: str) -> CsvDatasetResponse:
    if not settings.USE_MOCKS:
        raise NotImplementedError("Real CSV parsing not implemented yet")

    await asyncio.sleep(0.3)

    dataset = CsvDatasetResponse(
        dataset_id=str(uuid.uuid4()),
        filename=filename,
        row_count=120,
        columns=_MOCK_COLUMNS,
    )
    _DATASETS[dataset.dataset_id] = dataset
    return dataset


async def get_dataset(dataset_id: str) -> CsvDatasetResponse | None:
    if not settings.USE_MOCKS:
        raise NotImplementedError("Real dataset retrieval not implemented yet")

    await asyncio.sleep(0.1)
    return _DATASETS.get(dataset_id)
