import React, { useState } from "react";
import { useSelector } from "react-redux";
import AllRoute from "./routes/AllRoute";
import Navbar from "./components/UserComponents/UserNavbar";
import { Box, Text } from "@chakra-ui/react";

const AccessibilityPanel = () => {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [highContrast, setHighContrast] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [largeText, setLargeText] = useState(false);
    const [dyslexiaFont, setDyslexiaFont] = useState(false);
    const [keyboardNav, setKeyboardNav] = useState(false);
    const [textToSpeech, setTextToSpeech] = useState(false);

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
        console.log("Panel toggled:", isPanelOpen); // Debugging
    };

    const handleToggle = (setter, className) => {
        setter(prev => {
            console.log(`Toggling ${className}:`, !prev); // Debugging
            document.body.classList.toggle(className, !prev); // Toggle class based on new state
            return !prev;
        });
    };

    const handleTextToSpeech = () => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(document.body.innerText);
            speechSynthesis.speak(utterance);
        } else {
            alert("Text-to-Speech is not supported in this browser.");
        }
    };

    const handleVoiceCommand = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.start();

            recognition.onresult = (event) => {
                const command = event.results[0][0].transcript.toLowerCase();
                console.log("Voice Command: ", command);

                if (command.includes("read page")) {
                    const utterance = new SpeechSynthesisUtterance(document.body.innerText);
                    speechSynthesis.speak(utterance);
                } else if (command.includes("open a course")) {
                    alert("Opening a course...");
                } else if (command.includes("close")) {
                    window.close();
                } else {
                    alert("Command not recognized. Try saying 'Read Page', 'Open a Course', or 'Close'.");
                }
            };
        } else {
            alert("Voice commands are not supported in this browser.");
        }
    };

    return (
        <div>
            <button id="accessibility-btn" onClick={togglePanel}>Accessibility</button>
            <div id="accessibility-panel" className={`accessibility-panel ${isPanelOpen ? 'open' : ''}`}>
                <h2>Accessibility Settings</h2>
                <label>
                    <input
                        type="checkbox"
                        checked={highContrast}
                        onChange={() => handleToggle(setHighContrast, 'high-contrast')}
                    /> High Contrast Mode
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={() => handleToggle(setDarkMode, 'dark-mode')}
                    /> Dark Mode
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={largeText}
                        onChange={() => handleToggle(setLargeText, 'large-text')}
                    /> Large Text
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={dyslexiaFont}
                        onChange={() => handleToggle(setDyslexiaFont, 'dyslexia-font')}
                    /> Dyslexia-Friendly Font
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={keyboardNav}
                        onChange={() => handleToggle(setKeyboardNav, 'keyboard-nav')}
                    /> Keyboard Navigation
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={textToSpeech}
                        onChange={() => {
                            setTextToSpeech(!textToSpeech);
                            handleTextToSpeech();
                        }}
                    /> Text-to-Speech
                </label>
                <button id="close-panel" onClick={togglePanel}>Close</button>
                <button id="voice-command-btn" onClick={handleVoiceCommand}>🎤 Voice Command</button>
            </div>
        </div>
    );
};

function App() {
    const userStore = useSelector((store) => store.UserReducer);

    return (
        <div className="App">
            {/* Render Navbar based on user role */}
            {userStore?.role === "admin" || userStore?.role === 'teacher' ? <Navbar /> : null}

            {/* Accessibility Panel */}
            <AccessibilityPanel />

            {/* Main Routes */}
            <AllRoute />
        </div>
    );
}

export default App;