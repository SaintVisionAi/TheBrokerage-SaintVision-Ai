import React from 'react';
import { CheckCircle, Clock, Circle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface Stage {
  name: string;
  status: 'completed' | 'current' | 'pending';
  stage: string;
}

interface PipelineProgressProps {
  stages: Stage[];
  currentStage?: string;
  progressPercentage?: number;
  compact?: boolean;
}

export default function PipelineProgress({
  stages,
  currentStage,
  progressPercentage = 0,
  compact = false
}: PipelineProgressProps) {
  if (!stages || stages.length === 0) {
    return (
      <div className="text-center py-8 text-white/50">
        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
        <p>No application data available</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-white">{currentStage || 'Not Started'}</span>
          <span className="text-xs text-yellow-400 font-bold">{Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex gap-1">
          {stages.map((stage, idx) => (
            <div
              key={idx}
              className={cn(
                'h-1 flex-1 rounded-full transition-all',
                stage.status === 'completed' ? 'bg-emerald-400' : stage.status === 'current' ? 'bg-yellow-400 animate-pulse' : 'bg-white/20'
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-white text-lg">Pipeline Progress</h3>
        <span className="text-sm font-bold text-yellow-400">{Math.round(progressPercentage)}% Complete</span>
      </div>

      <Progress value={progressPercentage} className="h-3" />

      <div className="space-y-3">
        {stages.map((stage, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {stage.status === 'completed' ? (
                <div className="h-8 w-8 rounded-full bg-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-400/30">
                  <CheckCircle className="h-5 w-5 text-black" />
                </div>
              ) : stage.status === 'current' ? (
                <div className="h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center animate-pulse shadow-lg shadow-yellow-400/30">
                  <Clock className="h-5 w-5 text-black" />
                </div>
              ) : (
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Circle className="h-5 w-5 text-white/40" />
                </div>
              )}
            </div>

            <div className="flex-1 pt-0.5">
              <div className={cn(
                'font-semibold',
                stage.status === 'completed' ? 'text-emerald-400' : stage.status === 'current' ? 'text-yellow-400' : 'text-white/60'
              )}>
                {stage.name}
              </div>
              {stage.status === 'current' && (
                <div className="text-xs text-yellow-400/70 font-medium mt-0.5">In Progress</div>
              )}
              {stage.status === 'completed' && (
                <div className="text-xs text-emerald-400/70 font-medium mt-0.5">Completed</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
