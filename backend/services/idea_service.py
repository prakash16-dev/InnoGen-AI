import os
import re
from groq import Groq

from services.research_service import fetch_research_papers
from services.architecture_service import generate_architecture_diagram

from services.ml_scoring_service import (
    calculate_novelty_score,
    calculate_winning_probability,
    calculate_plagiarism_score,
    calculate_human_score,
    calculate_innovation_score,
    calculate_success_rate,
    calculate_risk_score
)

def get_client():
    api_key = os.environ.get("GROQ_API_KEY", "")
    if not api_key:
        raise ValueError("GROQ_API_KEY is not configured.")
    return Groq(api_key=api_key)



def clean_response(text: str) -> str:
    """Remove # and * characters from response while maintaining clean spacing."""
    if not text:
        return ""
    # Strip # and *
    cleaned = re.sub(r"[#*]", "", text)
    # Clean leading whitespace from each line while preserving paragraphs
    lines = [line.strip() for line in cleaned.splitlines()]
    return "\n".join(lines).strip()


def _generate_fallback_idea(domain: str, mode: str) -> str:
    domain_clean = domain.strip().title() or "Artificial Intelligence"
    if "startup" in mode:
        return f"""Startup Venture: {domain_clean} Innovator Pro

Market Demand:
Rapidly expanding market demand for automated, secure, and scalable solutions in {domain_clean}. Current solutions lack integrated real-time analytics and adaptive personalization.

Unique Value Proposition:
An end-to-end AI-powered platform tailored for {domain_clean} that reduces operational overhead by 40% and delivers actionable intelligence in seconds.

Business Idea:
A multi-tenant SaaS platform that unifies workflows, predictive monitoring, and automated decision-making for enterprises operating within the {domain_clean} sector.

Target Audience:
- Mid-to-enterprise businesses in {domain_clean}
- Professional teams and technical leaders requiring automated workflows
- Regulated industries needing compliance and data transparency

Revenue Model:
- Tiered SaaS Subscription (Starter, Pro, Enterprise)
- Pay-as-you-go usage for heavy computing and API integrations
- Custom enterprise deployments and premium support contracts

Competitors and Strategies:
- Legacy enterprise tools: compete via modern UX and 10x faster setup time.
- Point solutions: compete via comprehensive end-to-end integration and lower TCO.

Go-to-Market & Growth:
1. Direct developer and community adoption via free tier.
2. Content marketing and benchmarks highlighting efficiency gains.
3. Strategic partner integrations across key industry toolchains.
"""
    elif "research" in mode:
        return f"""Research Proposal: Advanced Deep Learning Frameworks in {domain_clean}

Abstract:
This research investigates novel algorithmic approaches to optimize efficiency, interpretability, and robustness in {domain_clean}. We propose a hybrid neural architecture designed to address long-standing latency and generalization constraints.

Introduction:
As data complexity within {domain_clean} expands exponentially, classical statistical models struggle to adapt to non-stationary environments. This paper presents a principled methodology combining state-of-the-art transformer foundations with localized attention.

Research Problem:
Existing methodologies suffer from quadratic complexity and lack formal explainability guarantees when deployed in mission-critical {domain_clean} contexts.

Proposed Solution:
A unified framework featuring adaptive sparse embeddings and modular uncertainty estimation tailored for continuous-stream datasets.

Methodology & System Implementation:
1. Rigorous data curation and automated feature selection.
2. Benchmark training against standardized baseline models.
3. Cross-validation across diverse distributed evaluation nodes.

Expected Contribution:
- A scalable open-source framework benchmarked against leading architectures.
- Empirical validation demonstrating up to 28% improvement in generalization accuracy.
- Reproducible datasets and analysis pipelines.
"""
    else: # Hackathon mode
        return f"""Hackathon Project: {domain_clean} Pulse

Problem Statement:
Users and teams in the {domain_clean} domain face significant friction, fragmented tools, and slow manual workflows that degrade productivity and outcome accuracy.

Proposed Solution:
An intelligent, real-time AI assistant and collaboration platform that synthesizes complex {domain_clean} tasks into streamlined, automated workflows with explainable outputs.

Tech Stack:
- Frontend: React, Tailwind CSS, Lucide Icons, Vite
- Backend: FastAPI, Python, Pydantic, Uvicorn
- AI & Analytics: Groq LLaMA-3.3, Sentence-Transformers, PyTorch
- Data & APIs: REST API, WebSocket real-time updates

Implementation Steps:
1. Build intuitive responsive dashboard for inputting domain criteria.
2. Connect FastAPI backend service with scoring and intelligence pipelines.
3. Integrate real-time analytics, novelty scoring, and quality dashboards.
4. Package containerized deployment for seamless multi-platform hosting.

Expected Impact:
Empowers hackathon participants and practitioners to accelerate solution discovery from hours to seconds with reliable validation metrics.
"""


def generate_idea(domain, mode):

    mode_lower = mode.lower()

    # -----------------------
    # PROMPT (clean plain text format without # or *)
    # -----------------------

    format_instruction = "Do not use markdown formatting characters like '#' or '*'. Output clean plain text only."

    if "hackathon" in mode_lower:

        prompt = f"""
        Generate a hackathon project idea in the domain: {domain}.

        Provide:
        - Problem Statement
        - Proposed Solution
        - Tech Stack
        - Implementation Steps
        - Expected Impact

        {format_instruction}
        """

    elif "startup" in mode_lower:

        prompt = f"""
        Generate a startup idea in the domain: {domain}.

        Provide:
        - Market Demand
        - Unique Value Proposition
        - Business Idea
        - Target Audience
        - Revenue Model
        - Competitors and their Strategies
        - How to launch and grow the startup

        {format_instruction}
        """

    elif "research" in mode_lower:

        prompt = f"""
        Generate a research idea in the domain: {domain}.

        Include:
        - Abstract
        - Introduction
        - Literature Survey
        - Research Problem
        - Proposed Solution
        - System Implementation
        - Methodology
        - Experimental Results
        - Applications
        - Future Enhancement
        - Expected Contribution
        - Conclusion

        {format_instruction}
        """

    else:

        prompt = f"Generate an innovative idea in the domain: {domain}. {format_instruction}"

    # -----------------------
    # LLM CALL (with fallback)
    # -----------------------

    idea_text = None
    try:
        client = get_client()
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        idea_text = response.choices[0].message.content
    except Exception as e:
        print(f"Notice: Groq API call failed ({e}). Using structured domain fallback.")
        idea_text = _generate_fallback_idea(domain, mode_lower)

    # Ensure no # or * exist in idea_text
    idea_text = clean_response(idea_text)

    # -----------------------
    # ARCHITECTURE DIAGRAM
    # -----------------------

    try:
        diagram_path = generate_architecture_diagram(domain)
    except Exception as e:
        print(f"Notice: Diagram generation skipped ({e})")
        diagram_path = None

    result = {
        "idea": idea_text,
        "architecture_diagram": diagram_path
    }

    # -----------------------
    # HACKATHON MODE
    # -----------------------

    if "hackathon" in mode_lower:

        novelty = calculate_novelty_score(idea_text)
        winning = calculate_winning_probability(idea_text)

        result["novelty_score"] = novelty
        result["winning_probability"] = winning

    # -----------------------
    # STARTUP MODE
    # -----------------------

    elif "startup" in mode_lower:

        success = calculate_success_rate(idea_text)
        risk = calculate_risk_score(idea_text)

        result["success_rate"] = success
        result["risk_score"] = risk

    # -----------------------
    # RESEARCH MODE
    # -----------------------

    elif "research" in mode_lower:

        papers = []
        try:
            papers = fetch_research_papers(domain)
        except Exception as e:
            print(f"Notice: fetch_research_papers failed ({e})")

        paper_text = ""
        if papers:
            paper_text = "\n\nRELATED RESEARCH PAPERS:\n\n"
            paper_text += "\n\n".join([
                f"Title: {clean_response(p['title'])}\nAuthors: {clean_response(p['authors'])}\nYear: {p['year']}\nSummary: {clean_response(p['summary'])}\nLink: {p['link']}"
                for p in papers
            ])

        plagiarism = calculate_plagiarism_score(idea_text)
        human_score = calculate_human_score(idea_text)
        innovation = calculate_innovation_score(idea_text)

        result["idea"] = clean_response(idea_text + paper_text)

        result["plagiarism_score"] = plagiarism
        result["human_score"] = human_score
        result["innovation_score"] = innovation

    return result
