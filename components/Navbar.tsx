
import React, { useContext } from 'react';
import type { Page } from '../App';
import { AccessibilityContext } from '../context/AccessibilityContext';
import { LanguageContext } from '../context/LanguageContext';
import { SunIcon, MoonIcon, FontGrowIcon, FontShrinkIcon, LanguageIcon, HomeIcon, BookOpenIcon, PuzzleIcon, BotIcon } from '../assets/Icons';

interface NavbarProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage }) => {
  const { isHighContrast, toggleHighContrast, increaseFontSize, decreaseFontSize } = useContext(AccessibilityContext);
  const { language, setLanguage, t } = useContext(LanguageContext);

  const handleLanguageToggle = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const navLinks: { page: Page; labelKey: keyof typeof translations.en; icon: JSX.Element; }[] = [
    { page: 'home', labelKey: 'home', icon: <HomeIcon className="w-5 h-5" /> },
    { page: 'summarizer', labelKey: 'summarizer', icon: <BookOpenIcon className="w-5 h-5" /> },
    { page: 'quiz', labelKey: 'quiz', icon: <PuzzleIcon className="w-5 h-5" /> },
  ];

  const getNavLinkClass = (page: Page) => {
    const isActive = currentPage === page;
    if (isHighContrast) {
        return `flex items-center gap-2 px-3 py-2 rounded-md font-semibold transition-colors ${isActive ? 'bg-high-contrast-primary text-high-contrast-bg' : 'text-high-contrast-text hover:bg-high-contrast-secondary hover:text-high-contrast-bg'}`;
    }
    return `flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-colors ${isActive ? 'bg-primary-dark/80 text-white' : 'text-violet-100 hover:bg-primary-dark/50 hover:text-white'}`;
  }

  const baseButtonClass = 'p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const themeButtonClass = isHighContrast
    ? `${baseButtonClass} bg-black border border-high-contrast-secondary text-high-contrast-secondary hover:bg-high-contrast-secondary hover:text-black focus:ring-high-contrast-primary focus:ring-offset-black`
    : `${baseButtonClass} text-white hover:bg-primary-dark/50 focus:ring-white focus:ring-offset-primary`;

  return (
    <header className={`sticky top-0 z-30 shadow-lg ${isHighContrast ? 'bg-black text-high-contrast-text border-b border-high-contrast-text' : 'bg-primary/80 backdrop-blur-lg text-white'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xl font-bold">
              <BotIcon className="w-7 h-7" />
              <span className="hidden sm:block">LearnAI Hub</span>
            </div>
            <div className="flex items-baseline space-x-1 sm:space-x-2">
              {navLinks.map(({ page, labelKey, icon }) => (
                <button key={page} onClick={() => setCurrentPage(page)} className={getNavLinkClass(page)}>
                  {icon}
                  <span className="hidden md:block">{t(labelKey)}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={handleLanguageToggle}
              aria-label={t('toggleLanguage')}
              className={themeButtonClass}
            >
              <LanguageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={decreaseFontSize}
              aria-label="Decrease font size"
              className={themeButtonClass}
            >
              <FontShrinkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={increaseFontSize}
              aria-label="Increase font size"
              className={themeButtonClass}
            >
              <FontGrowIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={toggleHighContrast}
              aria-label="Toggle high contrast mode"
              className={themeButtonClass}
            >
              {isHighContrast ? <SunIcon className="w-5 h-5 sm:w-6 sm:h-6" /> : <MoonIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Dummy translations object to satisfy the type system for labelKey
const translations = {
    en: { home: '', summarizer: '', quiz: '' }
};

export default Navbar;
