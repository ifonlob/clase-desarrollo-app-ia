from fastapi import APIRouter, File, HTTPException, UploadFile

from app.core.config import settings
from app.schemas.dashboard import CsvDatasetResponse

router = APIRouter()


@router.post("/parse", response_model=CsvDatasetResponse)
async def parse_csv(file: UploadFile = File(...)) -> CsvDatasetResponse:
    if not file.filename or not file.filename.lower().endswith((".csv", ".tsv")):
        raise HTTPException(status_code=422, detail="Only CSV and TSV files are accepted")

    if settings.USE_MOCKS:
        from app.services.mock_dashboard_service import parse_csv as parse_csv_mock

        return await parse_csv_mock(file.filename)
    raise HTTPException(status_code=501, detail="Real CSV parsing not implemented yet")


@router.get("/datasets/{dataset_id}", response_model=CsvDatasetResponse)
async def get_dataset(dataset_id: str) -> CsvDatasetResponse:
    if settings.USE_MOCKS:
        from app.services.mock_dashboard_service import get_dataset as get_dataset_mock

        result = await get_dataset_mock(dataset_id)
        if result is None:
            raise HTTPException(status_code=404, detail="Dataset not found")
        return result
    raise HTTPException(status_code=501, detail="Real dataset retrieval not implemented yet")
