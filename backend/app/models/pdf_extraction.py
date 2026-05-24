from datetime import datetime, timezone

from sqlalchemy import Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class PdfJob(Base):
    __tablename__ = "pdf_jobs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    filename: Mapped[str] = mapped_column(String(255))
    status: Mapped[str] = mapped_column(String(20))
    page_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))
    processed_at: Mapped[datetime | None] = mapped_column(nullable=True)
    entities: Mapped[list["ExtractedEntity"]] = relationship(
        back_populates="job", cascade="all, delete-orphan"
    )


class ExtractedEntity(Base):
    __tablename__ = "extracted_entities"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    job_id: Mapped[str] = mapped_column(ForeignKey("pdf_jobs.id"))
    type: Mapped[str] = mapped_column(String(50))
    value: Mapped[str] = mapped_column(String(500))
    context: Mapped[str] = mapped_column(Text)
    confidence: Mapped[float] = mapped_column(Float)
    page_number: Mapped[int] = mapped_column(Integer)
    job: Mapped["PdfJob"] = relationship(back_populates="entities")
