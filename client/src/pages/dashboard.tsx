import { useQuery } from "@tanstack/react-query";
import QuickActions from "@/components/dashboard/quick-actions";
import RecentActivity from "@/components/dashboard/recent-activity";
import SystemMetrics from "@/components/dashboard/system-metrics";
import ToneDetector from "@/components/assistant/tone-detector";
import ChatInterface from "@/components/chat/chat-interface";
import MemoryAwareAssistant from "@/components/ai/memory-aware-assistant";
import ChatClient from "@/components/ai/chat-client";
import FileUploader from "@/components/ai/file-uploader";
import CRMStream from "@/components/ai/crm-stream";
import AzureSpeech from "@/components/ai/azure-speech";
import LeadsList from "@/components/brokerage/leads-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, MessageCircle, Upload, Users, Gauge, Activity, Mic, Building2 } from "lucide-react";

export default function Dashboard() {
  const { data: systemStatus } = useQuery({
    queryKey: ["/api/system/status"],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                SaintSal™ Dashboard
              </h1>
              <p className="text-slate-300">HACP™ Powered AI Assistant Platform • Where AI meets intuition</p>
            </div>
            <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
              ✨ Fully Integrated
            </Badge>
          </div>
        </header>

        {/* AI Components Showcase */}
        <Tabs defaultValue="chat" className="mb-8">
          <TabsList className="grid w-full grid-cols-8 bg-slate-800/50 border-slate-700">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="memory" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Memory
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Mic className="w-4 h-4" />
              Voice
            </TabsTrigger>
            <TabsTrigger value="brain" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Brain
            </TabsTrigger>
            <TabsTrigger value="crm" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              CRM
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <Gauge className="w-4 h-4" />
              Metrics
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="brokerage" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Brokerage
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChatClient />
              <ChatInterface />
            </div>
          </TabsContent>

          <TabsContent value="memory" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MemoryAwareAssistant userId="1" />
              <ToneDetector />
            </div>
          </TabsContent>

          <TabsContent value="voice" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AzureSpeech onTranscription={(text) => console.log('Transcribed:', text)} />
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white mb-4">HACP™ Live Voice Features</h3>
                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                  <div className="text-center text-slate-400">
                    <Mic className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                    <p className="mb-2">Azure Speech Integration</p>
                    <p className="text-sm">Real-time speech-to-text and text-to-speech</p>
                    <div className="mt-4 space-y-2">
                      <Badge variant="outline" className="border-blue-500/30 text-blue-400">Voice Recognition</Badge>
                      <Badge variant="outline" className="border-purple-500/30 text-purple-400 ml-2">Speech Synthesis</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="brain" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FileUploader />
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white mb-4">Brain Ingestion Status</h3>
                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                  <div className="text-center text-slate-400">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-emerald-400" />
                    <p className="mb-2">Ready to ingest knowledge</p>
                    <p className="text-sm">Upload files to expand SaintSal's brain</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="crm" className="mt-6">
            <CRMStream />
          </TabsContent>

          <TabsContent value="metrics" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SystemMetrics />
              </div>
              <div>
                <QuickActions userId="1" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <RecentActivity userId="1" />
          </TabsContent>

          <TabsContent value="brokerage" className="mt-6">
            <Card className="bg-slate-800/30 border-slate-700">
              <CardContent className="p-6">
                <LeadsList />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Integration Status */}
        <div className="bg-gradient-to-r from-emerald-900/20 to-teal-900/20 rounded-lg p-6 border border-emerald-500/20">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
              ✅ Integration Complete
            </Badge>
            SaintSal™ Platform Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <MessageCircle className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-sm text-slate-300">OpenAI Chat</p>
              <Badge variant="outline" className="border-green-500/30 text-green-400 text-xs">Ready</Badge>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-sm text-slate-300">Memory Assistant</p>
              <Badge variant="outline" className="border-purple-500/30 text-purple-400 text-xs">Active</Badge>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Mic className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-sm text-slate-300">Azure Speech</p>
              <Badge variant="outline" className="border-blue-500/30 text-blue-400 text-xs">Live</Badge>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Upload className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-sm text-slate-300">Brain Ingestion</p>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-xs">Ready</Badge>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-orange-400" />
              </div>
              <p className="text-sm text-slate-300">CRM Stream</p>
              <Badge variant="outline" className="border-orange-500/30 text-orange-400 text-xs">Live</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
