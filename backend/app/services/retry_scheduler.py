def retry_schedule(attempts: int = 3) -> list[int]:
    return [2 ** attempt for attempt in range(attempts)]
