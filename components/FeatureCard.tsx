
import React, { ReactNode, useContext } from 'react';
import { AccessibilityContext } from '../context/AccessibilityContext';

interface FeatureCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, icon, children }) => {
  const { isHighContrast } = useContext(AccessibilityContext);

  return (
    <div
      className={`rounded-2xl shadow-xl overflow-hidden transition-all duration-300 h-full flex flex-col ${
        isHighContrast
          ? 'bg-high-contrast-bg border-2 border-high-contrast-text'
          : 'bg-white/60 backdrop-blur-xl border border-slate-200/80'
      }`}
    >
      <div
        className={`flex items-center p-5 border-b ${
          isHighContrast ? 'border-high-contrast-text' : 'border-slate-200/80'
        }`}
      >
        <div className={isHighContrast ? 'text-high-contrast-primary' : 'text-primary'}>
            {icon}
        </div>
        <h2 className="text-xl font-bold ml-3">{title}</h2>
      </div>
      <div className="p-6 flex-grow">{children}</div>
    </div>
  );
};

export default FeatureCard;
