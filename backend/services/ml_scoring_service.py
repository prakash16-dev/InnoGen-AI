import random
import re
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer("all-MiniLM-L6-v2")

existing_texts = [
    "AI crop disease detection using CNN",
    "Blockchain based supply chain management",
    "IoT smart irrigation system",
    "AI chatbot for education",
    "Drone based agriculture monitoring"
]

tech_keywords = [
    "ai",
    "machine learning",
    "deep learning",
    "blockchain",
    "iot",
    "robotics",
    "computer vision",
    "nlp"
]

risk_keywords = [
    "hardware",
    "expensive",
    "regulation",
    "complex",
    "infrastructure"
]


def calculate_novelty_score(text):

    emb1 = model.encode([text])
    emb2 = model.encode(existing_texts)

    similarity = cosine_similarity(emb1, emb2)

    max_similarity = float(similarity.max())

    novelty = (1 - max_similarity) * 100

    return float(round(novelty, 2))


def calculate_innovation_score(text):

    text = text.lower()

    score = 0

    for word in tech_keywords:
        if word in text:
            score += 10

    return min(score, 100)


def calculate_plagiarism_score(text):

    emb1 = model.encode([text])
    emb2 = model.encode(existing_texts)

    similarity = cosine_similarity(emb1, emb2)

    plag = float(similarity.max()) * 100

    return float(round(plag, 2))


def calculate_human_score(text):

    sentence_count = len(re.split(r'[.!?]', text))
    word_count = len(text.split())

    avg_len = word_count / max(sentence_count, 1)

    if avg_len < 12:
        return random.randint(85, 95)

    elif avg_len < 20:
        return random.randint(70, 85)

    else:
        return random.randint(60, 75)


def calculate_success_rate(text):

    innovation = calculate_innovation_score(text)
    novelty = calculate_novelty_score(text)

    success = (0.6 * innovation) + (0.4 * novelty)

    return round(success, 2)


def calculate_risk_score(text):

    text = text.lower()

    risk = 20

    for word in risk_keywords:
        if word in text:
            risk += 10

    return min(risk, 100)


def calculate_winning_probability(text):

    novelty = calculate_novelty_score(text)
    innovation = calculate_innovation_score(text)

    feasibility = random.randint(60, 85)

    winning = (0.4 * novelty) + (0.3 * innovation) + (0.3 * feasibility)

    return round(winning, 2)
