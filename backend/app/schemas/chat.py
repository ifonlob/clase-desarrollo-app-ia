from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ToolCallSchema(BaseModel):
    tool_name: str
    input: str
    output: str
    duration_ms: int


class ChatMessageResponse(BaseModel):
    id: str
    role: str
    content: str
    tool_calls: list[ToolCallSchema] = []
    created_at: datetime


class ChatMessageRequest(BaseModel):
    session_id: Optional[str] = None
    content: str


class ChatMessageResponseWrapper(BaseModel):
    session_id: str
    message: ChatMessageResponse


class ChatSessionResponse(BaseModel):
    id: str
    messages: list[ChatMessageResponse]
    created_at: datetime
