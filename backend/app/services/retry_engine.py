import asyncio
from collections.abc import Awaitable, Callable


async def with_retries(fn: Callable[[], Awaitable], attempts: int = 3, base_delay: float = 0.5):
    last_error = None
    for attempt in range(attempts):
        try:
            return await fn()
        except Exception as exc:
            last_error = exc
            await asyncio.sleep(base_delay * (2 ** attempt))
    raise last_error
