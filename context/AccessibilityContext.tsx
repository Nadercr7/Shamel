
import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface AccessibilityContextType {
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

export const AccessibilityContext = createContext<AccessibilityContextType>({
  isHighContrast: false,
  toggleHighContrast: () => {},
  fontSize: 16,
  increaseFontSize: () => {},
  decreaseFontSize: () => {},
});

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16); // Base font size

  useEffect(() => {
    const root = document.documentElement;
    if (isHighContrast) {
      root.classList.add('high-contrast');
      root.style.backgroundColor = '#000';
      root.style.color = '#fff';
    } else {
      root.classList.remove('high-contrast');
      root.style.backgroundColor = '';
      root.style.color = '';
    }
  }, [isHighContrast]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  const toggleHighContrast = () => {
    setIsHighContrast(prev => !prev);
  };

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24)); // Cap at 24px
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12)); // Floor at 12px
  };

  return (
    <AccessibilityContext.Provider value={{ isHighContrast, toggleHighContrast, fontSize, increaseFontSize, decreaseFontSize }}>
      {children}
    </AccessibilityContext.Provider>
  );
};
