from diagrams import Diagram, Cluster
from diagrams.onprem.client import User
from diagrams.onprem.compute import Server
from diagrams.onprem.database import PostgreSQL
from diagrams.programming.language import Python
from diagrams.onprem.network import Nginx
import uuid
import os


def generate_architecture_diagram(project_name="AI Idea System"):

    try:
        os.makedirs("generated_diagrams", exist_ok=True)
        filename = f"generated_diagrams/architecture_{uuid.uuid4().hex}"

        with Diagram(
            project_name + " Architecture",
            filename=filename,
            show=False,
            direction="LR"
        ):

            user = User("User")

            with Cluster("Frontend Layer"):
                ui = Nginx("Web UI")

            with Cluster("Backend API"):
                api = Server("FastAPI")

            with Cluster("AI Services"):
                idea = Python("Idea Generator")
                ppt = Python("PPT Generator")
                research = Python("Research Service")

            with Cluster("External APIs"):
                groq = Server("Groq LLM")
                papers = Server("Research APIs")

            with Cluster("Data Layer"):
                db = PostgreSQL("Storage")

            user >> ui >> api

            api >> idea
            api >> ppt
            api >> research

            idea >> groq
            research >> papers

            api >> db

        return filename + ".png"
    except Exception as e:
        print(f"Warning: Graphviz dot executable not found or failed ({e}). Skipping image diagram.")
        return None
