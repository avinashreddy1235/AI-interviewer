import React, { useState } from 'react';
import { useInterview } from '../context/InterviewContext';
import { Briefcase, ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
    const { startInterview, error } = useInterview();
    const [role, setRole] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (role.trim()) {
            startInterview(role);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center flex-grow text-center space-y-8 animate-fade-in">
            <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-sm font-medium">
                    <Sparkles size={14} />
                    <span>AI-Powered Interview Practice</span>
                </div>
                <h2 className="text-5xl font-bold tracking-tight text-gray-900">
                    Master Your Next <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-600">
                        Job Interview
                    </span>
                </h2>
                <p className="text-gray-600 text-lg">
                    Practice with an intelligent AI agent that adapts to your role, asks follow-up questions, and provides detailed feedback.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <Briefcase size={20} />
                    </div>
                    <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="Enter target role (e.g. Product Manager)"
                        className="block w-full pl-10 pr-4 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                        required
                    />
                </div>

                {error && (
                    <div className="text-red-600 text-sm bg-red-50 p-2 rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!role.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                >
                    Start Interview
                    <ArrowRight size={20} />
                </button>
            </form>

            <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mt-12 w-full max-w-2xl">
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                    <span className="font-semibold text-gray-900">Voice Interaction</span>
                    <span>Speak naturally</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                    <span className="font-semibold text-gray-900">Real-time AI</span>
                    <span>Adaptive questions</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                    <span className="font-semibold text-gray-900">Instant Feedback</span>
                    <span>Detailed analysis</span>
                </div>
            </div>
        </div>
    );
};

export default Hero;
