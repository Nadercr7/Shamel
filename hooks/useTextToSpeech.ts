import { useState, useRef, useCallback, useEffect } from 'react';

// --- ElevenLabs API Configuration ---
// As requested, using the provided API key directly.
// For production, this should be an environment variable.
const ELEVENLABS_API_KEY = "sk_245e80971403c1e03b66fb839b7a56ac576920c60e5f2351";

// High-quality voice IDs from ElevenLabs
const VOICE_ID_ENGLISH = '21m00Tcm4TlvDq8ikWAM'; // Rachel (a popular, clear female voice)
const VOICE_ID_ARABIC = 'pNInz6obpgDQGcFmaJgB';  // Adam (versatile, supports multiple languages)

const useTextToSpeech = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    /**
     * Cancels any ongoing API request and stops audio playback.
     */
    const cancel = useCallback(() => {
        // Abort the fetch request if it's in flight
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        // Stop the audio player if it's playing
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = ''; // Release resource
            audioRef.current = null;
        }
        setIsSpeaking(false);
    }, []);

    /**
     * Speaks the given text using the ElevenLabs API.
     * @param text The text to convert to speech.
     * @param lang The language of the text (e.g., 'en-US', 'ar-SA').
     */
    const speak = useCallback(async (text: string, lang: string = 'en-US') => {
        // Stop any currently playing audio before starting a new one.
        cancel();

        if (!ELEVENLABS_API_KEY) {
            console.error("ElevenLabs API key is missing.");
            alert("ElevenLabs API key is not configured. Speech synthesis is disabled.");
            return;
        }
        if (!text.trim()) {
            return; // Don't make an API call for empty text
        }

        setIsSpeaking(true);

        const voiceId = lang.startsWith('ar') ? VOICE_ID_ARABIC : VOICE_ID_ENGLISH;
        const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
        const newAbortController = new AbortController();
        abortControllerRef.current = newAbortController;

        const headers = {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY,
        };

        const body = JSON.stringify({
            text,
            model_id: 'eleven_multilingual_v2', // Best model for multiple languages
            voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
                style: 0.1, // A little bit of style for more natural intonation
                use_speaker_boost: true,
            },
        });

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body,
                signal: newAbortController.signal,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`ElevenLabs API Error: ${response.status} ${errorText}`);
            }
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.startsWith('audio/')) {
                const errorText = await response.text();
                console.error("ElevenLabs API did not return audio. Response:", errorText);
                throw new Error("The API returned an unexpected response format instead of audio.");
            }

            const blob = await response.blob();
            const audioUrl = URL.createObjectURL(blob);
            const audio = new Audio(audioUrl);
            audioRef.current = audio;

            // Cleanup when playback finishes or errors out
            const cleanup = () => {
                setIsSpeaking(false);
                if (audioUrl) {
                    URL.revokeObjectURL(audioUrl);
                }
                audioRef.current = null;
            };

            audio.onended = cleanup;
            audio.onerror = () => {
                const errorMessage = audio.error ? `${audio.error.code}: ${audio.error.message}` : 'Unknown audio error';
                console.error("Audio playback error:", errorMessage);
                cleanup();
            };
            
            audio.play().catch(e => {
                console.error("Audio play failed:", e.message);
                cleanup();
            });

        } catch (error: any) {
            if (error.name !== 'AbortError') {
                console.error("Error with text-to-speech service:", error.message);
                alert(`Text-to-speech failed. Check the console for details. Error: ${error.message}`);
            }
            setIsSpeaking(false); // Reset state on error
        } finally {
            if (abortControllerRef.current === newAbortController) {
                abortControllerRef.current = null;
            }
        }
    }, [cancel]);

    // Ensure cleanup happens if the component unmounts.
    useEffect(() => {
        return () => {
            cancel();
        };
    }, [cancel]);

    return { speak, cancel, isSpeaking };
};

export default useTextToSpeech;