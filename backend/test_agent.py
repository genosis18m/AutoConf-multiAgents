import asyncio
from agents.sponsor_agent import run_sponsor_agent
import logging
import traceback

logging.basicConfig(level=logging.DEBUG)

async def main():
    try:
        result = await run_sponsor_agent("AI", "NY", 100, 10000)
        print("RESULT:")
        print(result)
    except Exception as e:
        print("EXCEPTION:")
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
