import React, { useState } from "react";
import { useVoiceInput } from "../utils/voice";

function RemedyInput({ onSubmit, loading }) {
  const [symptoms, setSymptoms] = useState("");
  const [recording, startVoiceInput, stopVoiceInput] = useVoiceInput(setSymptoms);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (symptoms.trim()) {
      onSubmit(symptoms);
      setSymptoms("");
    }
  };

  return (
    <form className="herba-input-bar" onSubmit={handleSubmit} style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "18px 28px",
      borderTop: "1px solid #eee",
      background: "#f6f8fa"
    }}>
      <input
        type="text"
        value={symptoms}
        className="herba-input"
        onChange={e => setSymptoms(e.target.value)}
        placeholder="Type your health concern..."
        style={{
          flex: 1,
          padding: "12px 18px",
          borderRadius: 6,
          border: "none",
          background: "#333",
          color: "#fff",
          fontSize: "1rem",
          outline: "none",
        }}
        disabled={loading}
      />
      <button
        type="button"
        aria-label={recording ? "Stop recording" : "Start voice input"}
        onClick={recording ? stopVoiceInput : startVoiceInput}
        style={{
          background: "#00916e",
          border: "none",
          borderRadius: 6,
          padding: "8px 13px",
          color: "#fff",
          cursor: "pointer",
          fontSize: 20,
          transition: "background 0.2s",
          outline: recording ? "2px solid #00916e" : "none"
        }}
        disabled={loading}
      >
        <svg height="24" width="24" viewBox="0 0 24 24" fill="#fff">
          {recording ? (
            <rect x="7" y="7" width="10" height="10" rx="2" />
          ) : (
            <path d="M12 17a3.001 3.001 0 0 0 3-3V8a3 3 0 0 0-6 0v6a3.001 3.001 0 0 0 3 3zm5-5v1a5 5 0 0 1-10 0v-1H5v1a7 7 0 0 0 6 6.92V23h2v-3.08A7 7 0 0 0 19 13v-1z"/>
          )}
        </svg>
      </button>
      <button
        type="submit"
        aria-label="Send"
        style={{
          background: "#adb6c5",
          border: "none",
          borderRadius: 6,
          padding: "8px 13px",
          color: "#fff",
          cursor: "pointer",
          fontSize: 20,
          transition: "background 0.2s"
        }}
        disabled={loading || !symptoms.trim()}
      >
        <svg height="24" width="24" viewBox="0 0 24 24" fill="#444"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    </form>
  );
}

export default RemedyInput;
