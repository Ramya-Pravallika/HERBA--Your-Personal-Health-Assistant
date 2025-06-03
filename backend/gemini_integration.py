import os
import requests

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def generate_remedy_with_gemini(prompt):
    try:
        if not GEMINI_API_KEY:
            print("Gemini API key is missing!")
            return None
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
        print("Gemini API response status:", response.status_code)
        print("Gemini API response body:", response.text)
        response.raise_for_status()
        content = response.json()
        return content['candidates'][0]['content']['parts'][0]['text']
    except Exception as e:
        print("Gemini error:", str(e))
        return None

def generate_remedy_with_gpt(prompt):
    try:
        if not OPENAI_API_KEY:
            print("OpenAI API key is missing!")
            return None
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
        response = requests.post(OPENAI_API_URL, headers=headers, json=data)
        print("GPT API response status:", response.status_code)
        print("GPT API response body:", response.text)
        response.raise_for_status()
        content = response.json()
        return content['choices'][0]['message']['content']
    except Exception as e:
        print("GPT error:", str(e))
        return None

def generate_remedy(prompt):
    remedy = generate_remedy_with_gemini(prompt)
    if remedy:
        return remedy
    remedy = generate_remedy_with_gpt(prompt)
    if remedy:
        return remedy
    return "Sorry, I could not generate a remedy at this time."
