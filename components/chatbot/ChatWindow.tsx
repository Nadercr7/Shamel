
import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import type { ChatMessage } from '../../types';
import useSpeechToText from '../../hooks/useSpeechToText';
import { TextToSpeechContext } from '../../context/TextToSpeechContext';
import { AccessibilityContext } from '../../context/AccessibilityContext';
import { LanguageContext } from '../../context/LanguageContext';
import { SendIcon, MicrophoneIcon, CloseIcon, BotIcon, UserIcon } from '../../assets/Icons';

const createChatSession = (lang: 'en' | 'ar'): Chat | null => {
    try {
        if (!process.env.API_KEY) {
            console.error("API_KEY environment variable not set.");
            return null;
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const systemInstruction = lang === 'ar' 
            ? "أنت مساعد تعليمي ودود ومشجع ومتاح للجميع. هدفك هو مساعدة الطلاب من جميع القدرات على التعلم. اجعل إجاباتك موجزة وواضحة وإيجابية. إذا طُلب منك توصيات، فقدم دورات مفيدة عبر الإنترنت أو خرائط طريق تعليمية أو موارد دراسية. اطرح أسئلة توضيحية إذا كان استعلام المستخدم غامضًا. أنت تفهم وتستجيب باللغة العربية."
            : "You are a friendly, encouraging, and accessible educational assistant. Your goal is to help students of all abilities learn. Keep your answers concise, clear, and positive. If asked for recommendations, provide helpful online courses, learning roadmaps, or study resources. Ask clarifying questions if the user's query is ambiguous. You can understand and respond in multiple languages.";

        return ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction,
            },
        });
    } catch (error) {
        console.error("Failed to initialize chat session:", error);
        return null;
    }
};

const TypingIndicator = () => (
    <div className="flex items-center space-x-1.5 p-2">
      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
);


const ChatWindow: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { isHighContrast } = useContext(AccessibilityContext);
    const { language, t, dir } = useContext(LanguageContext);

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatSession, setChatSession] = useState<Chat | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    
    const { speak } = useContext(TextToSpeechContext);
    
    const { isListening, transcript, startListening, stopListening } = useSpeechToText({
      onResult: (result) => {
        setInput(result);
      },
      lang: language === 'ar' ? 'ar-SA' : 'en-US',
    });

    useEffect(() => {
        setChatSession(createChatSession(language));
        setMessages([{ role: 'model', text: t('chatGreeting') }]);
    }, [language, t]);

    useEffect(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, [messages]);

    useEffect(() => {
        if (transcript) {
            setInput(transcript);
        }
    }, [transcript]);


    const sendMessage = useCallback(async () => {
        if (!input.trim() || !chatSession) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const stream = await chatSession.sendMessageStream({ message: input });
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', text: '' }]);

            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = modelResponse;
                    return newMessages;
                });
            }
            speak(modelResponse, language === 'ar' ? 'ar-SA' : 'en-US');
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = language === 'ar' ? "عذراً، أواجه مشكلة في الاتصال الآن." : "Sorry, I'm having trouble connecting right now.";
            setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage.role === 'model' && lastMessage.text === '') {
                    lastMessage.text = errorMessage;
                } else {
                    newMessages.push({ role: 'model', text: errorMessage });
                }
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    }, [input, chatSession, speak, language]);

    const handleMicClick = () => {
      if (isListening) {
        stopListening();
      } else {
        setInput('');
        startListening();
      }
    };
    
    const theme = isHighContrast
        ? {
            bg: 'bg-high-contrast-bg',
            text: 'text-high-contrast-text',
            border: 'border-high-contrast-text',
            inputBg: 'bg-black',
            headerBg: 'bg-black border-b border-high-contrast-text',
            micButton: 'bg-high-contrast-secondary text-high-contrast-bg',
            sendButton: 'bg-high-contrast-primary text-high-contrast-bg',
            userBubble: 'bg-gray-800 border border-high-contrast-text',
            modelBubble: 'bg-gray-900 border border-high-contrast-text',
        }
        : {
            bg: 'bg-base-200/50 backdrop-blur-lg',
            text: 'text-base-content',
            border: 'border-base-300/50',
            inputBg: 'bg-white',
            headerBg: 'bg-gradient-to-br from-primary to-primary-dark text-white',
            micButton: 'bg-secondary text-white',
            sendButton: 'bg-primary text-white',
            userBubble: 'bg-gradient-to-br from-primary-light to-primary text-white',
            modelBubble: 'bg-white text-base-content shadow-sm',
        };
    
    const userBubbleRounded = dir === 'rtl' ? 'rounded-es-xl' : 'rounded-ss-xl';
    const modelBubbleRounded = dir === 'rtl' ? 'rounded-ss-xl' : 'rounded-es-xl';

    return (
        <div className={`fixed bottom-24 w-11/12 max-w-md h-3/4 max-h-[70vh] rounded-2xl shadow-2xl flex flex-col z-40 border ${theme.bg} ${theme.text} ${theme.border} ${dir === 'rtl' ? 'left-5' : 'right-5'} animate-fade-in-up`}>
            <header className={`flex items-center justify-between p-4 rounded-t-2xl ${theme.headerBg}`}>
                <h3 className="font-bold text-lg">{t('chatTitle')}</h3>
                <button onClick={onClose} aria-label="Close chat" className="p-1 rounded-full hover:bg-black/20 transition-colors">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </header>

            <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary text-white`}><BotIcon className="w-5 h-5"/></div>}
                        <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.role === 'user' ? `${userBubbleRounded} ${theme.userBubble}` : `${modelBubbleRounded} ${theme.modelBubble}`}`}>
                            {msg.text ? <p className="whitespace-pre-wrap">{msg.text}</p> : <TypingIndicator />}
                        </div>
                        {msg.role === 'user' && <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-secondary text-white`}><UserIcon className="w-5 h-5"/></div>}
                    </div>
                ))}
            </div>

            <footer className={`p-2 border-t bg-base-100/50 ${theme.border} rounded-b-2xl`}>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
                        placeholder={isListening ? t('chatListening') : t('chatPlaceholder')}
                        disabled={isLoading}
                        className={`flex-1 p-3 rounded-lg border-2 focus:outline-none focus:ring-2 ${theme.inputBg} ${isHighContrast ? 'border-high-contrast-text focus:ring-high-contrast-primary' : 'border-base-300 focus:ring-primary'}`}
                    />
                     <button
                        onClick={handleMicClick}
                        disabled={isLoading}
                        aria-label={isListening ? 'Stop listening' : 'Start listening'}
                        className={`p-3 rounded-full transition-all transform hover:scale-110 ${isListening ? `bg-red-500 text-white animate-pulse-fast` : theme.micButton} disabled:opacity-50`}
                    >
                        <MicrophoneIcon className="w-6 h-6" />
                    </button>
                    <button
                        onClick={sendMessage}
                        disabled={isLoading || !input.trim()}
                        aria-label="Send message"
                        className={`p-3 rounded-full transition-all transform hover:scale-110 ${theme.sendButton} disabled:opacity-50 disabled:scale-100`}
                    >
                        <SendIcon className={`w-6 h-6 ${dir === 'rtl' ? 'transform -scale-x-100' : ''}`} />
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default ChatWindow;
