import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, VolumeX, Radio } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AzureSpeechProps {
  onTranscription?: (text: string) => void;
  onSpeechEnd?: () => void;
}

export default function AzureSpeech({ onTranscription, onSpeechEnd }: AzureSpeechProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Speak now - Azure Speech is listening",
      });
    } catch (error) {
      toast({
        title: "Microphone Error",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  }, [isRecording]);

  const processAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const response = await fetch('/api/speech/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok && data.text) {
        setTranscript(data.text);
        onTranscription?.(data.text);
        
        toast({
          title: "Speech Recognized",
          description: `"${data.text.substring(0, 50)}${data.text.length > 50 ? '...' : ''}"`,
        });
      } else {
        throw new Error(data.error || 'Transcription failed');
      }
    } catch (error: any) {
      toast({
        title: "Transcription Error",
        description: error.message || "Failed to process speech",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const speakText = async (text: string) => {
    if (!text.trim()) return;

    setIsSpeaking(true);
    try {
      const response = await fetch('/api/speech/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Speech synthesis failed');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsSpeaking(false);
        onSpeechEnd?.();
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsSpeaking(false);
        toast({
          title: "Playback Error",
          description: "Could not play synthesized speech",
          variant: "destructive",
        });
      };

      await audio.play();
    } catch (error: any) {
      setIsSpeaking(false);
      toast({
        title: "Speech Synthesis Error",
        description: error.message || "Failed to synthesize speech",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Radio className="w-5 h-5 text-blue-400" />
          Azure Speech • HACP™ Live Voice
          <Badge variant="outline" className="ml-auto border-blue-500/30 text-blue-400">
            {isRecording ? 'Recording' : isSpeaking ? 'Speaking' : isProcessing ? 'Processing' : 'Ready'}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Recording Controls */}
        <div className="flex gap-2">
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing || isSpeaking}
            className={`flex-1 ${
              isRecording 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isRecording ? (
              <>
                <MicOff className="w-4 h-4 mr-2" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                Start Recording
              </>
            )}
          </Button>
          
          <Button
            onClick={() => speakText(transcript)}
            disabled={!transcript || isRecording || isSpeaking || isProcessing}
            variant="outline"
            className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
          >
            {isSpeaking ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-center gap-2 text-blue-400">
            <div className="w-4 h-4 border-2 border-blue-400/20 border-t-blue-400 rounded-full animate-spin" />
            <span className="text-sm">Processing speech with Azure...</span>
          </div>
        )}

        {/* Recording Indicator */}
        {isRecording && (
          <div className="flex items-center gap-2 text-red-400">
            <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" />
            <span className="text-sm">Recording audio...</span>
          </div>
        )}

        {/* Transcript Display */}
        {transcript && (
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <h4 className="text-sm font-medium text-slate-300 mb-2">Last Transcription:</h4>
            <p className="text-white text-sm">{transcript}</p>
          </div>
        )}

        {/* Voice Instructions */}
        <div className="text-xs text-slate-400 text-center">
          <p>Click record → speak clearly → stop to transcribe</p>
          <p>Azure Speech API provides real-time voice processing</p>
        </div>
      </CardContent>
    </Card>
  );
}