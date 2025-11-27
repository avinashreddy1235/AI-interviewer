import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { initializeGemini, startInterviewSession, sendMessage, generateFeedback } from '../services/gemini';
import { startListening, stopListening, speak, stopSpeaking } from '../services/voice';
import { saveInterview } from '../services/api';

const InterviewContext = createContext();

export const useInterview = () => useContext(InterviewContext);

export const InterviewProvider = ({ children }) => {
    const [status, setStatus] = useState('idle'); // idle, active, feedback, error
    const [currentRole, setCurrentRole] = useState('');
    const [questionLimit, setQuestionLimit] = useState(5);
    const [messages, setMessages] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Initialize Gemini with API key from env
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (apiKey) {
            initializeGemini(apiKey);
        } else {
            setError("API Key missing. Please check .env file.");
        }
    }, []);

    const startInterview = async (role, limit = 5) => {
        try {
            setStatus('loading');
            setCurrentRole(role);
            setQuestionLimit(limit);
            const initialMessage = await startInterviewSession(role, limit);
            setMessages([initialMessage]);
            setStatus('active');
            speakResponse(initialMessage.text);
        } catch (err) {
            console.error(err);
            setError("Failed to start interview. Please try again.");
            setStatus('idle');
        }
    };

    const speakResponse = (text) => {
        setIsSpeaking(true);
        speak(text,
            () => setIsSpeaking(true),
            () => {
                setIsSpeaking(false);
                // Auto-start listening after bot finishes speaking? 
                // For better UX, let's wait for user to click mic or auto-start if desired.
                // Let's make it manual for now to avoid loops.
            }
        );
    };

    const handleUserResponse = async (text) => {
        if (!text.trim()) return;

        // Add user message
        const userMsg = { text, role: 'user' };
        setMessages(prev => [...prev, userMsg]);

        try {
            // Get bot response
            const botMsg = await sendMessage(text);
            setMessages(prev => [...prev, botMsg]);
            speakResponse(botMsg.text);
        } catch (err) {
            console.error(err);
            setError("Failed to get response.");
        }
    };

    const toggleRecording = () => {
        if (isListening) {
            stopListening();
            setIsListening(false);
        } else {
            setIsListening(true);
            startListening(
                (text, isFinal) => {
                    setTranscript(text);
                    if (isFinal) {
                        stopListening();
                        setIsListening(false);
                        handleUserResponse(text);
                        setTranscript('');
                    }
                },
                () => setIsListening(false),
                (err) => {
                    console.error("Voice Error:", err);
                    setIsListening(false);
                }
            );
        }
    };

    const endInterview = async () => {
        setStatus('loading');
        try {
            const report = await generateFeedback(messages);
            setFeedback(report);

            // Save to backend
            try {
                await saveInterview({
                    date: new Date().toISOString(),
                    topic: currentRole || 'General Interview',
                    score: report.overallScore || 0,
                    feedback: report,
                    transcript: messages
                });
            } catch (saveError) {
                console.error("Failed to save interview history:", saveError);
            }

            setStatus('feedback');
        } catch (err) {
            console.error(err);
            setError("Failed to generate feedback.");
            setStatus('active'); // Go back to active if failed
        }
    };

    const resetInterview = () => {
        setStatus('idle');
        setMessages([]);
        setTranscript('');
        setFeedback(null);
        setCurrentRole('');
        stopSpeaking();
        stopListening();
    };

    return (
        <InterviewContext.Provider value={{
            status,
            currentRole,
            questionLimit,
            messages,
            isListening,
            isSpeaking,
            transcript,
            feedback,
            error,
            startInterview,
            toggleRecording,
            endInterview,
            handleUserResponse,
            resetInterview
        }}>
            {children}
        </InterviewContext.Provider>
    );
};
