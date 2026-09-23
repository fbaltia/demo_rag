
from fastapi import APIRouter
from pydantic import BaseModel
from dto.question_request import QuestionRequest

from rag import ask_llm, search

router = APIRouter()

@router.post("/ask")
async def ask_question(request: QuestionRequest) -> dict:
    pass