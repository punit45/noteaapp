import React, { useState, useRef } from "react";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [inputText, setInputText] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Handle text input
  const handleTextInput = (e) => {
    setInputText(e.target.value);
  };

  // Handle URL input
  const handleUrlInput = (e) => {
    setInputUrl(e.target.value);
  };

  // Add text or URL as a note
  const addNote = () => {
    if (inputText.trim() || inputUrl.trim()) {
      const newNote = {
        id: Date.now(),
        text: inputText,
        url: inputUrl,
      };
      setNotes([...notes, newNote]);
      setInputText("");
      setInputUrl("");
    }
  };

  // Start audio transcription
  const startTranscription = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support the Web Speech API.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // Stop audio transcription
  const stopTranscription = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Delete a note
  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <div className="App">
      <h1>Note-Taking App</h1>
      <div className="input-container">
        <textarea
          placeholder="Enter your text here..."
          value={inputText}
          onChange={handleTextInput}
        />
        <input
          type="url"
          placeholder="Enter a URL..."
          value={inputUrl}
          onChange={handleUrlInput}
        />
        <button onClick={addNote}>Add Note</button>
      </div>
      <div className="audio-container">
        <button
          onClick={isListening ? stopTranscription : startTranscription}
          className={isListening ? "listening" : ""}
        >
          {isListening ? "Stop Listening" : "Start Audio Transcription"}
        </button>
      </div>
      <div className="notes-container">
        {notes.map((note) => (
          <div key={note.id} className="note">
            {note.text && <p>{note.text}</p>}
            {note.url && (
              <a href={note.url} target="_blank" rel="noopener noreferrer">
                {note.url}
              </a>
            )}
            <button onClick={() => deleteNote(note.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;