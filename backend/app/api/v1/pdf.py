from fastapi import APIRouter, File, HTTPException, UploadFile

from app.core.config import settings
from app.schemas.pdf import PdfJobResponse

router = APIRouter()


@router.post("/extract", response_model=PdfJobResponse)
async def extract_pdf(file: UploadFile = File(...)) -> PdfJobResponse:
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=422, detail="Only PDF files are accepted")

    if settings.USE_MOCKS:
        from app.services.mock_pdf_service import extract_entities

        return await extract_entities(file.filename)
    raise HTTPException(status_code=501, detail="Real PDF extraction not implemented yet")


@router.get("/{job_id}", response_model=PdfJobResponse)
async def get_job(job_id: str) -> PdfJobResponse:
    if settings.USE_MOCKS:
        from app.services.mock_pdf_service import get_job as get_job_mock

        return await get_job_mock(job_id)
    raise HTTPException(status_code=501, detail="Real job retrieval not implemented yet")
