from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import models, schemas
from ..llm import get_llm_response

router = APIRouter()

@router.post("/chat")
async def create_chat_message(
    message: schemas.MessageCreate,
    db: Session = Depends(get_db)
):
    # Save user message
    db_message = models.Message(**message.dict())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    # Get LLM response
    llm_response = get_llm_response(message.content)
    
    # Save bot response
    bot_message = models.Message(
        content=llm_response,
        sender="bot",
        user_id=message.user_id
    )
    db.add(bot_message)
    db.commit()
    db.refresh(bot_message)
    
    return {
        "response": llm_response
    }

@router.get("/chat/history/{user_id}")
async def get_chat_history(
    user_id: int,
    db: Session = Depends(get_db)
) -> List[schemas.Message]:
    messages = db.query(models.Message).filter(
        models.Message.user_id == user_id
    ).order_by(models.Message.created_at.asc()).all()
    return messages