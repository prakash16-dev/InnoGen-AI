import os
from groq import Groq


def get_client():
    api_key = os.environ.get("GROQ_API_KEY", "")
    if not api_key:
        raise ValueError("GROQ_API_KEY is not configured.")
    return Groq(api_key=api_key)



def _strip_code_fences(text: str) -> str:
    """Remove surrounding markdown code fences (``` or ```mermaid)."""
    text = text.strip()
    if text.startswith("```"):
        lines = text.splitlines()
        # remove first fence line
        if lines and lines[0].startswith("```"):
            lines = lines[1:]
        # remove last fence line if present
        if lines and lines[-1].startswith("```"):
            lines = lines[:-1]
        # drop an optional leading "mermaid" token
        if lines and lines[0].strip().lower().startswith("mermaid"):
            lines = lines[1:]
        text = "\n".join(lines).strip()
    return text


def generate_mermaid_architecture(idea):

    prompt = f"""
Convert the following project idea into a Mermaid architecture diagram.

Return ONLY Mermaid code.

Idea:
{idea}

Use format like:

flowchart TD
A[User] --> B[React Frontend]
B --> C[FastAPI Backend]
C --> D[AI Model]
D --> E[Database]
"""

    try:
        client = get_client()
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role":"user","content":prompt}],
            temperature=0.3,
        )

        mermaid_text = response.choices[0].message.content
        return _strip_code_fences(mermaid_text)
    except Exception as e:
        print(f"Notice: Groq Mermaid generation fallback ({e})")
        return """flowchart TD
A[User Client] --> B[React Web Frontend]
B --> C[FastAPI Application Backend]
C --> D[AI Intelligence & Scoring Engine]
C --> E[(Data Storage & Cache)]
D --> F[External Services & APIs]"""
