import hashlib
import math


VECTOR_SIZE = 128


def embed_text(text: str) -> list[float]:
    vector = [0.0] * VECTOR_SIZE
    for token in (text or "").lower().split():
        digest = hashlib.sha256(token.encode("utf-8")).digest()
        index = digest[0] % VECTOR_SIZE
        vector[index] += 1.0
    norm = math.sqrt(sum(value * value for value in vector)) or 1.0
    return [round(value / norm, 6) for value in vector]


def cosine_similarity(left: list[float], right: list[float]) -> float:
    if not left or not right:
        return 0.0
    return sum(a * b for a, b in zip(left, right))
