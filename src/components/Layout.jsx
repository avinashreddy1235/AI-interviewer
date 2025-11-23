import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-500 selection:text-white">
            <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen flex flex-col">
                <header className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-sky-600 rounded-lg flex items-center justify-center text-white">
                            <span className="font-bold text-lg">AI</span>
                        </div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-600">
                            Interview Partner
                        </h1>
                    </div>
                    <nav>
                        <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">About</a>
                    </nav>
                </header>
                <main className="flex-grow flex flex-col">
                    {children}
                </main>
                <footer className="mt-8 text-center text-gray-400 text-xs">
                    <p>© 2025 Interview Partner AI. Built for Eightfold.ai Assignment.</p>
                </footer>
            </div>
        </div>
    );
};

export default Layout;
