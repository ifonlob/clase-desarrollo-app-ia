from fastapi import APIRouter, HTTPException

from app.core.config import settings
from app.schemas.chat import ChatMessageRequest, ChatMessageResponseWrapper, ChatSessionResponse

router = APIRouter()


@router.post("/message", response_model=ChatMessageResponseWrapper)
async def send_message(request: ChatMessageRequest) -> ChatMessageResponseWrapper:
    if settings.USE_MOCKS:
        from app.services.mock_chat_service import process_message

        return await process_message(request)
    raise HTTPException(status_code=501, detail="Real agent not implemented yet")


@router.get("/sessions/{session_id}", response_model=ChatSessionResponse)
async def get_session(session_id: str) -> ChatSessionResponse:
    if settings.USE_MOCKS:
        from app.services.mock_chat_service import get_session_mock

        return await get_session_mock(session_id)
    raise HTTPException(status_code=501, detail="Real session retrieval not implemented yet")
