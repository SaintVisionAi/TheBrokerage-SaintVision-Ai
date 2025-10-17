import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function FileUploader() {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    await uploadFiles(files);
  }, [tags]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await uploadFiles(files);
  }, [tags]);

  const uploadFiles = async (files: File[]) => {
    setUploading(true);
    setSuccess(false);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('tags', tags.join(','));

        const response = await fetch('/api/brain/ingest', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        
        if (response.ok) {
          console.log('Ingest success:', result);
          setSuccess(true);
          toast({
            title: "Upload Successful",
            description: `${file.name} has been ingested into SaintSal Brain`,
          });
        } else {
          console.error('Ingest failed:', result.error);
          toast({
            title: "Upload Failed",
            description: result.error || 'Failed to upload file',
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "Network error occurred during upload",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags((prev) => [...prev, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter(tag => tag !== tagToRemove));
  };

  return (
    <Card className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-emerald-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Upload className="w-5 h-5 text-emerald-400" />
          📂 Upload to SaintSal Brain
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            dragActive 
              ? 'border-emerald-400 bg-emerald-400/10' 
              : 'border-slate-600 hover:border-emerald-500 hover:bg-emerald-500/5'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploading}
          />
          
          <div className="flex flex-col items-center gap-2">
            <File className="w-8 h-8 text-emerald-400" />
            {dragActive ? (
              <p className="text-emerald-400 font-semibold">
                Drop it like it's divine 🔥
              </p>
            ) : (
              <p className="text-slate-400">
                Drag and drop files here, or click to select
              </p>
            )}
          </div>
        </div>

        {/* Tags Input */}
        <div>
          <label className="block mb-2 text-sm font-medium text-slate-300">
            Tags (press Enter to add)
          </label>
          <Input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagAdd}
            placeholder="e.g. finance, ai, legal"
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
            disabled={uploading}
          />
          
          {/* Tags Display */}
          <div className="flex flex-wrap mt-2 gap-2">
            {tags.map((tag, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="bg-emerald-600/20 text-emerald-400 border-emerald-500/30 pr-1"
              >
                {tag}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-4 w-4 p-0 hover:bg-emerald-500/20"
                  onClick={() => removeTag(tag)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Status */}
        {uploading && (
          <div className="flex items-center gap-2 text-blue-400">
            <div className="w-4 h-4 border-2 border-blue-400/20 border-t-blue-400 rounded-full animate-spin" />
            <span className="text-sm">Uploading to SaintSal Brain...</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">Successfully uploaded to brain!</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}