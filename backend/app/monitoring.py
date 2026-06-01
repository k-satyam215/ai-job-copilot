from time import perf_counter

from starlette.middleware.base import BaseHTTPMiddleware


class RequestTimingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        started = perf_counter()
        response = await call_next(request)
        response.headers["X-Process-Time"] = f"{perf_counter() - started:.4f}"
        return response
