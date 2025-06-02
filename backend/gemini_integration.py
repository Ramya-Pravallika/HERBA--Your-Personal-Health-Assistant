import os
import requests

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

def generate_remedy(prompt):
    headers = {"Content-Type": "application/json"}
    params = {"key": GEMINI_API_KEY}
    body = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "stopSequences": [],
            "temperature": 0.7,
            "maxOutputTokens": 1024
        }
    }
    response = requests.post(GEMINI_API_URL, headers=headers, params=params, json=body)
    response.raise_for_status()
    content = response.json()
    # parse the Gemini response for remedy, images, links, instructions
    try:
        resp_text = content['candidates'][0]['content']['parts'][0]['text']
    except Exception:
        resp_text = "Sorry, I could not generate a remedy at this time."
    return resp_text
