from fastapi import APIRouter

from app.api.v1 import chat, dashboard, pdf

router = APIRouter()
router.include_router(chat.router, prefix="/chat", tags=["chat"])
router.include_router(pdf.router, prefix="/pdf", tags=["pdf"])
router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
