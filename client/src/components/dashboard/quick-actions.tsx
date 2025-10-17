import { Upload, FolderSync, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface QuickActionsProps {
  userId: string;
}

export default function QuickActions({ userId }: QuickActionsProps) {
  const { toast } = useToast();

  const handleUploadKnowledge = () => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.md,.pdf,.doc,.docx';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const content = await file.text();
        
        const response = await apiRequest("POST", "/api/brain/ingest", {
          userId,
          filename: file.name,
          content
        });

        if (response.ok) {
          toast({
            title: "Knowledge Uploaded",
            description: `Successfully processed ${file.name}`,
          });
        }
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: "Failed to process the file. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    input.click();
  };

  const handleSyncCRM = async () => {
    try {
      const response = await apiRequest("POST", "/api/crm/sync", { userId });
      
      if (response.ok) {
        const result = await response.json();
        toast({
          title: "CRM FolderSync",
          description: result.success ? "Successfully synced with CRM" : "CRM sync failed",
          variant: result.success ? "default" : "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "FolderSync Failed",
        description: "Failed to sync with CRM. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEnterGodmode = async () => {
    try {
      const response = await apiRequest("POST", "/api/godmode/execute", {
        type: "system_status",
        parameters: {},
        userId
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Godmode Activated",
          description: `System status: ${result.result?.status || 'Unknown'}`,
        });
      }
    } catch (error) {
      toast({
        title: "Godmode Failed",
        description: "Failed to access Godmode. Check your permissions.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 border-b border-slate-700">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
        Quick Actions
      </h3>
      
      <div className="space-y-3">
        <Button
          onClick={handleUploadKnowledge}
          className="w-full flex items-center space-x-3 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 text-indigo-400"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Knowledge</span>
        </Button>
        
        <Button
          onClick={handleSyncCRM}
          variant="outline"
          className="w-full flex items-center space-x-3 border-slate-600 hover:bg-slate-600 text-gray-300 hover:text-emerald-400"
        >
          <FolderSync className="w-4 h-4" />
          <span>FolderSync CRM</span>
        </Button>
        
        <Button
          onClick={handleEnterGodmode}
          variant="outline"
          className="w-full flex items-center space-x-3 border-slate-600 hover:bg-slate-600 text-gray-300 hover:text-purple-400"
        >
          <Crown className="w-4 h-4" />
          <span>Enter Godmode</span>
        </Button>
      </div>
    </div>
  );
}
