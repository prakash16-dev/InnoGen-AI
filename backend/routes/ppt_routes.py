from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from services.ppt_service import generate_ppt
import os

router = APIRouter()

@router.post("/generate-ppt")
def create_ppt(data: dict):
    try:
        idea_text = data.get("content", "")
        mode = data.get("mode", "hackathon").lower()

        if not idea_text.strip():
            raise HTTPException(status_code=400, detail="Content cannot be empty")

        if "startup" in mode:
            mode = "startup"
        elif "research" in mode:
            mode = "research"
        else:
            mode = "hackathon"

        file_path = generate_ppt(idea_text, mode)

        if not os.path.exists(file_path):
            raise HTTPException(status_code=500, detail="Failed to generate PPT")

        return FileResponse(
            file_path,
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
            filename=f"{mode}_presentation.pptx"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating PPT: {str(e)}")
