import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from app.core.config import settings
from app.schemas.chat import (
    ChatMessageRequest,
    ChatMessageResponse,
    ChatMessageResponseWrapper,
    ChatSessionResponse,
)
from httpx import request

router = APIRouter()


@router.post("/message", response_model=ChatMessageResponseWrapper)
async def send_message(request: ChatMessageRequest) -> ChatMessageResponseWrapper:
    if settings.USE_MOCKS:
        from app.services.mock_chat_service import process_message

        return await process_message(request)
    else:
        from app.services.chat_service import run_chat

        content = await run_chat(request)
        return ChatMessageResponseWrapper(
            session_id=request.session_id or str(uuid.uuid4()),
            message=ChatMessageResponse(
                id=str(uuid.uuid4()),
                role="assistant",
                content=str(content),
                tool_calls=[],
                created_at=datetime.now(timezone.utc),
            )
        )


@router.get("/sessions/{session_id}", response_model=ChatSessionResponse)
async def get_session(session_id: str) -> ChatSessionResponse:
    if settings.USE_MOCKS:
        from app.services.mock_chat_service import get_session_mock

        return await get_session_mock(session_id)
    raise HTTPException(status_code=501, detail="Real session retrieval not implemented yet")
