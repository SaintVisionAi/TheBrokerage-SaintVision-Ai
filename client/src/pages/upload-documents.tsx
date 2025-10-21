import { useState } from 'react';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

export default function UploadDocumentsPage() {
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);

  const requiredDocuments = [
    {
      id: 'tax-return',
      name: 'Business Tax Return (2 years)',
      description: 'Last 2 years of complete tax returns with all schedules',
      required: true
    },
    {
      id: 'financial-statements',
      name: 'Financial Statements',
      description: 'Latest available income statement and balance sheet',
      required: true
    },
    {
      id: 'bank-statements',
      name: 'Bank Statements (3 months)',
      description: 'Last 3 months of business and personal bank statements',
      required: true
    },
    {
      id: 'personal-tax',
      name: 'Personal Tax Return',
      description: 'Personal tax return for principal owners (last 2 years)',
      required: true
    },
    {
      id: 'profit-loss',
      name: 'Profit & Loss Statement',
      description: 'Current year P&L statement (YTD)',
      required: false
    },
    {
      id: 'business-license',
      name: 'Business License',
      description: 'Current business license or EIN verification letter',
      required: true
    }
  ];

  const toggleDoc = (docId: string) => {
    setUploadedDocs(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const requiredCount = requiredDocuments.filter(d => d.required).length;
  const uploadedRequiredCount = uploadedDocuments.filter(d => d.required).length;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GlobalHeader />

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Submit Loan Documents</h1>
            <p className="text-lg text-gray-600">Upload the required documents to complete your application</p>
          </div>

          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-blue-900 mb-1">Required for approval</p>
                  <p className="text-sm text-blue-800">
                    Please upload all required documents. You can upload additional supporting documents in the "Optional" section.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Required Documents</CardTitle>
                  <CardDescription>
                    {uploadedRequiredCount} of {requiredCount} required documents uploaded
                  </CardDescription>
                </div>
                {uploadedRequiredCount === requiredCount && (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                )}
              </div>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all" 
                  style={{ width: `${(uploadedRequiredCount / requiredCount) * 100}%` }}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {requiredDocuments
                .filter(d => d.required)
                .map((doc) => (
                  <div 
                    key={doc.id}
                    className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleDoc(doc.id)}
                  >
                    <Checkbox 
                      checked={uploadedDocs.includes(doc.id)}
                      onChange={() => toggleDoc(doc.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-sm text-gray-600">{doc.description}</p>
                    </div>
                    {uploadedDocs.includes(doc.id) && (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    )}
                  </div>
                ))}
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Optional Documents</CardTitle>
              <CardDescription>Strengthen your application with additional documentation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {requiredDocuments
                .filter(d => !d.required)
                .map((doc) => (
                  <div 
                    key={doc.id}
                    className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleDoc(doc.id)}
                  >
                    <Checkbox 
                      checked={uploadedDocs.includes(doc.id)}
                      onChange={() => toggleDoc(doc.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-sm text-gray-600">{doc.description}</p>
                    </div>
                    {uploadedDocs.includes(doc.id) && (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    )}
                  </div>
                ))}
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              size="lg"
              disabled={uploadedRequiredCount < requiredCount}
            >
              <Upload className="w-4 h-4 mr-2" />
              Submit Documents
            </Button>
            <Button variant="outline" size="lg">
              Save & Continue Later
            </Button>
          </div>
        </div>
      </div>

      <GlobalFooter />
    </div>
  );
}
