import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useGHLSubmit, GHLFormType } from '@/hooks/useGHLSubmit';
import { Loader2, CheckCircle, Upload, FileCheck } from 'lucide-react';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';

const documentSchema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  documentType: z.string().min(1, 'Document type required'),
});

type DocumentFormData = z.infer<typeof documentSchema>;

export default function DocumentUploadForm() {
  const { submit, isLoading } = useGHLSubmit();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      documentType: '',
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).map(file => file.name);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const onSubmit = async (data: DocumentFormData) => {
    await submit(GHLFormType.DOCUMENT_UPLOAD, { ...data, documents: uploadedFiles }, {
      showToast: true,
      onSuccess: () => {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          form.reset();
          setUploadedFiles([]);
        }, 3000);
      },
    });
  };

  if (isSubmitted) {
    return (
      <>
        <GlobalHeader />
        <div className="bg-black min-h-screen px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-b from-emerald-500/10 to-emerald-600/10 border-emerald-400/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-emerald-400/20 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-emerald-400">Documents Uploaded Successfully!</CardTitle>
                    <CardDescription>Thank you for submitting your documents</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">We've received your documents securely. Our team will review them shortly.</p>
              </CardContent>
            </Card>
          </div>
        </div>
        <GlobalFooter />
      </>
    );
  }

  return (
    <>
      <GlobalHeader />
      <div className="bg-black min-h-screen px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-3 text-white">🛡️ Secure Document Upload</h1>
            <p className="text-lg text-gray-400">
              Upload your documents securely to Saint Vision Group
            </p>
          </div>

          <Card className="bg-black/40 border-emerald-400/20">
            <CardHeader>
              <CardTitle className="text-emerald-400">Document Submission Portal</CardTitle>
              <CardDescription>Upload required documentation for your application</CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-emerald-400/20 text-emerald-400 border-emerald-400/30">1</Badge>
                      <h3 className="font-semibold text-white">Your Information</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">First Name *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John"
                                className="bg-black/50 border-emerald-400/30 text-white"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Last Name *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Doe"
                                className="bg-black/50 border-emerald-400/30 text-white"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Email *</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="john@example.com"
                                className="bg-black/50 border-emerald-400/30 text-white"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Phone *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="(555) 123-4567"
                                className="bg-black/50 border-emerald-400/30 text-white"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-emerald-400/20 text-emerald-400 border-emerald-400/30">2</Badge>
                      <h3 className="font-semibold text-white">Upload Documents</h3>
                    </div>

                    <FormField
                      control={form.control}
                      name="documentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Document Type *</FormLabel>
                          <FormControl>
                            <select
                              className="w-full bg-black/50 border border-emerald-400/30 text-white rounded-md px-3 py-2"
                              {...field}
                            >
                              <option value="">Select document type</option>
                              <option value="tax-returns">Tax Returns</option>
                              <option value="bank-statements">Bank Statements</option>
                              <option value="business-license">Business License</option>
                              <option value="financial-statements">Financial Statements</option>
                              <option value="proof-of-identity">Proof of Identity</option>
                              <option value="property-docs">Property Documents</option>
                              <option value="other">Other</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="border-2 border-dashed border-emerald-400/30 rounded-lg p-8 text-center hover:border-emerald-400/50 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}>
                      <Upload className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                      <p className="text-white font-medium mb-1">Click to upload files</p>
                      <p className="text-sm text-gray-400">Drag and drop documents here</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      />
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-emerald-400 font-medium">Uploaded Files:</p>
                        <div className="space-y-2">
                          {uploadedFiles.map((file, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-3 bg-black/50 rounded-lg border border-emerald-400/20">
                              <FileCheck className="w-4 h-4 text-emerald-400" />
                              <span className="text-sm text-gray-300">{file}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <Button
                      type="submit"
                      disabled={isLoading || uploadedFiles.length === 0}
                      className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-black font-bold h-12 text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <Loader2 className="animate-spin h-5 w-5 mr-2" />
                          Uploading...
                        </span>
                      ) : (
                        'Submit Documents'
                      )}
                    </Button>
                    <p className="text-center text-sm text-gray-400 mt-4">
                      * Required fields. Your documents are encrypted and secure.
                    </p>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
      <GlobalFooter />
    </>
  );
}
