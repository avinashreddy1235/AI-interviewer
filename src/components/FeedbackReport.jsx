import React from 'react';
import { useInterview } from '../context/InterviewContext';
import { RefreshCw, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const FeedbackReport = () => {
    const { feedback, resetInterview } = useInterview();

    // Fallback if feedback is still string (old format or error)
    if (typeof feedback === 'string') {
        return (
            <div className="flex flex-col h-full animate-fade-in p-8">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
                    <h3 className="font-bold mb-2">Format Error</h3>
                    <p>Received unstructured feedback. Please try again.</p>
                    <pre className="mt-4 text-xs bg-white p-4 rounded border border-red-100 overflow-auto max-h-40">
                        {feedback}
                    </pre>
                    <button onClick={resetInterview} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg">Try Again</button>
                </div>
            </div>
        );
    }

    if (!feedback) return null;

    const { overallScore, summary, skills, keyHighlights, detailedFeedback } = feedback;

    return (
        <div className="flex flex-col h-full animate-fade-in overflow-y-auto custom-scrollbar bg-gray-50">
            <div className="p-8 max-w-6xl mx-auto w-full space-y-8">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Interview Analysis</h2>
                        <p className="text-gray-500 mt-1">Comprehensive performance review</p>
                    </div>
                    <button
                        onClick={resetInterview}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 font-semibold"
                    >
                        <RefreshCw size={20} />
                        Start New Interview
                    </button>
                </div>

                {/* Top Section: Score & Skills */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Overall Score Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-sky-500"></div>
                        <h3 className="text-gray-500 font-medium mb-4 uppercase tracking-wider text-sm">Overall Score</h3>
                        <div className="relative flex items-center justify-center w-40 h-40">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    className="text-gray-100"
                                />
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    strokeDasharray={440}
                                    strokeDashoffset={440 - (440 * overallScore) / 100}
                                    className="text-blue-600 transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <span className="absolute text-5xl font-bold text-gray-900">{overallScore}</span>
                        </div>
                        <p className="mt-6 text-gray-600 text-sm leading-relaxed max-w-xs">{summary}</p>
                    </div>

                    {/* Skills Chart */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                        <h3 className="text-gray-900 font-bold mb-6 flex items-center gap-2">
                            <TrendingUp size={20} className="text-blue-600" />
                            Skill Breakdown
                        </h3>
                        <div className="flex-grow min-h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={skills} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                                    <XAxis type="number" domain={[0, 100]} hide />
                                    <YAxis dataKey="name" type="category" width={120} tick={{ fill: '#4b5563', fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        cursor={{ fill: '#f9fafb' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={24}>
                                        {skills.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.score >= 80 ? '#2563eb' : entry.score >= 60 ? '#60a5fa' : '#93c5fd'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Key Highlights */}
                <div className="bg-gradient-to-br from-blue-600 to-sky-600 rounded-2xl p-8 text-white shadow-lg shadow-blue-500/20">
                    <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                        <CheckCircle size={24} className="text-blue-200" />
                        Key Highlights
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        {keyHighlights.map((highlight, idx) => (
                            <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <p className="text-blue-50 leading-relaxed">{highlight}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detailed Feedback Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {detailedFeedback.map((section, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                                {section.category === 'Strengths' ? (
                                    <CheckCircle size={20} className="text-green-500" />
                                ) : (
                                    <AlertCircle size={20} className="text-amber-500" />
                                )}
                                {section.category}
                            </h3>
                            <ul className="space-y-3">
                                {section.points.map((point, pIdx) => (
                                    <li key={pIdx} className="flex gap-3 text-gray-600 text-sm leading-relaxed">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0"></span>
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default FeedbackReport;
