import React, { useState } from "react";
import RemedyInput from "./components/RemedyInput";

const initialMessages = [
  {
    from: "herba",
    text: `Hello! I'm Herba, your personal health assistant. How can I help you today? Feel free to describe any mild health concerns, and I can suggest some natural home remedies.`,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  },
];

function App() {
  const [messages, setMessages] = useState(initialMessages);
  const [loading, setLoading] = useState(false);

  const handleRemedyRequest = async (symptoms) => {
    setLoading(true);
    setMessages((prev) => [
      ...prev,
      { from: "user", text: symptoms, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
    ]);
    try {
      const res = await fetch("https://herba-your-personal-health-assistant.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          from: "herba",
          text: data.remedy,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          from: "herba",
          text: "Sorry, something went wrong.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="herba-root">
      <div className="herba-header">
        <span>Herba - Your Personal Health Assistant</span>
        <span className="herba-speaker" title="Sound is enabled">
          <svg height="24" width="24" viewBox="0 0 24 24" fill="#FFF"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-.77-3.29-2-4.29v8.59c1.23-1 2-2.52 2-4.3z"/></svg>
        </span>
      </div>
      <div className="herba-chat-area">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`herba-message ${msg.from === "herba" ? "herba-bot" : "herba-user"}`}
          >
            <div className="herba-message-text">{msg.text}</div>
            <div className="herba-message-time">{msg.time}</div>
          </div>
        ))}
      </div>
      <RemedyInput onSubmit={handleRemedyRequest} loading={loading} />
      <div className="herba-disclaimer">
        <b>Disclaimer:</b> Disclaimer: Herba is an AI health assistant for informational purposes only and does not provide medical advice; always consult a qualified healthcare professional for medical concerns.
      </div>
    </div>
  );
}

export default App;
