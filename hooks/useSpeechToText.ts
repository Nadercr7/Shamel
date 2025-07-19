
import { useState, useEffect, useRef, useCallback } from 'react';

// Type definitions for the Web Speech API to fix TypeScript errors.
interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
  readonly resultIndex: number;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  start(): void;
  stop(): void;
}

// Augment the global Window object to include SpeechRecognition and its prefixed version.
declare global {
  interface Window {
    SpeechRecognition: { new(): SpeechRecognition };
    webkitSpeechRecognition: { new(): SpeechRecognition };
  }
}

interface SpeechToTextOptions {
    onResult?: (result: string) => void;
    lang?: string;
}

const useSpeechToText = (options?: SpeechToTextOptions) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const onResultRef = useRef(options?.onResult);

    useEffect(() => {
      onResultRef.current = options?.onResult;
    }, [options?.onResult]);

    useEffect(() => {
        if (typeof window === 'undefined' || (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window))) {
            console.error('Speech recognition not supported in this browser.');
            return;
        }
        
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        const recognition = recognitionRef.current;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = options?.lang || 'en-US';

        recognition.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
              setTranscript(finalTranscript);
              if (onResultRef.current) {
                onResultRef.current(finalTranscript);
              }
            }
        };

        recognition.onend = () => {
            setIsListening(false);
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            setIsListening(false);
        };

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.onresult = null;
                recognitionRef.current.onend = null;
                recognitionRef.current.onerror = null;
                recognitionRef.current.stop();
            }
        };
    }, [options?.lang]);

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            setTranscript('');
            recognitionRef.current.start();
            setIsListening(true);
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, [isListening]);

    return { isListening, transcript, startListening, stopListening };
};

export default useSpeechToText;
