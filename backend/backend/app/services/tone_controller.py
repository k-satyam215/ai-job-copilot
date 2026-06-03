def apply_tone(text: str, tone: str) -> str:
    if tone == "direct":
        return text.replace("I am excited to apply", "I am applying")
    if tone == "warm":
        return text + " I would value the opportunity to discuss how I can help."
    return text
