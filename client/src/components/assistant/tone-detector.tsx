import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface ToneAnalysis {
  tone: string;
  confidence: number;
  escalationRequired: boolean;
}

interface ToneDetectorProps {
  tone?: ToneAnalysis | null;
}

export default function ToneDetector({ tone }: ToneDetectorProps) {
  if (!tone) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1 bg-slate-700/50 border border-slate-600 rounded-lg">
        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
        <span className="text-sm text-gray-400">Tone: Waiting</span>
      </div>
    );
  }

  const getToneColor = (toneName: string, escalationRequired: boolean) => {
    if (escalationRequired) {
      return {
        bg: "bg-red-500/10",
        border: "border-red-500/20",
        text: "text-red-400",
        icon: AlertTriangle
      };
    }

    switch (toneName.toLowerCase()) {
      case 'positive':
      case 'friendly':
      case 'satisfied':
        return {
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/20", 
          text: "text-emerald-400",
          icon: CheckCircle
        };
      case 'analytical':
      case 'professional':
      case 'neutral':
        return {
          bg: "bg-blue-500/10",
          border: "border-blue-500/20",
          text: "text-blue-400", 
          icon: Clock
        };
      default:
        return {
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/20",
          text: "text-yellow-400",
          icon: AlertTriangle
        };
    }
  };

  const toneStyle = getToneColor(tone.tone, tone.escalationRequired);
  const ToneIcon = toneStyle.icon;

  return (
    <div className={`flex items-center space-x-2 px-3 py-1 ${toneStyle.bg} border ${toneStyle.border} rounded-lg`}>
      <div className={`w-2 h-2 ${tone.escalationRequired ? 'animate-pulse' : ''} rounded-full`}>
        <ToneIcon className={`w-2 h-2 ${toneStyle.text}`} />
      </div>
      <span className={`text-sm ${toneStyle.text} capitalize`}>
        Tone: {tone.tone}
      </span>
      {tone.escalationRequired && (
        <span className="text-xs bg-red-500/20 text-red-400 px-1 py-0.5 rounded">
          Escalate
        </span>
      )}
    </div>
  );
}
