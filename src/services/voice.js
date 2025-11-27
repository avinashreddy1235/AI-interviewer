// src/services/voice.js

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;

let recognition = null;
let synthesis = window.speechSynthesis;
let currentUtterance = null;

export const isSpeechSupported = () => {
    return !!SpeechRecognition && !!synthesis;
};

export const startListening = (onResult, onEnd, onError) => {
    if (!isSpeechSupported()) {
        console.error("Speech recognition not supported in this browser.");
        if (onError) onError("Speech recognition not supported");
        return;
    }

    if (recognition) {
        try {
            recognition.abort();
        } catch (e) {
            console.warn("Failed to abort previous recognition:", e);
        }
    }

    try {
        recognition = new SpeechRecognition();
        recognition.continuous = false; // Stop after one sentence
        recognition.lang = 'en-US';
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            if (event.results.length > 0) {
                const transcript = event.results[0][0].transcript;
                const isFinal = event.results[0].isFinal;
                onResult(transcript, isFinal);
            }
        };

        recognition.onend = () => {
            if (onEnd) onEnd();
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            if (onError) onError(event.error);
        };

        recognition.start();
        return recognition;
    } catch (error) {
        console.error("Failed to start speech recognition:", error);
        if (onError) onError(error.message);
        return null;
    }
};

export const stopListening = () => {
    if (recognition) {
        try {
            recognition.stop();
        } catch (e) {
            console.warn("Failed to stop recognition:", e);
        }
    }
};

export const speak = (text, onStart, onEnd) => {
    if (!synthesis) {
        console.error("Speech synthesis not supported.");
        return;
    }

    // Cancel any current speech
    synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Try to find a good voice
    const voices = synthesis.getVoices();
    // Wait for voices to load if they haven't yet (Chrome issue)
    if (voices.length === 0) {
        synthesis.onvoiceschanged = () => {
            const updatedVoices = synthesis.getVoices();
            setVoice(utterance, updatedVoices);
            synthesis.speak(utterance);
        };
    } else {
        setVoice(utterance, voices);
        synthesis.speak(utterance);
    }

    utterance.onstart = () => {
        if (onStart) onStart();
    };

    utterance.onend = () => {
        if (onEnd) onEnd();
    };

    utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        if (onEnd) onEnd(); // Ensure we reset state even on error
    };

    currentUtterance = utterance;
};

const setVoice = (utterance, voices) => {
    const preferredVoice = voices.find(v => v.name.includes('Google US English')) || voices.find(v => v.lang === 'en-US');
    if (preferredVoice) {
        utterance.voice = preferredVoice;
    }
};

export const stopSpeaking = () => {
    if (synthesis) {
        synthesis.cancel();
    }
};
