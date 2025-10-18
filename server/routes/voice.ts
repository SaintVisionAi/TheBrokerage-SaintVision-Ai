import { Request, Response } from 'express';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

// Configure Azure Speech
const speechKey = process.env.AZURE_SPEECH_KEY!;
const speechRegion = process.env.AZURE_SPEECH_REGION!;

export function setupVoiceRoutes(app: any) {
  // Speech-to-Text endpoint
  app.post('/api/voice/speech-to-text', async (req: Request, res: Response) => {
    try {
      const { audioData } = req.body;
      
      // Convert base64 audio to buffer
      const audioBuffer = Buffer.from(audioData, 'base64');
      
      // Create speech config
      const speechConfig = sdk.SpeechConfig.fromSubscription(speechKey, speechRegion);
      speechConfig.speechRecognitionLanguage = 'en-US';
      
      // Create audio config from buffer
      const audioConfig = sdk.AudioConfig.fromWavFileInput(audioBuffer);
      
      // Create speech recognizer
      const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
      
      // Recognize speech
      recognizer.recognizeOnceAsync(
        (result) => {
          if (result.reason === sdk.ResultReason.RecognizedSpeech) {
            res.json({ 
              success: true, 
              text: result.text,
              confidence: 0.95
            });
          } else if (result.reason === sdk.ResultReason.NoMatch) {
            res.json({ 
              success: false, 
              error: 'No speech detected' 
            });
          } else {
            res.json({ 
              success: false, 
              error: 'Recognition canceled' 
            });
          }
          recognizer.close();
        },
        (error) => {
          console.error('Speech recognition error:', error);
          res.status(500).json({ 
            success: false, 
            error: 'Recognition failed' 
          });
          recognizer.close();
        }
      );
    } catch (error) {
      console.error('Speech-to-text error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to process audio' 
      });
    }
  });

  // Text-to-Speech endpoint
  app.post('/api/voice/text-to-speech', async (req: Request, res: Response) => {
    try {
      const { text, voice = 'en-US-JennyNeural' } = req.body;
      
      // Create speech config
      const speechConfig = sdk.SpeechConfig.fromSubscription(speechKey, speechRegion);
      speechConfig.speechSynthesisVoiceName = voice;
      speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;
      
      // Create speech synthesizer
      const synthesizer = new sdk.SpeechSynthesizer(speechConfig);
      
      // Synthesize speech
      synthesizer.speakTextAsync(
        text,
        (result) => {
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            // Convert audio data to base64
            const audioData = Buffer.from(result.audioData).toString('base64');
            res.json({ 
              success: true, 
              audioData,
              format: 'mp3'
            });
          } else {
            res.json({ 
              success: false, 
              error: 'Speech synthesis failed' 
            });
          }
          synthesizer.close();
        },
        (error) => {
          console.error('Text-to-speech error:', error);
          res.status(500).json({ 
            success: false, 
            error: 'Synthesis failed' 
          });
          synthesizer.close();
        }
      );
    } catch (error) {
      console.error('Text-to-speech error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to synthesize speech' 
      });
    }
  });

  // Get available voices
  app.get('/api/voice/voices', (req: Request, res: Response) => {
    res.json({
      success: true,
      voices: [
        { id: 'en-US-JennyNeural', name: 'Jenny (US)', gender: 'Female', style: 'Professional' },
        { id: 'en-US-GuyNeural', name: 'Guy (US)', gender: 'Male', style: 'Professional' },
        { id: 'en-US-AriaNeural', name: 'Aria (US)', gender: 'Female', style: 'Friendly' },
        { id: 'en-US-DavisNeural', name: 'Davis (US)', gender: 'Male', style: 'Confident' },
        { id: 'en-US-JaneNeural', name: 'Jane (US)', gender: 'Female', style: 'Business' },
        { id: 'en-US-JasonNeural', name: 'Jason (US)', gender: 'Male', style: 'Business' }
      ]
    });
  });
}