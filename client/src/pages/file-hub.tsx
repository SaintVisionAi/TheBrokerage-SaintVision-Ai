import { useState } from 'react';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Upload, FileText, Trash2, Lock, Shield, Calendar } from 'lucide-react';

export default function FileHubPage() {
  const [documents] = useState([
    {
      id: 1,
      name: 'Business Tax Return 2023',
      type: 'pdf',
      size: '2.4 MB',
      uploadedDate: '2024-10-15',
      status: 'verified'
    },
    {
      id: 2,
      name: 'Financial Statements',
      type: 'pdf',
      size: '1.8 MB',
      uploadedDate: '2024-10-14',
      status: 'verified'
    },
    {
      id: 3,
      name: 'Personal Tax Return 2023',
      type: 'pdf',
      size: '1.2 MB',
      uploadedDate: '2024-10-13',
      status: 'verified'
    }
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GlobalHeader />

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Secure File Hub</h1>
            <p className="text-lg text-gray-600">Upload, store, and manage your important documents securely</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Military Grade Encryption</h3>
                </div>
                <p className="text-sm text-gray-600">Your documents are protected with 256-bit encryption</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">HIPAA Compliant</h3>
                </div>
                <p className="text-sm text-gray-600">Meets all healthcare and financial data standards</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Version Control</h3>
                </div>
                <p className="text-sm text-gray-600">Keep track of all document versions and history</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Upload New Documents</CardTitle>
              <CardDescription>Drag and drop files or click to browse</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-900 font-semibold mb-1">Drop your files here or click to upload</p>
                <p className="text-sm text-gray-600 mb-4">Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG</p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Select Files
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Documents</CardTitle>
              <CardDescription>Manage and organize your uploaded files</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4 flex-1">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-600">
                          {doc.size} • Uploaded {doc.uploadedDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                        {doc.status}
                      </span>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <GlobalFooter />
    </div>
  );
}
