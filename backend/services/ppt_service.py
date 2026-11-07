from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
import os
import uuid
import re
from graphviz import Digraph


# --------------------------
# STEP 1: CLEAN
# --------------------------
def preprocess_text(content):

    content = re.sub(r"[#*`_>~-]", "", content)
    content = re.sub(r"[\"']", "", content)

    content = re.sub(r"•\s*\d+\s*", "", content)
    content = re.sub(r"^\s*\d+\s*$", "", content, flags=re.MULTILINE)

    content = re.sub(r"\n+", "\n", content)

    return content.strip()


# --------------------------
# REMOVE SERIAL
# --------------------------
def remove_serial(text):
    return re.sub(r"^\s*\d+[\.\-\)\:]?\s+", "", text)


# --------------------------
# STEP 2: SMART PARSE
# --------------------------
def parse_sections(content):

    sections = []
    lines = [l.strip() for l in content.split("\n") if l.strip()]

    current_title = None
    current_body = []

    for line in lines:

        # 🎯 Title detection (with :)
        if re.match(r".+:\s*$", line):

            if current_title:
                sections.append((current_title, current_body))

            current_title = remove_serial(line.replace(":", ""))
            current_body = []

        # 🎯 Title detection (without :)
        elif re.match(r"^[A-Z][A-Za-z\s]+$", line) and len(line.split()) < 6:

            if current_title:
                sections.append((current_title, current_body))

            current_title = remove_serial(line)
            current_body = []

        else:
            if current_title:
                line = remove_serial(line)
                current_body.append(line)

    if current_title:
        sections.append((current_title, current_body))

    return sections


# --------------------------
# BACKGROUND
# --------------------------
def add_background(slide):
    bg = slide.background.fill
    bg.solid()
    bg.fore_color.rgb = RGBColor(229, 204, 255)


# --------------------------
# TITLE STYLE
# --------------------------
def style_title(frame):
    p = frame.paragraphs[0]
    p.font.size = Pt(30)
    p.font.bold = True
    p.font.name = "Times New Roman"
    p.font.color.rgb = RGBColor(0, 128, 255)


# --------------------------
# CONTENT STYLE
# --------------------------
def style_content(frame):
    for p in frame.paragraphs:
        p.font.size = Pt(22)
        p.font.name = "Times New Roman"
        p.font.color.rgb = RGBColor(0, 0, 0)


# --------------------------
# BULLETS
# --------------------------
def format_bullets(frame, lines):

    frame.clear()

    for i, line in enumerate(lines[:6]):  # max 6 bullets

        if not line.strip():
            continue

        if i == 0:
            p = frame.paragraphs[0]
        else:
            p = frame.add_paragraph()

        p.text = line
        p.level = 0


# --------------------------
# ARCHITECTURE
# --------------------------
def generate_architecture_diagram():

    try:
        dot = Digraph()

        dot.node("A", "Data Sources\n(arXiv, Patents, News)")
        dot.node("B", "Data Collection\nAPIs")
        dot.node("C", "Preprocessing\nNLP")
        dot.node("D", "ML Models\nTrend Detection")
        dot.node("E", "Innovation Insights")
        dot.node("F", "Dashboard\nReact")

        dot.edges([
            ("A","B"),
            ("B","C"),
            ("C","D"),
            ("D","E"),
            ("E","F")
        ])

        os.makedirs("generated_diagrams", exist_ok=True)

        path = "generated_diagrams/architecture"
        dot.render(path, format="png", cleanup=True)

        return path + ".png"
    except Exception as e:
        print(f"Warning: Graphviz dot executable not available ({e})")
        return None



# --------------------------
# IMAGE SLIDE
# --------------------------
def add_image_slide(prs, title, image_path):

    if not os.path.exists(image_path):
        return

    slide = prs.slides.add_slide(prs.slide_layouts[5])

    add_background(slide)

    slide.shapes.title.text = title
    style_title(slide.shapes.title.text_frame)

    slide.shapes.add_picture(
        image_path,
        Inches(0.5),
        Inches(0.5),
        width=Inches(2.5)
    )


# --------------------------
# MAIN FUNCTION
# --------------------------
def generate_ppt(content, mode="hackathon"):

    prs = Presentation()
    os.makedirs("generated_ppts", exist_ok=True)

    # ✅ STEP 1: CLEAN
    content = preprocess_text(content)

    # ✅ STEP 2: STRUCTURE
    sections = parse_sections(content)

    # ---------------- TITLE SLIDE ----------------
    slide = prs.slides.add_slide(prs.slide_layouts[0])
    add_background(slide)

    slide.shapes.title.text = "AI Innovation Discovery Engine"

    subtitle = {
        "hackathon": "Hackathon Project",
        "startup": "Startup Pitch Deck",
        "research": "Research Briefing",
    }.get(mode, "AI Presentation")

    slide.placeholders[1].text = subtitle

    style_title(slide.shapes.title.text_frame)
    style_content(slide.placeholders[1].text_frame)

    # ---------------- CONTENT SLIDES ----------------
    for title, body_lines in sections:

        slide = prs.slides.add_slide(prs.slide_layouts[1])
        add_background(slide)

        slide.shapes.title.text = title

        format_bullets(
            slide.placeholders[1].text_frame,
            body_lines
        )

        style_title(slide.shapes.title.text_frame)
        style_content(slide.placeholders[1].text_frame)

    # ---------------- ARCHITECTURE ----------------
    arch_path = generate_architecture_diagram()
    if arch_path:
        add_image_slide(prs, "System Architecture", arch_path)


    # ---------------- SAVE ----------------
    file_path = f"generated_ppts/ppt_{uuid.uuid4().hex[:6]}.pptx"
    prs.save(file_path)

    return file_path