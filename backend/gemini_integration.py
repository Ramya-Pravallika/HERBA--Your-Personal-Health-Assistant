import os
import requests

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def generate_remedy_with_gemini(prompt):
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
    print("Gemini response status:", response.status_code)
    print("Gemini response body:", response.text)
    response.raise_for_status()
    content = response.json()
    try:
        resp_text = content['candidates'][0]['content']['parts'][0]['text']
    except Exception as e:
        print("Gemini parsing error:", e)
        resp_text = None
    return resp_text

def generate_remedy_with_gpt(prompt):
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
        "max_tokens": 1024,
        "temperature": 0.7
    }
    response = requests.post(OPENAI_API_URL, headers=headers, json=data)
    print("GPT response status:", response.status_code)
    print("GPT response body:", response.text)
    response.raise_for_status()
    content = response.json()
    try:
        resp_text = content['choices'][0]['message']['content']
    except Exception as e:
        print("GPT parsing error:", e)
        resp_text = None
    return resp_text

def generate_remedy(prompt):
    # Try Gemini first
    remedy = None
    try:
        remedy = generate_remedy_with_gemini(prompt)
    except Exception as err:
        print("Gemini API error:", err)
    # Fallback to GPT if Gemini fails or returns None
    if not remedy:
        try:
            remedy = generate_remedy_with_gpt(prompt)
        except Exception as err:
            print("GPT API error:", err)
    if not remedy:
        remedy = "Sorry, I could not generate a remedy at this time."
    return remedy
