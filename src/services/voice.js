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
    if (!isSpeechSupported()) return;

    if (recognition) {
        recognition.abort();
    }

    recognition = new SpeechRecognition();
    recognition.continuous = false; // We want to stop after one sentence/utterance for turn-taking
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const isFinal = event.results[0].isFinal;
        onResult(transcript, isFinal);
    };

    recognition.onend = () => {
        if (onEnd) onEnd();
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        if (onError) onError(event.error);
    };

    recognition.start();
    return recognition;
};

export const stopListening = () => {
    if (recognition) {
        recognition.stop();
    }
};

export const speak = (text, onStart, onEnd) => {
    if (!synthesis) return;

    // Cancel any current speech
    synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Try to find a good voice
    const voices = synthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google US English')) || voices.find(v => v.lang === 'en-US');
    if (preferredVoice) {
        utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
        if (onStart) onStart();
    };

    utterance.onend = () => {
        if (onEnd) onEnd();
    };

    currentUtterance = utterance;
    synthesis.speak(utterance);
};

export const stopSpeaking = () => {
    if (synthesis) {
        synthesis.cancel();
    }
};
