from app.schemas.chat import ChatMessageRequest, ChatMessageResponseWrapper


async def run(request: ChatMessageRequest) -> ChatMessageResponseWrapper:
    raise NotImplementedError(
        "Travel agent is not implemented yet. Set USE_MOCKS=true to use mock responses."
    )
