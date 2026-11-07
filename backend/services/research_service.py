import os
import arxiv
from groq import Groq


def get_client():
    api_key = os.environ.get("GROQ_API_KEY", "")
    if not api_key:
        raise ValueError("GROQ_API_KEY is not configured.")
    return Groq(api_key=api_key)



def summarize_text(text):

    try:
        client = get_client()
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": f"Summarize this research paper abstract:\n{text}"
                }
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        # Fallback to direct excerpt if LLM call is unavailable
        first_sentence = text.split(". ")[0] if ". " in text else text[:250]
        return first_sentence + "."


def fetch_research_papers(topic):

    search = arxiv.Search(
        query=topic,
        max_results=5,
        sort_by=arxiv.SortCriterion.Relevance
    )

    papers = []

    for result in search.results():

        summary = summarize_text(result.summary)

        papers.append({
            "title": result.title,
            "summary": summary,
            "authors": ", ".join([a.name for a in result.authors]),
            "year": result.published.year,
            "link": result.entry_id
        })

    return papers
