import React from 'react';
import { InterviewProvider, useInterview } from './context/InterviewContext';
import Layout from './components/Layout';
import Hero from './components/Hero';
import InterviewSession from './components/InterviewSession';
import FeedbackReport from './components/FeedbackReport';

const AppContent = () => {
  const { status } = useInterview();

  return (
    <Layout>
      {status === 'idle' && <Hero />}
      {(status === 'active' || status === 'loading') && <InterviewSession />}
      {status === 'feedback' && <FeedbackReport />}
    </Layout>
  );
};

function App() {
  return (
    <InterviewProvider>
      <AppContent />
    </InterviewProvider>
  );
}

export default App;
