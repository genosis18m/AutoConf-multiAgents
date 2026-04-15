import os
from dotenv import load_dotenv
import requests

load_dotenv(override=True)
api_key = os.getenv("GEMINI_API_KEY")
res = requests.get(f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}")
data = res.json()
if 'models' in data:
    for m in data['models']:
        print(m['name'])
else:
    print(data)
