import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getInterviews } from '../services/api';
import { Calendar, ChevronRight, Award } from 'lucide-react';

const History = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const data = await getInterviews();
                setInterviews(data);
            } catch (err) {
                setError('Failed to load interview history.');
            } finally {
                setLoading(false);
            }
        };

        fetchInterviews();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 p-8 bg-red-50 rounded-lg">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Interview History</h2>

            {interviews.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 mb-4">No interviews recorded yet.</p>
                    <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
                        Start your first interview
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {interviews.map((interview) => (
                        <Link
                            key={interview.id}
                            to={`/history/${interview.id}`}
                            className="block bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-900 mb-1">{interview.topic}</h3>
                                    <div className="flex items-center text-gray-500 text-sm gap-4">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={16} />
                                            <span>{new Date(interview.date).toLocaleDateString()}</span>
                                        </div>
                                        {interview.score && (
                                            <div className="flex items-center gap-1 text-blue-600 font-medium">
                                                <Award size={16} />
                                                <span>Score: {interview.score}/100</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <ChevronRight className="text-gray-400" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
