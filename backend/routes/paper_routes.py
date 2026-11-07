from fastapi import APIRouter
from fastapi.responses import FileResponse
from services.paper_service import generate_paper_from_text

router = APIRouter()

@router.post("/generate-paper")
def create_paper(data: dict):
    idea_text = data.get("content", "")
    file_path = generate_paper_from_text(idea_text)

    return FileResponse(
        file_path,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename="IEEE_Research_Paper.docx"
    )
