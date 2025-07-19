
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';

// Translations
const translations = {
  en: {
    // Navbar
    home: 'Home',
    summarizer: 'Summarizer',
    quiz: 'Quiz',
    // Header
    appTitle: 'Inclusive AI Learning Hub',
    toggleLanguage: 'Switch to Arabic',
    // Home Page
    welcomeTitle: 'Welcome to the Inclusive AI Learning Hub',
    welcomeMessage: "Your accessible gateway to knowledge. Use the navigation to explore our tools, including a PDF summarizer and an interactive quiz game. Our AI assistant is always here to help in the bottom corner.",
    exploreSummarizer: 'Explore Summarizer',
    exploreQuiz: 'Explore Quiz',
    quizGameDescription: 'Test your knowledge with fun and interactive quizzes on various subjects.',
    // PDF Summarizer
    pdfSummarizerTitle: 'PDF Summarizer & Reader',
    pdfSummarizerDescription: 'Upload a PDF document to get a concise summary. Then, have it read aloud to you.',
    selectPdf: 'Select a PDF',
    summarize: 'Summarize',
    summarizing: 'Summarizing...',
    summaryPlaceholder: 'Summary will appear here...',
    readAloud: 'Read Aloud',
    stopReading: 'Stop Reading',
    uploadError: 'Please upload a PDF file first.',
    summarizeError: 'Failed to summarize: {message}',
    // Quiz Game
    quizTitle: 'Quiz Challenge',
    questionOf: 'Question {current} of {total}',
    score: 'Score: {score}',
    correct: 'Correct!',
    incorrect: 'Incorrect',
    playAgain: 'Play Again',
    quizComplete: 'Quiz Complete!',
    finalScore: 'Your final score is: {score} / {total}',
    nextQuestion: 'Next Question',
    finishQuiz: 'Finish Quiz',
    // Chatbot
    chatTitle: 'AI Learning Assistant',
    chatGreeting: 'Hello! How can I help you learn today?',
    chatPlaceholder: 'Ask me anything...',
    chatListening: 'Listening...',
  },
  ar: {
    // Navbar
    home: 'الرئيسية',
    summarizer: 'الملخص',
    quiz: 'الاختبار',
    // Header
    appTitle: 'مركز التعلم الشامل بالذكاء الاصطناعي',
    toggleLanguage: 'Switch to English',
    // Home Page
    welcomeTitle: 'أهلاً بكم في مركز التعلم الشامل بالذكاء الاصطناعي',
    welcomeMessage: "بوابتك الميسرة للمعرفة. استخدم شريط التنقل لاستكشاف أدواتنا، بما في ذلك ملخص PDF ولعبة اختبار تفاعلية. مساعدنا الذكي موجود دائمًا للمساعدة في الزاوية السفلية.",
    exploreSummarizer: 'استكشف الملخص',
    exploreQuiz: 'استكشف الاختبار',
    quizGameDescription: 'اختبر معلوماتك مع اختبارات ممتعة وتفاعلية في مواضيع مختلفة.',
    // PDF Summarizer
    pdfSummarizerTitle: 'ملخص وقارئ PDF',
    pdfSummarizerDescription: 'قم بتحميل مستند PDF للحصول على ملخص موجز. ثم، اجعله يقرأه لك بصوت عالٍ.',
    selectPdf: 'اختر ملف PDF',
    summarize: 'تلخيص',
    summarizing: 'جاري التلخيص...',
    summaryPlaceholder: 'سيظهر الملخص هنا...',
    readAloud: 'اقرأ بصوت عالٍ',
    stopReading: 'إيقاف القراءة',
    uploadError: 'يرجى تحميل ملف PDF أولاً.',
    summarizeError: 'فشل التلخيص: {message}',
    // Quiz Game
    quizTitle: 'تحدي الاختبار',
    questionOf: 'سؤال {current} من {total}',
    score: 'النتيجة: {score}',
    correct: 'صحيح!',
    incorrect: 'غير صحيح',
    playAgain: 'العب مرة أخرى',
    quizComplete: 'اكتمل الاختبار!',
    finalScore: 'نتيجتك النهائية هي: {score} / {total}',
    nextQuestion: 'السؤال التالي',
    finishQuiz: 'إنهاء الاختبار',
    // Chatbot
    chatTitle: 'مساعد التعلم بالذكاء الاصطناعي',
    chatGreeting: 'أهلاً بك! كيف يمكنني مساعدتك في التعلم اليوم؟',
    chatPlaceholder: 'اسألني أي شيء...',
    chatListening: 'يستمع...',
  }
};

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en, replacements?: Record<string, string | number>) => string;
  dir: 'ltr' | 'rtl';
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
  dir: 'ltr',
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  const t = useCallback((key: keyof typeof translations.en, replacements?: Record<string, string | number>): string => {
    let translation = (translations[language] && translations[language][key]) || translations['en'][key];
    if (replacements) {
      Object.keys(replacements).forEach(rKey => {
        translation = translation.replace(`{${rKey}}`, String(replacements[rKey]));
      });
    }
    return translation;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};
