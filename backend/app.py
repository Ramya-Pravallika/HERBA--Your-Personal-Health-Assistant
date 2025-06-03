from flask import Flask, request, jsonify
from flask_cors import CORS
from openai_integration import generate_remedy

app = Flask(__name__)
CORS(app)

@app.route("/api/remedy", methods=["POST"])
def remedy():
    data = request.json
    symptoms = data.get("symptoms", "")
    if not symptoms:
        return jsonify({"error": "Symptoms are required"}), 400
    prompt = (
        f"User symptoms: {symptoms}\n"
        "Provide an herbal remedy with:\n"
        "- Step-by-step instructions\n"
        "- Any relevant images (as links)\n"
        "- Useful web links\n"
        "- Response in a clear sectioned format\n"
        "- Suitable for text and voice output"
    )
    remedy_response = generate_remedy(prompt)
    return jsonify({"remedy": remedy_response})

if __name__ == "__main__":
    app.run(debug=True)
