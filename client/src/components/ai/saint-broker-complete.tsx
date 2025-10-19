/**
 * 🤖 SAINTBROKER AI WIDGET - COMPLETE WITH VOICE & DOCS
 * 
 * Features:
 * - Voice-to-voice conversation (mic → AI speaks back)
 * - Speech-to-text input (speak your message)
 * - Text-to-speech responses (AI reads aloud)
 * - Document upload & Azure AI search
 * - 4 tabs: Chat, Docs, Notes, Signs
 * - Quick actions: Business Loan, Real Estate
 * - Premium gold/dark UI
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  Paperclip, 
  X,
  FileText,
  StickyNote,
  FileSignature,
  MessageSquare,
  DollarSign,
  Home,
  Loader2
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  audioUrl?: string;
}

interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════

export default function SaintBrokerWidget() {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'docs' | 'notes' | 'signs'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m SaintBroker AI. How can I help you today? You can type, speak, or upload documents.',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  
  // Voice features
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isVoiceMode, setIsVoiceMode] = useState(false); // Voice-to-voice mode
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // ═══════════════════════════════════════════════════════════
  // VOICE: SPEECH-TO-TEXT (USER SPEAKS)
  // ═══════════════════════════════════════════════════════════
  
  useEffect(() => {
    // Initialize Web Speech API
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        
        // If in voice mode, auto-send
        if (isVoiceMode) {
          handleSend(transcript);
        }
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
        
        // If in voice mode, restart listening after AI responds
        if (isVoiceMode && !isLoading) {
          setTimeout(() => startListening(), 1000);
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isVoiceMode, isLoading]);
  
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start recognition:', error);
      }
    }
  };
  
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };
  
  // ═══════════════════════════════════════════════════════════
  // VOICE: TEXT-TO-SPEECH (AI SPEAKS)
  // ═══════════════════════════════════════════════════════════
  
  const speakText = (text: string) => {
    if (!audioEnabled || typeof window === 'undefined') return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Use a natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes('Google') || 
      v.name.includes('Microsoft') ||
      v.name.includes('Samantha')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      
      // If in voice mode, restart listening
      if (isVoiceMode) {
        setTimeout(() => startListening(), 500);
      }
    };
    
    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };
  
  const stopSpeaking = () => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };
  
  // ═══════════════════════════════════════════════════════════
  // VOICE MODE: CONTINUOUS CONVERSATION
  // ═══════════════════════════════════════════════════════════
  
  const toggleVoiceMode = () => {
    if (isVoiceMode) {
      // Turn off voice mode
      setIsVoiceMode(false);
      stopListening();
      stopSpeaking();
    } else {
      // Turn on voice mode
      setIsVoiceMode(true);
      setAudioEnabled(true);
      startListening();
    }
  };
  
  // ═══════════════════════════════════════════════════════════
  // CHAT: SEND MESSAGE
  // ═══════════════════════════════════════════════════════════
  
  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;
    
    // Stop listening while processing
    stopListening();
    stopSpeaking();
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Call SaintBroker AI
      const response = await fetch('/api/saint-broker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
          context: {
            source: 'website_widget',
            hasDocuments: documents.length > 0,
          },
        }),
      });
      
      if (!response.ok) throw new Error('AI request failed');
      
      const data = await response.json();
      
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      
      // Speak the response if audio enabled
      if (audioEnabled) {
        speakText(data.response);
      }
      
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again or call us at (949) 755-0720.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // ═══════════════════════════════════════════════════════════
  // DOCUMENTS: UPLOAD & AZURE AI SEARCH
  // ═══════════════════════════════════════════════════════════
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setIsLoading(true);
    
    try {
      for (const file of Array.from(files)) {
        // Upload to storage
        const formData = new FormData();
        formData.append('file', file);
        
        const uploadResponse = await fetch('/api/upload-document', {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadResponse.ok) throw new Error('Upload failed');
        
        const { url, documentId } = await uploadResponse.json();
        
        // Add to documents list
        const newDoc: Document = {
          id: documentId,
          name: file.name,
          url,
          type: file.type,
          size: file.size,
          uploadedAt: new Date(),
        };
        setDocuments(prev => [...prev, newDoc]);
        
        // Analyze with Azure AI
        const analyzeResponse = await fetch('/api/analyze-document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ documentUrl: url, documentId }),
        });
        
        if (analyzeResponse.ok) {
          const analysis = await analyzeResponse.json();
          
          // Add AI message about the document
          const aiMessage: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: `I've analyzed your document "${file.name}". ${analysis.summary || 'Document received successfully!'}`,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, aiMessage]);
          
          if (audioEnabled) {
            speakText(aiMessage.content);
          }
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload document. Please try again.');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  // ═══════════════════════════════════════════════════════════
  // QUICK ACTIONS
  // ═══════════════════════════════════════════════════════════
  
  const handleQuickAction = (action: string) => {
    const messages: Record<string, string> = {
      'business_loan': 'I need a business loan',
      'real_estate': 'I\'m interested in real estate services',
    };
    
    setInput(messages[action] || '');
    handleSend(messages[action]);
  };
  
  // ═══════════════════════════════════════════════════════════
  // AUTO-SCROLL
  // ═══════════════════════════════════════════════════════════
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-white z-50 hover:scale-110"
      >
        <MessageSquare className="w-7 h-7" />
      </button>
    );
  }
  
  return (
    <div className="fixed bottom-6 right-6 w-[450px] h-[700px] bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl flex flex-col z-50 border border-yellow-500/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <span className="text-yellow-500 font-bold text-sm">SV</span>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">SaintBroker</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-black/70">AI™</span>
              {isVoiceMode && (
                <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                  VOICE ACTIVE
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* Tabs */}
      <div className="bg-black/40 border-b border-gray-700 flex">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'chat'
              ? 'text-yellow-500 border-b-2 border-yellow-500'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <MessageSquare className="w-4 h-4 inline mr-1" />
          Chat
        </button>
        <button
          onClick={() => setActiveTab('docs')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'docs'
              ? 'text-yellow-500 border-b-2 border-yellow-500'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <FileText className="w-4 h-4 inline mr-1" />
          Docs
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'notes'
              ? 'text-yellow-500 border-b-2 border-yellow-500'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <StickyNote className="w-4 h-4 inline mr-1" />
          Notes
        </button>
        <button
          onClick={() => setActiveTab('signs')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'signs'
              ? 'text-yellow-500 border-b-2 border-yellow-500'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <FileSignature className="w-4 h-4 inline mr-1" />
          Signs
        </button>
      </div>
      
      {/* Quick Actions */}
      {activeTab === 'chat' && messages.length <= 1 && (
        <div className="p-4 bg-gradient-to-b from-gray-800/50 to-transparent">
          <p className="text-gray-400 text-xs mb-3">Quick Actions:</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickAction('business_loan')}
              className="bg-gradient-to-br from-gray-700 to-gray-800 hover:from-yellow-600 hover:to-yellow-500 p-3 rounded-lg transition-all duration-300 flex flex-col items-center gap-2 text-gray-300 hover:text-white border border-gray-600 hover:border-yellow-500"
            >
              <DollarSign className="w-6 h-6" />
              <span className="text-xs font-medium">Business Loan</span>
            </button>
            <button
              onClick={() => handleQuickAction('real_estate')}
              className="bg-gradient-to-br from-gray-700 to-gray-800 hover:from-yellow-600 hover:to-yellow-500 p-3 rounded-lg transition-all duration-300 flex flex-col items-center gap-2 text-gray-300 hover:text-white border border-gray-600 hover:border-yellow-500"
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Real Estate</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'chat' && (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white'
                      : 'bg-gradient-to-br from-gray-700 to-gray-800 text-gray-100 border border-gray-600'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className="text-xs opacity-60 mt-1">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-br from-gray-700 to-gray-800 text-gray-100 rounded-2xl px-4 py-3 border border-gray-600">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
        
        {activeTab === 'docs' && (
          <div className="space-y-3">
            <div className="text-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
              >
                📤 Upload Document
              </button>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </div>
            
            {documents.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No documents uploaded yet</p>
              </div>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded-lg border border-gray-600"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{doc.name}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {(doc.size / 1024).toFixed(1)} KB • {doc.uploadedAt.toLocaleDateString()}
                      </p>
                    </div>
                    <FileText className="w-8 h-8 text-yellow-500" />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        
        {activeTab === 'notes' && (
          <div className="text-center text-gray-400 py-12">
            <StickyNote className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>Notes feature coming soon!</p>
          </div>
        )}
        
        {activeTab === 'signs' && (
          <div className="text-center text-gray-400 py-12">
            <FileSignature className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>Digital signatures coming soon!</p>
          </div>
        )}
      </div>
      
      {/* Input Area - ALWAYS AT BOTTOM */}
      {activeTab === 'chat' && (
        <div className="border-t border-gray-700 bg-black/40 p-4">
          {/* Voice Mode Indicator */}
          {isVoiceMode && (
            <div className="mb-2 text-center">
              <span className="text-xs text-yellow-500 animate-pulse">
                {isListening ? '🎤 Listening...' : isSpeaking ? '🔊 Speaking...' : 'Voice mode active'}
              </span>
            </div>
          )}
          
          <div className="flex items-end gap-2">
            {/* Voice Mode Toggle */}
            <button
              onClick={toggleVoiceMode}
              className={`p-3 rounded-lg transition-all duration-300 ${
                isVoiceMode
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
              title={isVoiceMode ? 'Stop voice mode' : 'Start voice mode'}
            >
              {isVoiceMode ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            
            {/* Input Field */}
            <div className="flex-1 flex items-end gap-2 bg-gray-800 rounded-lg p-2 border border-gray-600 focus-within:border-yellow-500 transition-colors">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type or speak your message..."
                disabled={isVoiceMode || isLoading}
                rows={1}
                className="flex-1 bg-transparent text-white text-sm resize-none outline-none placeholder-gray-500 disabled:opacity-50"
              />
              
              {/* Speech-to-Text Button (Single message mode) */}
              {!isVoiceMode && (
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isLoading}
                  className={`p-2 rounded transition-colors ${
                    isListening
                      ? 'text-red-500 animate-pulse'
                      : 'text-gray-400 hover:text-yellow-500'
                  }`}
                  title="Speech to text"
                >
                  <Mic className="w-5 h-5" />
                </button>
              )}
              
              {/* File Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="text-gray-400 hover:text-yellow-500 transition-colors p-2 rounded disabled:opacity-50"
                title="Upload document"
              >
                <Paperclip className="w-5 h-5" />
              </button>
            </div>
            
            {/* Audio Toggle */}
            <button
              onClick={() => {
                setAudioEnabled(!audioEnabled);
                if (!audioEnabled) stopSpeaking();
              }}
              className={`p-3 rounded-lg transition-colors ${
                audioEnabled
                  ? 'bg-gray-700 hover:bg-gray-600 text-yellow-500'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-400'
              }`}
              title={audioEnabled ? 'Disable audio' : 'Enable audio'}
            >
              {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            
            {/* Send Button */}
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading || isVoiceMode}
              className="bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-all duration-300 disabled:hover:from-yellow-500 disabled:hover:to-yellow-600"
              title="Send message"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-2 text-center">
            Powered by Azure AI • Secure & Encrypted
          </p>
        </div>
      )}
    </div>
  );
}