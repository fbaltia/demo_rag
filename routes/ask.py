
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
from dto.question_request import QuestionRequest
from models import Conversation, Message
from rag import ask_llm, search

router = APIRouter()

@router.post("/ask")
async def ask_question(
    request: QuestionRequest,
    n_answers: int = Query(default=3, ge=1),
    db: Session = Depends(get_db),
) -> dict:

    conversation = None
    if request.conversation_id is not None:
        conversation = db.get(Conversation, request.conversation_id)
        if conversation is None:
            raise HTTPException(status_code=404, detail="Conversation introuvable.")
    else:
        conversation = Conversation(title=request.question[:200])
        db.add(conversation)
        db.flush()

    if not conversation.messages:
        conversation.title = request.question[:200]

    user_message = Message(
        conversation_id=conversation.id,
        role="user",
        content=request.question,
    )
    db.add(user_message)

    result = search(request.question, n_answers)
    response = ask_llm(request.question, result)

    assistant_message = Message(
        conversation_id=conversation.id,
        role="assistant",
        content=response,
    )
    conversation.updated_at = datetime.now(timezone.utc)
    db.add(assistant_message)
    db.commit()

    return {
        "answer": response,
        "sources": result["metadatas"][0],
        "conversation_id": conversation.id,
    }
