import React, { useEffect, useRef, useState } from 'react';
import { useInterview } from '../context/InterviewContext';
import { Mic, MicOff, Square, Send, Volume2, VolumeX } from 'lucide-react';
import clsx from 'clsx';

const InterviewSession = () => {
    const {
        messages,
        isListening,
        isSpeaking,
        transcript,
        toggleRecording,
        endInterview,
        currentRole,
        handleUserResponse,
        isSpeechSupported
    } = useInterview();

    const messagesEndRef = useRef(null);
    const [inputText, setInputText] = useState('');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, transcript]);

    const handleTextSubmit = (e) => {
        e.preventDefault();
        if (inputText.trim()) {
            handleUserResponse(inputText);
            setInputText('');
        }
    };

    return (
        <div className="flex flex-col h-full max-h-[80vh] bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xl">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 p-4 flex justify-between items-center">
                <div>
                    <h3 className="font-semibold text-gray-900">Interview: {currentRole}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className={clsx("w-2 h-2 rounded-full", isListening ? "bg-red-500 animate-pulse" : "bg-green-500")}></span>
                        {isListening ? "Listening..." : "Active"}
                    </div>
                </div>
                <button
                    onClick={endInterview}
                    className="text-xs bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                    End Session
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gray-50/50">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={clsx(
                            "flex w-full",
                            msg.role === 'user' ? "justify-end" : "justify-start"
                        )}
                    >
                        <div className={clsx(
                            "max-w-[80%] rounded-2xl p-4 shadow-sm",
                            msg.role === 'user'
                                ? "bg-blue-600 text-white rounded-tr-none"
                                : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                        )}>
                            <p className="leading-relaxed">{msg.text}</p>
                        </div>
                    </div>
                ))}

                {/* Real-time transcript */}
                {transcript && (
                    <div className="flex w-full justify-end">
                        <div className="max-w-[80%] rounded-2xl p-4 shadow-sm bg-blue-50 text-blue-900 border border-blue-100 rounded-tr-none animate-pulse">
                            <p>{transcript}</p>
                        </div>
                    </div>
                )}

                {/* Loading indicator for bot */}
                {isSpeaking && !isListening && messages[messages.length - 1]?.role === 'user' && (
                    <div className="flex w-full justify-start">
                        <div className="bg-white border border-gray-100 rounded-2xl p-4 rounded-tl-none flex gap-1 items-center shadow-sm">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Controls */}
            <div className="bg-white border-t border-gray-100 p-6">
                <div className="flex items-center justify-center gap-6 mb-4">
                    <button
                        onClick={toggleRecording}
                        disabled={!isSpeechSupported}
                        className={clsx(
                            "w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg",
                            !isSpeechSupported
                                ? "bg-gray-300 cursor-not-allowed"
                                : isListening
                                    ? "bg-red-500 hover:bg-red-600 ring-4 ring-red-100 scale-110"
                                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                        )}
                    >
                        {isListening ? <Square size={24} fill="white" /> : <Mic size={28} />}
                    </button>
                </div>

                <form
                    onSubmit={handleTextSubmit}
                    className="flex gap-2 max-w-md mx-auto"
                >
                    <input
                        type="text"
                        name="textInput"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type your answer..."
                        className="flex-grow bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={!inputText.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={20} />
                    </button>
                </form>

                <p className="text-center text-gray-400 text-sm mt-4">
                    {!isSpeechSupported
                        ? "Voice interaction not supported in this browser"
                        : isListening
                            ? "Tap to stop speaking"
                            : "Tap microphone to speak or type below"
                    }
                </p>
            </div>
        </div>
    );
};

export default InterviewSession;
