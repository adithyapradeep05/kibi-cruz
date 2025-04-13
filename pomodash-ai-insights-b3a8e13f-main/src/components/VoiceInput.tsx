
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface VoiceInputProps {
  onTranscriptionComplete: (text: string) => void;
  isDisabled?: boolean;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ 
  onTranscriptionComplete, 
  isDisabled = false 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setErrorMessage('Speech recognition is not supported in this browser.');
      return;
    }

    // Initialize SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    if (recognitionRef.current) {
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join(' ');
          
        // For demonstration purposes, we're using the latest final result
        if (event.results[event.results.length - 1].isFinal) {
          setIsProcessing(true);
          
          // Simulate processing time for analysis (in a real app, you'd send this to an API)
          setTimeout(() => {
            onTranscriptionComplete(transcript);
            setIsProcessing(false);
            setIsListening(false);
            
            if (recognitionRef.current) {
              recognitionRef.current.stop();
            }
            
            toast({
              title: "Voice input captured",
              description: "Your spoken tasks have been processed.",
            });
          }, 1000);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setErrorMessage(`Error: ${event.error}`);
        setIsListening(false);
        
        toast({
          title: "Voice input error",
          description: `Error: ${event.error}`,
          variant: "destructive"
        });
      };
    }
    
    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isDisabled) return;
    
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      setErrorMessage(null);
      
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
          
          // Add haptic feedback if available
          if (navigator.vibrate) {
            navigator.vibrate(20);
          }
          
          toast({
            title: "Listening...",
            description: "Speak clearly to log your tasks",
          });
        } catch (error) {
          console.error('Failed to start speech recognition:', error);
          setErrorMessage('Failed to start speech recognition');
          
          toast({
            title: "Failed to start voice input",
            description: "Please try again",
            variant: "destructive"
          });
        }
      }
    }
  };

  return (
    <div>
      <Button
        type="button"
        variant={isListening ? "destructive" : "outline"}
        size="icon"
        onClick={toggleListening}
        disabled={isDisabled || isProcessing}
        className={`rounded-full h-10 w-10 transition-all ${isListening ? 'animate-pulse bg-destructive text-destructive-foreground' : ''}`}
      >
        {isProcessing ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : isListening ? (
          <MicOff className="h-5 w-5" />
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </Button>
      
      {errorMessage && (
        <p className="text-destructive text-sm mt-2">{errorMessage}</p>
      )}
    </div>
  );
};

export default VoiceInput;
