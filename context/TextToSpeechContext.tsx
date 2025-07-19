
import React, { createContext, ReactNode, useContext } from 'react';
import useTextToSpeech from '../hooks/useTextToSpeech';

interface TextToSpeechContextType {
    speak: (text: string, lang?: string) => Promise<void>;
    cancel: () => void;
    isSpeaking: boolean;
}

const defaultState: TextToSpeechContextType = {
    speak: async () => {},
    cancel: () => {},
    isSpeaking: false,
};

export const TextToSpeechContext = createContext<TextToSpeechContextType>(defaultState);

export const TextToSpeechProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const tts = useTextToSpeech();

    return (
        <TextToSpeechContext.Provider value={tts}>
            {children}
        </TextToSpeechContext.Provider>
    );
};
