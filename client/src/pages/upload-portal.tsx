import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, CheckCircle2, FileText, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentRequirement {
  type: string;
  displayName: string;
  description: string;
  required: boolean;
  acceptedFormats: string[];
}

interface UploadTokenDetails {
  uploadToken: {
    id: string;
    token: string;
    division: string;
    requiredDocuments: string[];
    uploadedDocuments: string[];
    expiresAt: string;
  };
  contact: {
    firstName: string;
    lastName: string;
    email: string;
  };
  opportunity: {
    name: string;
    division: string;
  };
  requiredDocuments: DocumentRequirement[];
}

export default function UploadPortal() {
  const [, params] = useRoute('/upload/:token');
  const token = params?.token || '';
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({});

  // Fetch token details
  const { data: tokenDetails, isLoading, error } = useQuery<UploadTokenDetails>({
    queryKey: ['/api/documents/validate-token', token],
    enabled: !!token
  });

  // Fetch upload progress
  const { data: progress } = useQuery({
    queryKey: ['/api/documents/token', token, 'progress'],
    enabled: !!token,
    refetchInterval: 3000 // Refresh every 3 seconds
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async ({ documentType, file }: { documentType: string; file: File }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('token', token);
      formData.append('documentType', documentType);

      return await apiRequest('/api/documents/upload', {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type - browser will set it with boundary
        }
      });
    },
    onSuccess: (data, variables) => {
      toast({
        title: 'Document Uploaded',
        description: `${variables.file.name} has been uploaded successfully.`
      });
      // Clear selected file
      setSelectedFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[variables.documentType];
        return newFiles;
      });
      // Refetch progress
      queryClient.invalidateQueries({ queryKey: ['/api/documents/token', token, 'progress'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Upload Failed',
        description: error.message || 'Failed to upload document',
        variant: 'destructive'
      });
    }
  });

  const handleFileSelect = (documentType: string, file: File | null) => {
    if (file) {
      setSelectedFiles(prev => ({ ...prev, [documentType]: file }));
    } else {
      setSelectedFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[documentType];
        return newFiles;
      });
    }
  };

  const handleUpload = (documentType: string) => {
    const file = selectedFiles[documentType];
    if (file) {
      uploadMutation.mutate({ documentType, file });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading upload portal...</p>
        </div>
      </div>
    );
  }

  if (error || !tokenDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-6 w-6" />
              <CardTitle>Invalid Upload Link</CardTitle>
            </div>
            <CardDescription>
              This upload link is invalid, expired, or has already been used.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Please contact Saint Vision Group at{' '}
              <a href="mailto:saints@hacp.ai" className="text-primary hover:underline">
                saints@hacp.ai
              </a>{' '}
              or{' '}
              <a href="tel:+19497550720" className="text-primary hover:underline">
                (949) 755-0720
              </a>{' '}
              for assistance.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { contact, opportunity, requiredDocuments, uploadToken } = tokenDetails;
  const uploadedDocs = uploadToken.uploadedDocuments || [];
  const progressPercentage = progress?.percentage || 0;
  const allComplete = progress?.completed === progress?.total;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Saint Vision Group</h1>
          <p className="text-xl text-muted-foreground">Document Upload Portal</p>
        </div>

        {/* Welcome Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Welcome, {contact.firstName} {contact.lastName}!</CardTitle>
            <CardDescription>
              {opportunity.name} • {opportunity.division?.toUpperCase() || 'Application'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Upload Progress</span>
                <span className="text-sm text-muted-foreground">
                  {progress?.completed || 0} of {progress?.total || 0} documents
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" data-testid="progress-bar" />
            </div>
            {allComplete && (
              <div className="mt-4 flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">All documents uploaded! We'll review and contact you soon.</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Document Upload Cards */}
        <div className="space-y-4">
          {requiredDocuments.map((doc) => {
            const isUploaded = uploadedDocs.includes(doc.type);
            const selectedFile = selectedFiles[doc.type];
            const isUploading = uploadMutation.isPending && uploadMutation.variables?.documentType === doc.type;

            return (
              <Card key={doc.type} className={isUploaded ? 'border-green-500 dark:border-green-400' : ''} data-testid={`card-document-${doc.type}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {isUploaded ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" data-testid={`icon-uploaded-${doc.type}`} />
                        ) : (
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        )}
                        {doc.displayName}
                        {doc.required && <span className="text-destructive text-sm">*</span>}
                      </CardTitle>
                      <CardDescription>{doc.description}</CardDescription>
                      <p className="text-xs text-muted-foreground mt-1">
                        Accepted formats: {doc.acceptedFormats.map(f => f.split('/')[1]).join(', ').toUpperCase()}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isUploaded ? (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400" data-testid={`status-uploaded-${doc.type}`}>
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm font-medium">Uploaded successfully</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          id={`file-${doc.type}`}
                          accept={doc.acceptedFormats.join(',')}
                          onChange={(e) => handleFileSelect(doc.type, e.target.files?.[0] || null)}
                          className="hidden"
                          data-testid={`input-file-${doc.type}`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById(`file-${doc.type}`)?.click()}
                          className="flex-1"
                          data-testid={`button-select-${doc.type}`}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {selectedFile ? selectedFile.name : 'Choose File'}
                        </Button>
                        {selectedFile && (
                          <Button
                            onClick={() => handleUpload(doc.type)}
                            disabled={isUploading}
                            data-testid={`button-upload-${doc.type}`}
                          >
                            {isUploading ? 'Uploading...' : 'Upload'}
                          </Button>
                        )}
                      </div>
                      {selectedFile && (
                        <p className="text-sm text-muted-foreground" data-testid={`text-selected-${doc.type}`}>
                          Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              If you have any questions or issues uploading your documents, please contact us:
            </p>
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Email:</strong>{' '}
                <a href="mailto:saints@hacp.ai" className="text-primary hover:underline" data-testid="link-email">
                  saints@hacp.ai
                </a>
              </p>
              <p className="text-sm">
                <strong>Phone:</strong>{' '}
                <a href="tel:+19497550720" className="text-primary hover:underline" data-testid="link-phone">
                  (949) 755-0720
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
