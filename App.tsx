
import React, { useState, useContext } from 'react';
import { AccessibilityContext, AccessibilityProvider } from './context/AccessibilityContext';
import { LanguageProvider } from './context/LanguageContext';
import { TextToSpeechProvider } from './context/TextToSpeechContext';
import Navbar from './components/Navbar';
import Chatbot from './components/chatbot/Chatbot';
import HomePage from './components/pages/HomePage';
import SummarizerPage from './components/pages/SummarizerPage';
import QuizPage from './components/pages/QuizPage';

export type Page = 'home' | 'summarizer' | 'quiz';

const AppLayout: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { isHighContrast } = useContext(AccessibilityContext);

  const renderPage = () => {
    switch (currentPage) {
      case 'summarizer':
        return <SummarizerPage />;
      case 'quiz':
        return <QuizPage />;
      case 'home':
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className={`relative min-h-screen font-sans overflow-x-hidden ${isHighContrast ? 'bg-high-contrast-bg' : 'bg-base-100 text-base-content'}`}>
       {!isHighContrast && (
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-violet-50 via-rose-50 to-cyan-50 opacity-20 -z-10" />
       )}
       <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <main className="p-4 sm:p-6 lg:p-8 animate-fade-in-up">
            {renderPage()}
        </main>
        <Chatbot />
    </div>
  );
}

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AccessibilityProvider>
        <TextToSpeechProvider>
          <AppLayout />
        </TextToSpeechProvider>
      </AccessibilityProvider>
    </LanguageProvider>
  );
};

export default App;
