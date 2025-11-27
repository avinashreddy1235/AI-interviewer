import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getInterviewById } from '../services/api';
import { ArrowLeft, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const InterviewDetail = () => {
    const { id } = useParams();
    const [interview, setInterview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInterview = async () => {
            try {
                const data = await getInterviewById(id);
                setInterview(data);
            } catch (err) {
                setError('Failed to load interview details.');
            } finally {
                setLoading(false);
            }
        };

        fetchInterview();
    }, [id]);

    if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
    if (error) return <div className="text-red-600 text-center p-12">{error}</div>;
    if (!interview) return <div className="text-center p-12">Interview not found</div>;

    // Parse feedback if it's a string (though our API handles this, double check)
    const feedbackData = typeof interview.feedback === 'string' ? JSON.parse(interview.feedback) : interview.feedback;
    const transcriptData = typeof interview.transcript === 'string' ? JSON.parse(interview.transcript) : interview.transcript;

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <Link to="/history" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                <ArrowLeft size={20} className="mr-2" />
                Back to History
            </Link>

            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{interview.topic} Interview</h1>
                <div className="flex items-center gap-4 text-gray-500">
                    <span>{new Date(interview.date).toLocaleDateString()} {new Date(interview.date).toLocaleTimeString()}</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        Score: {interview.score}/100
                    </span>
                </div>
            </header>

            <div className="space-y-8">
                {/* Feedback Section */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <CheckCircle className="text-green-500" />
                        Feedback Report
                    </h2>
                    <div className="prose prose-blue max-w-none">
                        {/* Assuming feedbackData has a structure we can render, or just markdown */}
                        {/* If feedbackData is an object with sections, render them. If it's the raw Gemini response, it might be markdown. */}
                        {/* Based on previous context, it seems to be markdown or structured text. Let's assume it's the raw text for now or handle object structure if known. */}
                        {/* If it is the JSON object from the previous conversation's structure: */}
                        {feedbackData.raw ? (
                            <ReactMarkdown>{feedbackData.raw}</ReactMarkdown>
                        ) : (
                            <div className="whitespace-pre-wrap">{JSON.stringify(feedbackData, null, 2)}</div>
                        )}
                    </div>
                </section>

                {/* Transcript Section */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <MessageSquare className="text-blue-500" />
                        Transcript
                    </h2>
                    <div className="space-y-6">
                        {Array.isArray(transcriptData) && transcriptData.map((msg, idx) => (
                            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                                    }`}>
                                    {msg.role === 'user' ? 'You' : 'AI'}
                                </div>
                                <div className={`flex-1 p-4 rounded-2xl ${msg.role === 'user' ? 'bg-blue-50 text-blue-900' : 'bg-gray-50 text-gray-800'
                                    }`}>
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default InterviewDetail;
