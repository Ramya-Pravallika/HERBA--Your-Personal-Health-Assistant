import { useState, useRef } from "react";

export function useVoiceInput(setText) {
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef(null);

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Your browser does not support voice input.");
      return;
    }
    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      setText(event.results[0][0].transcript);
      setRecording(false);
    };
    recognition.onerror = () => setRecording(false);
    recognition.onend = () => setRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setRecording(false);
  };

  return [recording, startVoiceInput, stopVoiceInput];
}
