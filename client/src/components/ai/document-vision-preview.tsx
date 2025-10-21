import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Eye,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download,
  Share2,
  Maximize2,
  X,
} from 'lucide-react';
import { useDocumentVision, DocumentAnalysis } from '@/hooks/useDocumentVision';
import { cn } from '@/lib/utils';

interface DocumentVisionPreviewProps {
  file: File;
  documentName: string;
  documentType?: string;
  onClose?: () => void;
  onAnalysisComplete?: (analysis: DocumentAnalysis) => void;
}

export default function DocumentVisionPreview({
  file,
  documentName,
  documentType,
  onClose,
  onAnalysisComplete,
}: DocumentVisionPreviewProps) {
  const { analyzeDocument, isAnalyzing, error } = useDocumentVision();
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAnalyze = async () => {
    const result = await analyzeDocument(file);
    if (result) {
      setAnalysis(result);
      onAnalysisComplete?.(result);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'bg-emerald-400/20 text-emerald-400 border-emerald-400/30';
      case 'invalid':
        return 'bg-red-400/20 text-red-400 border-red-400/30';
      case 'warning':
        return 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30';
      default:
        return 'bg-gray-400/20 text-gray-400 border-gray-400/30';
    }
  };

  return (
    <Card className={cn(
      'bg-black/40 border-yellow-400/20',
      isExpanded && 'fixed inset-0 m-4 z-50'
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-400/20 flex items-center justify-center">
            <Eye className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <CardTitle className="text-yellow-400">Document Preview</CardTitle>
            <CardDescription>{documentName}</CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isExpanded && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="text-gray-400 hover:text-white"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          )}
          {isExpanded && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {!analysis ? (
          <div className="space-y-4">
            <div className="p-8 bg-black/20 rounded-lg border border-yellow-400/10 flex flex-col items-center justify-center">
              <FileText className="w-12 h-12 text-yellow-400/50 mb-4" />
              <p className="text-sm text-gray-400 text-center mb-4">
                Click the button below to analyze this document with AI-powered vision
              </p>
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Analyze with Gemini/Azure
                  </>
                )}
              </Button>
              {error && (
                <p className="text-xs text-red-400 mt-4">{error.message}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-black/40">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="fields">Fields</TabsTrigger>
                <TabsTrigger value="issues">Issues</TabsTrigger>
                <TabsTrigger value="data">Data</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-black/40 rounded-lg border border-yellow-400/20">
                    <p className="text-xs text-gray-400 mb-1">Document Type</p>
                    <p className="font-semibold text-white">{analysis.documentType}</p>
                  </div>
                  <div className="p-3 bg-black/40 rounded-lg border border-yellow-400/20">
                    <p className="text-xs text-gray-400 mb-1">Confidence</p>
                    <p className="font-semibold text-yellow-400">{analysis.confidence}%</p>
                  </div>
                  <div className="p-3 bg-black/40 rounded-lg border border-yellow-400/20">
                    <p className="text-xs text-gray-400 mb-1">Status</p>
                    <Badge className={cn('text-xs', getStatusColor(analysis.status))}>
                      {analysis.status}
                    </Badge>
                  </div>
                </div>

                <div className="p-4 bg-black/40 rounded-lg border border-yellow-400/20">
                  <h4 className="font-semibold text-white mb-2">Document Summary</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{analysis.summary}</p>
                </div>

                {analysis.recommendations.length > 0 && (
                  <div className="p-4 bg-emerald-400/10 rounded-lg border border-emerald-400/20">
                    <h4 className="font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Recommendations
                    </h4>
                    <ul className="space-y-1 text-sm text-emerald-300">
                      {analysis.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-emerald-400">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="fields" className="space-y-2">
                {analysis.keyFields.length === 0 ? (
                  <p className="text-sm text-gray-400">No key fields extracted</p>
                ) : (
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-2">
                      {analysis.keyFields.map((field, idx) => (
                        <div key={idx} className="p-3 bg-black/40 rounded-lg border border-yellow-400/10">
                          <p className="text-xs text-gray-400 font-medium">{field.label}</p>
                          <p className="text-sm text-white mt-1 break-all">{field.value}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </TabsContent>

              <TabsContent value="issues" className="space-y-2">
                {analysis.issues.length === 0 ? (
                  <div className="p-4 bg-emerald-400/10 rounded-lg border border-emerald-400/20 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <p className="text-sm text-emerald-300">No issues detected</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {analysis.issues.map((issue, idx) => (
                      <div key={idx} className="p-3 bg-orange-400/10 rounded-lg border border-orange-400/20 flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-orange-300">{issue}</p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="data">
                <ScrollArea className="h-[300px] bg-black/40 rounded-lg border border-yellow-400/10 p-4 pr-0">
                  <pre className="text-xs text-gray-300 font-mono pr-4">
                    {JSON.stringify(analysis.extractedData, null, 2)}
                  </pre>
                </ScrollArea>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 justify-end pt-4">
              <Button
                variant="outline"
                className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button
                variant="outline"
                className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Analysis
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
