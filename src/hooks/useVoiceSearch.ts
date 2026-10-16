import { useState, useEffect } from 'react';

export const useVoiceSearch = (onResult: (text: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<any | null>(null);

  useEffect(() => {
    // Check Web Speech API availability
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setError(event.error);
        setIsListening(false);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onResult(transcript);
        }
      };

      setRecognition(rec);
    } else {
      setError('Speech recognition not supported in this browser.');
    }
  }, [onResult]);

  const startListening = () => {
    if (recognition) {
      try {
        recognition.start();
      } catch (e) {
        console.warn('Recognition already started:', e);
      }
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  return {
    isListening,
    error,
    startListening,
    stopListening,
    isSupported: !!recognition,
  };
};
