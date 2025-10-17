import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, ExternalLink } from 'lucide-react';

export default function CRMStream() {
  return (
    <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Users className="w-5 h-5 text-blue-400" />
          PartnerTech CRM Stream
          <Badge variant="outline" className="ml-auto border-green-500/30 text-green-400">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="w-full h-[600px] border border-slate-700 rounded-lg overflow-hidden">
          <iframe
            src="https://partnertech-crm.streamlit.app/?embed=true"
            className="w-full h-full"
            title="Streamlit CRM Metrics"
            style={{ border: 'none' }}
          />
        </div>
        
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Real-time CRM insights powered by Streamlit</span>
            <a
              href="https://partnertech-crm.streamlit.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
            >
              Full Screen
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}