import os
import shutil
from dotenv import load_dotenv

load_dotenv()


from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse


# Ensure Graphviz dot executable is available on Windows.
# Some environments (e.g. services started before PATH was updated) may not have it.
if shutil.which("dot") is None:
    for candidate in [
        r"C:\Program Files\Graphviz\bin",
        r"C:\Program Files (x86)\Graphviz\bin",
    ]:
        if os.path.isdir(candidate):
            os.environ["PATH"] = os.pathsep.join([os.environ.get("PATH", ""), candidate])
            break

# Import route files
from routes import idea_routes
from routes import ppt_routes
from routes import paper_routes
#from routes import research_routes
#from routes import startup_routes
#from routes import chat_routes

# Create FastAPI app
app = FastAPI(
    title="AI Innovation Discovery Engine",
    description="AI tool for generating hackathon, research, and startup ideas",
    version="1.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # for development (React localhost)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    origin = request.headers.get("origin", "*")
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
        headers={
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        }
    )


# Include API routes
app.include_router(idea_routes.router)
#app.include_router(research_routes.router)
#app.include_router(startup_routes.router)
#app.include_router(chat_routes.router)
app.include_router(ppt_routes.router)
app.include_router(paper_routes.router)


# Root API
@app.get("/")
def home():
    return {
        "message": "AI Innovation Discovery Engine Backend Running 🚀"
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 9000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)