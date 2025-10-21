import { useState } from 'react';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Download, FileText, Search } from 'lucide-react';

export default function LoansDocs4FundingPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const resources = [
    {
      title: 'AR Financing (pdf)',
      description: 'Accounts Receivable financing solutions',
      type: 'PDF',
      size: '2.4 MB'
    },
    {
      title: 'Business Credit Building (2) (pdf)',
      description: 'Guide to building business credit',
      type: 'PDF',
      size: '1.8 MB'
    },
    {
      title: 'Cannabusiness (pdf)',
      description: 'Cannabis industry specific financing',
      type: 'PDF',
      size: '3.1 MB'
    },
    {
      title: 'Equipment Financing (1) (pdf)',
      description: 'Equipment purchase and leasing options',
      type: 'PDF',
      size: '2.6 MB'
    },
    {
      title: 'Fix N Flip (pdf)',
      description: 'Real estate fix and flip financing',
      type: 'PDF',
      size: '2.9 MB'
    },
    {
      title: 'Line of Credit (pdf)',
      description: 'Business lines of credit solutions',
      type: 'PDF',
      size: '2.2 MB'
    },
    {
      title: 'Real Estate (pdf)',
      description: 'Commercial and residential real estate financing',
      type: 'PDF',
      size: '3.4 MB'
    },
    {
      title: 'SBA (pdf)',
      description: 'Small Business Administration loan programs',
      type: 'PDF',
      size: '2.7 MB'
    },
    {
      title: 'Term Loan (pdf)',
      description: 'Traditional term loan options',
      type: 'PDF',
      size: '2.1 MB'
    },
    {
      title: 'Working Capital (pdf)',
      description: 'Working capital and cash flow solutions',
      type: 'PDF',
      size: '2.5 MB'
    }
  ];

  const filteredResources = resources.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GlobalHeader />

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Loans & Funding Resources</h1>
            <p className="text-lg text-gray-600">Comprehensive guides to all our lending programs and financing options</p>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map((resource, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 flex-1">
                      <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <CardTitle className="text-base">{resource.title}</CardTitle>
                        <CardDescription className="text-sm">{resource.description}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{resource.size}</span>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-gray-600">No resources found matching your search. Try different keywords.</p>
              </CardContent>
            </Card>
          )}

          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Ready to Apply?</CardTitle>
              <CardDescription className="text-blue-800">
                These resources will help you prepare for your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-blue-900 mb-4">
                Download any documents that apply to your situation, review the requirements, and start your application today. Our team will guide you through the entire process.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Start Your Application
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <GlobalFooter />
    </div>
  );
}
