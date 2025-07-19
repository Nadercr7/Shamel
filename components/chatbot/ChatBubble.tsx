
import React, { useContext } from 'react';
import { ChatIcon, CloseIcon } from '../../assets/Icons';
import { AccessibilityContext } from '../../context/AccessibilityContext';

interface ChatBubbleProps {
    onClick: () => void;
    isOpen: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ onClick, isOpen }) => {
    const { isHighContrast } = useContext(AccessibilityContext);
    
    const themeClass = isHighContrast
        ? 'bg-high-contrast-primary text-high-contrast-bg hover:bg-high-contrast-secondary'
        : 'bg-primary text-white hover:bg-primary-dark';

    return (
        <button
            onClick={onClick}
            aria-label={isOpen ? "Close chat" : "Open chat"}
            className={`fixed bottom-5 right-5 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transform transition-all duration-300 ease-in-out z-50 focus:outline-none focus:ring-4 ${
                isHighContrast ? 'focus:ring-high-contrast-primary' : `focus:ring-primary-light ${!isOpen ? 'animate-glow' : ''}`
            } ${themeClass} ${isOpen ? 'rotate-90 scale-110' : 'rotate-0 scale-100'}`}
        >
            <div className={`transition-transform duration-300 ${isOpen ? 'rotate-0' : 'rotate-0'}`}>
                {isOpen ? <CloseIcon className="w-8 h-8" /> : <ChatIcon className="w-8 h-8" />}
            </div>
        </button>
    );
};

export default ChatBubble;
