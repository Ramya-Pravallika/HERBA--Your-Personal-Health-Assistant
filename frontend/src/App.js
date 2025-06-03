import React, { useState } from "react";
import "./index.css";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/remedy`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ symptoms: input }),
        }
      );
      const data = await res.json();
      setResponse(data.remedy || data.error || "Sorry, something went wrong.");
    } catch (error) {
      setResponse("Sorry, something went wrong.");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>🌿 Herba - Your Personal Health Assistant</h1>
      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your health concern..."
        />
        <button className="chat-btn" type="submit" disabled={loading || !input.trim()}>
          {loading ? "Loading..." : "Ask"}
        </button>
      </form>
      <div className="chat-response">
        {response && <div>{response}</div>}
      </div>
      <div className="disclaimer">
        Disclaimer: Herba is an AI health assistant for informational purposes only and does not provide medical advice; always consult a qualified healthcare professional for medical concerns.
      </div>
    </div>
  );
}

export default App;
