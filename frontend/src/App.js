import React, { useState, useRef, useEffect } from "react";
import "./index.css";

const WELCOME_MSG = {
  sender: "bot",
  text: "Hello! I'm Herba, your personal health assistant. How can I help you today? Feel free to describe any mild health concerns, and I can suggest some natural home remedies.",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

function App() {
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Voice recognition setup
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    setListening(true);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.interimResults = false;
    recognitionRef.current.maxAlternatives = 1;
    recognitionRef.current.onresult = (event) => {
      setInput(event.results[0][0].transcript);
      setListening(false);
    };
    recognitionRef.current.onerror = () => setListening(false);
    recognitionRef.current.onend = () => setListening(false);
    recognitionRef.current.start();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = {
      sender: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL || ""}/api/remedy`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ symptoms: input }),
        }
      );
      const data = await res.json();
      setMessages((msgs) => [
        ...msgs,
        {
          sender: "bot",
          text: data.remedy || data.error || "Sorry, something went wrong.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (error) {
      setMessages((msgs) => [
        ...msgs,
        {
          sender: "bot",
          text: "Sorry, something went wrong.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="herba-app">
      <div className="herba-header">
        Herba - Your Personal Health Assistant
        <span className="herba-header-icons">
          <span className="herba-sound-icon" title="Voice supported">
            <svg width="20" height="20" viewBox="0 0 16 16"><path fill="#fff" d="M8 12a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3zm5-3a.5.5 0 0 0-1 0 4 4 0 0 1-8 0 .5.5 0 0 0-1 0 5 5 0 0 0 10 0zm-5 4.5A1.5 1.5 0 0 0 8 15a1.5 1.5 0 0 0 1.5-1.5h-3z"/></svg>
          </span>
        </span>
      </div>
      <div className="herba-chat-area">
        {messages.map((msg, idx) => (
          <div key={idx} className={`herba-msg herba-msg-${msg.sender}`}>
            <div className="herba-msg-text">{msg.text}</div>
            <div className="herba-msg-time">{msg.timestamp}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form className="herba-input-bar" onSubmit={handleSubmit} autoComplete="off">
        <input
          type="text"
          className="herba-input"
          placeholder="Type your health concern..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading || listening}
        />
        <button
          type="button"
          className={`herba-voice-btn ${listening ? "listening" : ""}`}
          title="Speak"
          onClick={startListening}
          disabled={loading || listening}
        >
          <svg width="24" height="24" viewBox="0 0 24 24"><path fill={listening ? "#00897B" : "#1976d2"} d="M12 14a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3zm5-3a.75.75 0 0 0-1.5 0A3.5 3.5 0 0 1 8.5 11a.75.75 0 0 0-1.5 0A5 5 0 0 0 12 16a5 5 0 0 0 5-5z"></path></svg>
        </button>
        <button
          type="submit"
          className="herba-send-btn"
          disabled={loading || !input.trim()}
          title="Send"
        >
          <svg width="28" height="28" viewBox="0 0 24 24"><path fill="#1976d2" d="M2 21v-6l16-3-16-3V3l20 9z"/></svg>
        </button>
      </form>
      <div className="herba-disclaimer">
        <b>Disclaimer:</b> The information provided by Herba - your personal health assistant is for general informational purposes only, and does not constitute medical advice. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read or heard from this AI. If you think you may have a medical emergency, call your doctor or emergency services immediately.
      </div>
    </div>
  );
}

export default App;
