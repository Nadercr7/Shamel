
import React, { useState } from 'react';
import ChatBubble from './ChatBubble';
import ChatWindow from './ChatWindow';

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => setIsOpen(prev => !prev);

    return (
        <>
            <ChatBubble onClick={toggleChat} isOpen={isOpen} />
            {isOpen && <ChatWindow onClose={toggleChat} />}
        </>
    );
};

export default Chatbot;
