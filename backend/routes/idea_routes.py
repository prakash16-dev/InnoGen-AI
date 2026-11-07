from fastapi import APIRouter
from pydantic import BaseModel
from services.idea_service import generate_idea

router = APIRouter()

class IdeaRequest(BaseModel):
    domain: str
    mode: str

@router.post("/generate-idea")
def generate_idea_api(data: IdeaRequest):

    result = generate_idea(data.domain, data.mode)

    return result