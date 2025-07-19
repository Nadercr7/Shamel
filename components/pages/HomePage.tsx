
import React, { useContext } from 'react';
import type { Page } from '../../App';
import { LanguageContext } from '../../context/LanguageContext';
import { AccessibilityContext } from '../../context/AccessibilityContext';
import { BookOpenIcon, PuzzleIcon, ArrowRightIcon } from '../../assets/Icons';

interface HomePageProps {
    setCurrentPage: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
    const { t, dir } = useContext(LanguageContext);
    const { isHighContrast } = useContext(AccessibilityContext);

    const cardBaseClass = `text-left w-full rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 h-full flex flex-col group transform hover:-translate-y-2`;
    const cardThemeClass = isHighContrast
        ? 'bg-high-contrast-bg border-2 border-high-contrast-text'
        : 'bg-white/60 backdrop-blur-xl border border-slate-200/80';

    const renderCard = (page: Page, titleKey: string, descriptionKey: string, icon: JSX.Element) => (
      <button onClick={() => setCurrentPage(page)} className={`${cardBaseClass} ${cardThemeClass}`}>
        <div className={`flex items-center p-5 border-b ${isHighContrast ? 'border-high-contrast-text' : 'border-slate-200/80'}`}>
          <div className={isHighContrast ? 'text-high-contrast-primary' : 'text-primary'}>
              {icon}
          </div>
          <h2 className="text-2xl font-bold ml-4">{t(titleKey as any)}</h2>
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <p className="mb-6">{t(descriptionKey as any)}</p>
          <div className="mt-auto flex items-center font-semibold text-primary group-hover:text-primary-dark transition-colors">
            {t(page === 'summarizer' ? 'exploreSummarizer' : 'exploreQuiz')}
            <ArrowRightIcon className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 ${dir === 'rtl' ? 'transform -scale-x-100 -translate-x-1 group-hover:-translate-x-2' : ''} ${isHighContrast ? 'text-high-contrast-primary' : ''}`} />
          </div>
        </div>
      </button>
    );

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center p-8 rounded-xl mb-12">
                <h1 className={`text-4xl md:text-6xl font-black ${isHighContrast ? 'text-high-contrast-primary' : 'bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'}`}>
                    {t('welcomeTitle')}
                </h1>
                <p className={`mt-4 max-w-3xl mx-auto text-lg ${isHighContrast ? 'text-high-contrast-text' : 'text-base-content/80'}`}>
                    {t('welcomeMessage')}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {renderCard('summarizer', 'pdfSummarizerTitle', 'pdfSummarizerDescription', <BookOpenIcon className="w-10 h-10"/>)}
                {renderCard('quiz', 'quizTitle', 'quizGameDescription', <PuzzleIcon className="w-10 h-10"/>)}
            </div>
        </div>
    );
};

export default HomePage;
