import sys
from dotenv import load_dotenv
load_dotenv(override=True)
from crewai import Agent, Task, Crew, LLM
from config import settings

llm = LLM(model="gemini/gemini-2.0-flash", api_key=settings.gemini_api_key)
agent = Agent(
    role="Tester",
    goal="Say hello",
    backstory="You are a friendly bot.",
    llm=llm,
)
task = Task(description="Say hello world", expected_output="A greeting string", agent=agent)
crew = Crew(agents=[agent], tasks=[task], verbose=True)
try:
    res = crew.kickoff()
    print("SUCCESS: ", res)
except Exception as e:
    print("FAILED: ", e)
