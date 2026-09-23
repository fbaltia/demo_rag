
from fastapi import APIRouter, Query
from dto.question_request import QuestionRequest
from rag import ask_llm, search

router = APIRouter()

@router.post("/ask")
async def ask_question(
    request: QuestionRequest,
    n_answers: int = Query(default=3, ge=1),
) -> dict:

    result = search(request.question, n_answers)
    response = ask_llm(request.question, result)

    return {
        "answer": response,
        "sources": result["metadatas"][0],
    }
