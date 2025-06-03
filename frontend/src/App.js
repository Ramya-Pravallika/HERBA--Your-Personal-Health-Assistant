import React, { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/remedy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: input }),
      });
      const data = await res.json();
      setResponse(data.remedy || data.error || "Sorry, something went wrong.");
    } catch (error) {
      setResponse("Sorry, something went wrong.");
    }
  };

  return (
    <div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type your health concern..."
      />
      <button onClick={handleSubmit}>Submit</button>
      <div>{response}</div>
    </div>
  );
}

export default App;
