import React, { useState } from "react";

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
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>Herba - Your Personal Health Assistant</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your health concern..."
          style={{ width: "80%", padding: 10 }}
        />
        <button type="submit" disabled={loading} style={{ padding: 10 }}>
          {loading ? "Loading..." : "Ask"}
        </button>
      </form>
      <div style={{ marginTop: 20, minHeight: 60 }}>
        {response && <div>{response}</div>}
      </div>
      <div style={{ marginTop: 40, color: "#888", fontSize: 12 }}>
        Disclaimer: Herba is an AI health assistant for informational purposes only and does not provide medical advice; always consult a qualified healthcare professional for medical concerns.
      </div>
    </div>
  );
}

export default App;
