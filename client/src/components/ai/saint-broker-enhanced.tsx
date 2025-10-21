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
  Trash2,
  Pin,
  Check,
  Clock,
  XCircle,
  Plus,
  Mic,
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
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: "**Need capital? Rates? Answers?** I gotta guy. 🕴️",
    timestamp: new Date()
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [notes, setNotes] = useState<Note[]>([]);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState('');

  const [signatures, setSignatures] = useState<Signature[]>([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      loadUserData();
    }
  }, [isOpen]);

  const loadUserData = async () => {
    try {
      const docsRes = await fetch('/api/saint-broker/documents', {
        credentials: 'include',
      });
      if (docsRes.ok) {
        const docsData = await docsRes.json();
        setDocuments(Array.isArray(docsData) ? docsData : []);
      }
    } catch (err) {
      console.warn('Failed to load documents:', err);
    }

    try {
      const notesRes = await fetch('/api/saint-broker/notes', {
        credentials: 'include',
      });
      if (notesRes.ok) {
        const notesData = await notesRes.json();
        setNotes(Array.isArray(notesData) ? notesData : []);
      }
    } catch (err) {
      console.warn('Failed to load notes:', err);
    }

    try {
      const sigRes = await fetch('/api/saint-broker/signatures', {
        credentials: 'include',
      });
      if (sigRes.ok) {
        const sigData = await sigRes.json();
        setSignatures(Array.isArray(sigData) ? sigData : []);
      }
    } catch (err) {
      console.warn('Failed to load signatures:', err);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    const currentInput = input;
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/saint-broker/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          message: currentInput,
          context: {
            documentCount: documents.length,
            noteCount: notes.length,
            pendingSignatures: signatures.filter(s => s.status === 'pending').length,
          }
        })
      });

      if (!response.ok) throw new Error('Chat failed');
      
      const data = await response.json();
      const assistantMessage = {
        role: 'assistant' as const,
        content: data.response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message.",
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
          description: `${file.name} uploaded successfully.`
        });
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload document.",
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
        description: "Please fill in title and content.",
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
          description: "Your note has been saved."
        });
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save note.",
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
          description: `Request sent for ${documentTitle}`
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
        <div className="absolute inset-0 rounded-full bg-yellow-400/30 blur-xl animate-pulse" />
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
    <div className="fixed bottom-2 md:bottom-6 right-2 md:right-6 w-[calc(100vw-1rem)] md:w-[500px] h-[70vh] z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 via-blue-500/20 to-yellow-600/20 rounded-2xl blur-xl" />
      
      <Card className="relative flex flex-col h-full bg-black/40 backdrop-blur-xl border border-yellow-400/40 shadow-2xl shadow-yellow-400/20 overflow-hidden">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2 md:pb-3 bg-gradient-to-r from-yellow-400/20 via-yellow-500/20 to-yellow-600/20 backdrop-blur-sm border-b border-yellow-400/30">
          <CardTitle className="text-lg md:text-xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              SaintBroker
            </span>
            <Badge variant="outline" className="text-xs border-yellow-400/50 text-yellow-400 bg-yellow-400/10">
              AI™
            </Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 text-white/60 hover:text-white hover:bg-red-500/20"
            data-testid="button-close-saintbroker"
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/30 backdrop-blur-md border-b border-white/10 flex-shrink-0">
            <TabsTrigger value="chat">
              <MessageCircle className="h-4 w-4 mr-1" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="documents">
              <FileText className="h-4 w-4 mr-1" />
              Docs
              {documents.length > 0 && (
                <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-yellow-400 text-black text-xs">
                  {documents.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="notes">
              <StickyNote className="h-4 w-4 mr-1" />
              Notes
              {notes.length > 0 && (
                <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-yellow-400 text-black text-xs">
                  {notes.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="signatures">
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
          <TabsContent value="chat" className="flex-1 flex flex-col mt-0 overflow-hidden w-full min-h-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex gap-3",
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {msg.role === 'assistant' && (
                    <Avatar className="h-8 w-8 bg-gradient-to-r from-yellow-400 to-yellow-600 flex-shrink-0">
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
                  <Avatar className="h-8 w-8 bg-gradient-to-r from-yellow-400 to-yellow-600 flex-shrink-0">
                    <AvatarFallback className="text-black text-xs font-bold">SB</AvatarFallback>
                  </Avatar>
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-white/10 bg-black/20 flex-shrink-0">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask SaintBroker..."
                  className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50 h-9"
                  data-testid="input-chat"
                />
                <Button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black flex-shrink-0"
                  data-testid="button-send-message"
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* DOCUMENTS TAB */}
          <TabsContent value="documents" className="flex-1 flex flex-col mt-0 overflow-hidden w-full min-h-0">
            <div className="flex-shrink-0 flex gap-2 p-3 border-b border-white/10">
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
                className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black h-9"
                size="sm"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {documents.length === 0 ? (
                <div className="text-center text-white/60 py-8">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No documents</p>
                </div>
              ) : (
                documents.map((doc) => (
                  <Card key={doc.id} className="bg-white/5 backdrop-blur-sm border-white/20">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-white text-sm">{doc.fileName}</p>
                          <p className="text-xs text-white/60">
                            {(doc.fileSize / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-white/60 hover:text-white flex-shrink-0"
                          onClick={() => requestSignature(doc.id, doc.fileName)}
                        >
                          <FileSignature className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* NOTES TAB */}
          <TabsContent value="notes" className="flex-1 flex flex-col mt-0 overflow-hidden w-full min-h-0">
            <div className="flex-shrink-0 space-y-2 bg-white/5 backdrop-blur-sm p-3 border-b border-white/10">
              <Input
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Title..."
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50 h-8 text-sm"
              />
              <Textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Content..."
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50 min-h-[50px] text-sm"
              />
              <Button
                onClick={handleSaveNote}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black h-8 text-sm"
                size="sm"
              >
                <Plus className="h-3 w-3 mr-1" />
                Save
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {notes.length === 0 ? (
                <div className="text-center text-white/60 py-8">
                  <StickyNote className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No notes</p>
                </div>
              ) : (
                notes.map((note) => (
                  <Card key={note.id} className="bg-white/5 backdrop-blur-sm border-white/20">
                    <CardContent className="p-3">
                      <h4 className="font-semibold text-white text-sm">{note.title}</h4>
                      <p className="text-xs text-white/80 mt-1">{note.content}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
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
                    <Card key={sig.id} className="bg-white/5 backdrop-blur-sm border-white/20">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-white text-sm">{sig.documentTitle}</p>
                            <p className="text-xs text-white/60">
                              {new Date(sig.requestedAt).toLocaleDateString()}
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
