from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class EntityType(str, Enum):
    LOCATION = "LOCATION"
    MONUMENT = "MONUMENT"
    PERSON = "PERSON"
    DATE = "DATE"
    ORGANIZATION = "ORGANIZATION"
    EVENT = "EVENT"


class ExtractedEntitySchema(BaseModel):
    id: str
    type: EntityType
    value: str
    context: str
    confidence: float = Field(ge=0.0, le=1.0)
    page_number: int


class PdfJobResponse(BaseModel):
    job_id: str
    filename: str
    status: str
    entities: list[ExtractedEntitySchema] = []
    page_count: Optional[int] = None
    processed_at: Optional[datetime] = None
