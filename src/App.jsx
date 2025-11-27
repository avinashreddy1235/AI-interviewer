import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { InterviewProvider, useInterview } from './context/InterviewContext';
import Layout from './components/Layout';
import Hero from './components/Hero';
import InterviewSession from './components/InterviewSession';
import FeedbackReport from './components/FeedbackReport';
import History from './pages/History';
import InterviewDetail from './pages/InterviewDetail';

const Home = () => {
  const { status } = useInterview();

  return (
    <>
      {status === 'idle' && <Hero />}
      {(status === 'active' || status === 'loading') && <InterviewSession />}
      {status === 'feedback' && <FeedbackReport />}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <InterviewProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route path="/history/:id" element={<InterviewDetail />} />
          </Routes>
        </Layout>
      </InterviewProvider>
    </BrowserRouter>
  );
}

export default App;
