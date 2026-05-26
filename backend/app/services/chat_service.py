from app.schemas.chat import ChatMessageRequest
from langchain_openai import ChatOpenAI
from app.core.config import settings

from langchain_core.messages import HumanMessage, AIMessage, SystemMessage 

async def run_chat(payload : ChatMessageRequest) -> None:
    session_id = payload.session_id
    content: str = payload.content

    message = HumanMessage(content=content)

    llm = ChatOpenAI(model=settings.LLM_MODEL_NAME, temperature=1.0, api_key=settings.LLM_API_KEY, base_url=settings.LLM_BASE_URL)

    response : AIMessage= await llm.ainvoke(input=[message])

    return response.content