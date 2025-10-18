import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles,
  FileText,
  StickyNote,
  FileSignature,
  Upload,
  Download,
  Trash2,
  Pin,
  Check,
  Clock,
  XCircle,
  Plus,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Document {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  summary?: string;
  uploadedAt: Date;
}

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  createdAt: Date;
}

interface Signature {
  id: string;
  documentTitle: string;
  status: 'pending' | 'signed' | 'declined';
  signedAt?: Date;
  requestedAt: Date;
}

export default function SaintBrokerEnhanced() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(true); // Auto-open on page load
  const [activeTab, setActiveTab] = useState('chat');
  
  // Chat State - Warm and inviting greeting
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: "Welcome! I'm SaintBroker AI, your personal funding specialist available 24/7. 🌟\n\nI've helped thousands of businesses secure the capital they need to grow and thrive. Whether you need **$50K or $5M**, I'm here to make it happen - often within 24 hours.\n\n**How can I help you today?**\n• Get pre-approved for business funding\n• Learn about our lending options\n• Explore real estate opportunities\n• Discuss investment strategies\n\nLet's start with what matters most to you. What brings you here today?",
    timestamp: new Date()
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Documents State
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Notes State
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState('');

  // Signatures State
  const [signatures, setSignatures] = useState<Signature[]>([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Load user data when opened
  useEffect(() => {
    if (isOpen) {
      loadUserData();
    }
  }, [isOpen]);

  // Listen for messages from landing page buttons
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'SAINTBROKER_MESSAGE' && event.data.message) {
        setIsOpen(true);
        setInput(event.data.message);
        // Auto-send the message
        setTimeout(() => {
          const button = document.querySelector('[data-testid="button-send-message"]') as HTMLButtonElement;
          if (button) button.click();
        }, 500);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const loadUserData = async () => {
    try {
      // Load documents (with credentials for auth)
      const docsRes = await fetch('/api/saint-broker/documents', {
        credentials: 'include'
      });
      if (docsRes.ok) {
        const docsData = await docsRes.json();
        setDocuments(docsData);
      }

      // Load notes (with credentials for auth)
      const notesRes = await fetch('/api/saint-broker/notes', {
        credentials: 'include'
      });
      if (notesRes.ok) {
        const notesData = await notesRes.json();
        setNotes(notesData);
      }

      // Load signatures (with credentials for auth)
      const sigRes = await fetch('/api/saint-broker/signatures', {
        credentials: 'include'
      });
      if (sigRes.ok) {
        const sigData = await sigRes.json();
        setSignatures(sigData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/saint-broker/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // IMPORTANT: Include cookies for authentication
        body: JSON.stringify({ 
          message: input,
          context: {
            documentCount: documents.length,
            noteCount: notes.length,
            pendingSignatures: signatures.filter(s => s.status === 'pending').length
          }
        })
      });

      const data = await response.json();
      
      // Update sync status and role from response
      if (data.context) {
        setSyncStatus(data.context.syncStatus);
        setUserRole(data.context.role);
      }
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/saint-broker/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setDocuments(prev => [...prev, data.document]);
        toast({
          title: "Document Uploaded",
          description: `${file.name} has been uploaded and analyzed.`
        });
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveNote = async () => {
    if (!noteTitle.trim() || !noteContent.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and content for the note.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/saint-broker/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: noteTitle,
          content: noteContent,
          tags: noteTags.split(',').map(t => t.trim()).filter(Boolean)
        })
      });

      if (response.ok) {
        const data = await response.json();
        setNotes(prev => [data.note, ...prev]);
        setNoteTitle('');
        setNoteContent('');
        setNoteTags('');
        toast({
          title: "Note Saved",
          description: "Your note has been saved successfully."
        });
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save note. Please try again.",
        variant: "destructive"
      });
    }
  };

  const requestSignature = async (documentId: string, documentTitle: string) => {
    try {
      const response = await fetch('/api/saint-broker/signatures/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, documentTitle })
      });

      if (response.ok) {
        const data = await response.json();
        setSignatures(prev => [data.signature, ...prev]);
        toast({
          title: "Signature Requested",
          description: `Signature request sent for ${documentTitle}`
        });
      }
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "Failed to request signature.",
        variant: "destructive"
      });
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        {/* Pulsing glow ring */}
        <div className="absolute inset-0 rounded-full bg-yellow-400/30 blur-xl animate-pulse" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/40 to-yellow-600/40 animate-ping" />
        
        <Button
          onClick={() => setIsOpen(true)}
          className="relative h-16 w-16 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-300 hover:via-yellow-400 hover:to-yellow-500 shadow-2xl hover:shadow-yellow-400/50 transition-all duration-300 hover:scale-110 border-2 border-yellow-300/50"
          data-testid="button-open-saintbroker"
        >
          <Sparkles className="h-7 w-7 text-black animate-pulse" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[500px] h-[85vh] max-h-[800px] z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      {/* Outer glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 via-blue-500/20 to-yellow-600/20 rounded-2xl blur-xl" />
      
      <Card className="relative flex flex-col h-full bg-black/40 backdrop-blur-xl border border-yellow-400/40 shadow-2xl shadow-yellow-400/20">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-r from-yellow-400/20 via-yellow-500/20 to-yellow-600/20 backdrop-blur-sm border-b border-yellow-400/30">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
          <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600 bg-clip-text text-transparent animate-gradient">
            SaintBroker
          </span>
          <Badge variant="outline" className="text-xs border-yellow-400/50 text-yellow-400 bg-yellow-400/10 animate-pulse">
            AI™
          </Badge>
          {/* ORCHESTRATOR SYNC STATUS */}
          {syncStatus && (
            <div className="flex items-center gap-2 ml-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium">SYNCED</span>
            </div>
          )}
          {userRole && (
            <Badge className="text-xs bg-blue-500/20 text-blue-400 border-blue-400/30">
              {userRole.toUpperCase()}
            </Badge>
          )}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="h-8 w-8 text-white/60 hover:text-white hover:bg-red-500/20 transition-all duration-200 hover:rotate-90"
          data-testid="button-close-saintbroker"
        >
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4 bg-black/30 backdrop-blur-md border-b border-white/10">
          <TabsTrigger value="chat" data-testid="tab-chat">
            <MessageCircle className="h-4 w-4 mr-1" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="documents" data-testid="tab-documents">
            <FileText className="h-4 w-4 mr-1" />
            Docs
            {documents.length > 0 && (
              <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-yellow-400 text-black text-xs">
                {documents.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="notes" data-testid="tab-notes">
            <StickyNote className="h-4 w-4 mr-1" />
            Notes
            {notes.length > 0 && (
              <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-yellow-400 text-black text-xs">
                {notes.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="signatures" data-testid="tab-signatures">
            <FileSignature className="h-4 w-4 mr-1" />
            Signs
            {signatures.filter(s => s.status === 'pending').length > 0 && (
              <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-yellow-400 text-black text-xs">
                {signatures.filter(s => s.status === 'pending').length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* CHAT TAB */}
        <TabsContent value="chat" className="flex-1 flex flex-col mt-0 p-4 space-y-4">
          <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex gap-3",
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                  data-testid={`message-${msg.role}-${idx}`}
                >
                  {msg.role === 'assistant' && (
                    <Avatar className="h-8 w-8 bg-gradient-to-r from-yellow-400 to-yellow-600">
                      <AvatarFallback className="text-black text-xs font-bold">
                        SB
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "rounded-lg p-3 max-w-[80%]",
                      msg.role === 'user'
                        ? 'bg-yellow-400 text-black'
                        : 'bg-white/5 text-white backdrop-blur-sm'
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start gap-3">
                  <Avatar className="h-8 w-8 bg-gradient-to-r from-yellow-400 to-yellow-600">
                    <AvatarFallback className="text-black text-xs font-bold">
                      SB
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="border-t border-white/10 p-3 bg-white/5 backdrop-blur-sm">
              <p className="text-xs text-neutral-400 mb-2 font-medium">Quick Actions:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="h-auto py-3 px-3 text-left flex flex-col items-start gap-1 bg-white/5 backdrop-blur-sm border-yellow-400/30 hover:border-yellow-400 hover:bg-yellow-400/10 transition-all"
                  onClick={() => {
                    setInput("I'd like to apply for a business loan");
                  }}
                  data-testid="quick-action-apply-loan"
                >
                  <span className="text-lg">💰</span>
                  <span className="text-xs text-white font-medium leading-tight">Business Loan</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-3 px-3 text-left flex flex-col items-start gap-1 bg-white/5 backdrop-blur-sm border-yellow-400/30 hover:border-yellow-400 hover:bg-yellow-400/10 transition-all"
                  onClick={() => {
                    setInput("Tell me about your real estate services");
                  }}
                  data-testid="quick-action-real-estate"
                >
                  <span className="text-lg">🏠</span>
                  <span className="text-xs text-white font-medium leading-tight">Real Estate</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-3 px-3 text-left flex flex-col items-start gap-1 bg-white/5 backdrop-blur-sm border-yellow-400/30 hover:border-yellow-400 hover:bg-yellow-400/10 transition-all"
                  onClick={() => {
                    setInput("What investment opportunities do you offer?");
                  }}
                  data-testid="quick-action-investments"
                >
                  <span className="text-lg">📈</span>
                  <span className="text-xs text-white font-medium leading-tight">Investments</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-3 px-3 text-left flex flex-col items-start gap-1 bg-white/5 backdrop-blur-sm border-yellow-400/30 hover:border-yellow-400 hover:bg-yellow-400/10 transition-all"
                  onClick={() => {
                    setInput("What's the status of my loan application?");
                  }}
                  data-testid="quick-action-check-status"
                >
                  <span className="text-lg">⏱️</span>
                  <span className="text-xs text-white font-medium leading-tight">Loan Status</span>
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Ask SaintBroker anything..."
              className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50"
              data-testid="input-chat"
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black"
              data-testid="button-send-message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        {/* DOCUMENTS TAB */}
        <TabsContent value="documents" className="flex-1 flex flex-col mt-0 p-4 space-y-4">
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.xlsx,.csv"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black"
              data-testid="button-upload-document"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-2">
              {documents.length === 0 ? (
                <div className="text-center text-white/60 py-8">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No documents uploaded yet</p>
                </div>
              ) : (
                documents.map((doc) => (
                  <Card key={doc.id} className="bg-white/5 backdrop-blur-sm border-white/20" data-testid={`document-${doc.id}`}>
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-white text-sm">{doc.filename}</p>
                          <p className="text-xs text-white/60">
                            {(doc.fileSize / 1024).toFixed(1)} KB • {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                          {doc.summary && (
                            <p className="text-xs text-white/80 mt-2">{doc.summary}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-white/60 hover:text-white"
                            onClick={() => requestSignature(doc.id, doc.filename)}
                            data-testid={`button-request-signature-${doc.id}`}
                          >
                            <FileSignature className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* NOTES TAB */}
        <TabsContent value="notes" className="flex-1 flex flex-col mt-0 p-4 space-y-4">
          <div className="space-y-2 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
            <Input
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Note title..."
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50"
              data-testid="input-note-title"
            />
            <Textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Write your note here..."
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50 min-h-[80px]"
              data-testid="textarea-note-content"
            />
            <Input
              value={noteTags}
              onChange={(e) => setNoteTags(e.target.value)}
              placeholder="Tags (comma separated)"
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50"
              data-testid="input-note-tags"
            />
            <Button
              onClick={handleSaveNote}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black"
              data-testid="button-save-note"
            >
              <Plus className="h-4 w-4 mr-2" />
              Save Note
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-2">
              {notes.length === 0 ? (
                <div className="text-center text-white/60 py-8">
                  <StickyNote className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No notes saved yet</p>
                </div>
              ) : (
                notes.map((note) => (
                  <Card key={note.id} className="bg-white/5 backdrop-blur-sm border-white/20" data-testid={`note-${note.id}`}>
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-white">{note.title}</h4>
                        {note.isPinned && <Pin className="h-4 w-4 text-yellow-400" />}
                      </div>
                      <p className="text-sm text-white/80 whitespace-pre-wrap">{note.content}</p>
                      {note.tags.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {note.tags.map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs border-yellow-400/50 text-yellow-400">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-white/40 mt-2">
                        {new Date(note.createdAt).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* SIGNATURES TAB */}
        <TabsContent value="signatures" className="flex-1 flex flex-col mt-0 p-4">
          <ScrollArea className="flex-1">
            <div className="space-y-2">
              {signatures.length === 0 ? (
                <div className="text-center text-white/60 py-8">
                  <FileSignature className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No signature requests</p>
                </div>
              ) : (
                signatures.map((sig) => (
                  <Card key={sig.id} className="bg-white/5 backdrop-blur-sm border-white/20" data-testid={`signature-${sig.id}`}>
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-white text-sm">{sig.documentTitle}</p>
                          <p className="text-xs text-white/60">
                            Requested {new Date(sig.requestedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          className={cn(
                            sig.status === 'pending' && 'bg-orange-400 text-black',
                            sig.status === 'signed' && 'bg-green-400 text-black',
                            sig.status === 'declined' && 'bg-red-400 text-black'
                          )}
                        >
                          {sig.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                          {sig.status === 'signed' && <Check className="h-3 w-3 mr-1" />}
                          {sig.status === 'declined' && <XCircle className="h-3 w-3 mr-1" />}
                          {sig.status}
                        </Badge>
                      </div>
                      {sig.signedAt && (
                        <p className="text-xs text-green-400 mt-2">
                          Signed {new Date(sig.signedAt).toLocaleString()}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
    </div>
  );
}
