from backend.services.ppt_service import generate_ppt

content = "Title\nBody text goes here\n\nAnother Title\nAnother body text"
try:
    generate_ppt(content)
except Exception as e:
    print(f"Error: {e}")
