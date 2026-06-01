import asyncio

from app.services.job_poller import start_job_poller
from app.utils.logger import configure_logging


async def main():
    configure_logging()
    await start_job_poller()


if __name__ == "__main__":
    asyncio.run(main())
