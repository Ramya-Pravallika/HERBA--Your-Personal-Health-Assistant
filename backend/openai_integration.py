import os
import requests

OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def generate_remedy(prompt):
    if not OPENAI_API_KEY:
        print("OpenAI API key is missing!")
        return "Sorry, the AI service is currently unavailable. Please contact the developer."
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENAI_API_KEY}"
    }
    data = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": "You are an AI health assistant. Provide clear, friendly, sectioned herbal home remedies for the given symptoms. Only suggest general, safe advice."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 512,
        "temperature": 0.7
    }
    try:
        response = requests.post(OPENAI_API_URL, headers=headers, json=data)
        print("OpenAI API response status:", response.status_code)
        print("OpenAI API response body:", response.text)
        response.raise_for_status()
        content = response.json()
        return content['choices'][0]['message']['content']
    except Exception as e:
        print("OpenAI error:", str(e))
        return "Sorry, I could not generate a remedy at this time."
