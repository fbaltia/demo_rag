from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_db
from models import Conversation, Message


router = APIRouter(prefix="/conversations", tags=["history"])


class ConversationCreate(BaseModel):
    title: str = Field(default="Nouvelle conversation", max_length=200)


class ConversationUpdate(BaseModel):
    title: str = Field(min_length=1, max_length=200)


class MessageCreate(BaseModel):
    role: str = Field(pattern="^(user|assistant)$")
    content: str = Field(min_length=1)


def conversation_to_dict(conversation: Conversation) -> dict:
    return {
        "id": conversation.id,
        "title": conversation.title,
        "created_at": conversation.created_at,
        "updated_at": conversation.updated_at,
    }


def message_to_dict(message: Message) -> dict:
    return {
        "id": message.id,
        "conversation_id": message.conversation_id,
        "role": message.role,
        "content": message.content,
        "created_at": message.created_at,
    }


@router.post("")
def create_conversation(
    data: ConversationCreate,
    db: Session = Depends(get_db),
) -> dict:
    conversation = Conversation(title=data.title)
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    return conversation_to_dict(conversation)


@router.get("")
def list_conversations(db: Session = Depends(get_db)) -> list[dict]:
    conversations = db.scalars(
        select(Conversation).order_by(Conversation.updated_at.desc())
    ).all()
    return [conversation_to_dict(item) for item in conversations]


@router.get("/{conversation_id}")
def get_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
) -> dict:
    conversation = db.get(Conversation, conversation_id)
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation introuvable.")

    return {
        **conversation_to_dict(conversation),
        "messages": [message_to_dict(message) for message in conversation.messages],
    }


@router.patch("/{conversation_id}")
def update_conversation(
    conversation_id: int,
    data: ConversationUpdate,
    db: Session = Depends(get_db),
) -> dict:
    conversation = db.get(Conversation, conversation_id)
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation introuvable.")

    conversation.title = data.title
    conversation.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(conversation)
    return conversation_to_dict(conversation)


@router.delete("/{conversation_id}")
def delete_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
) -> dict:
    conversation = db.get(Conversation, conversation_id)
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation introuvable.")

    db.delete(conversation)
    db.commit()
    return {"message": "Conversation supprimée"}


@router.post("/{conversation_id}/messages")
def create_message(
    conversation_id: int,
    data: MessageCreate,
    db: Session = Depends(get_db),
) -> dict:
    conversation = db.get(Conversation, conversation_id)
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation introuvable.")

    message = Message(
        conversation_id=conversation_id,
        role=data.role,
        content=data.content,
    )
    conversation.updated_at = datetime.now(timezone.utc)
    db.add(message)
    db.commit()
    db.refresh(message)
    return message_to_dict(message)


@router.get("/{conversation_id}/messages")
def list_messages(
    conversation_id: int,
    db: Session = Depends(get_db),
) -> list[dict]:
    if db.get(Conversation, conversation_id) is None:
        raise HTTPException(status_code=404, detail="Conversation introuvable.")

    messages = db.scalars(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc(), Message.id.asc())
    ).all()
    return [message_to_dict(message) for message in messages]
