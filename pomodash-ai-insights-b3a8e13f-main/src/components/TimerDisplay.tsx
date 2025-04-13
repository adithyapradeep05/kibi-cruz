
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface TimerDisplayProps {
  time: string;
  phaseName: string;
  progress?: number; // Progress value from 0-100
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ 
  time, 
  phaseName,
  progress = 0 
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <div className="bg-[#151e2d] rounded-xl w-[320px] h-[140px] flex items-center justify-center border-[4px] border-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.3)] relative overflow-hidden">
          <div className="font-bubblegum text-6xl font-extrabold text-[#10b981] drop-shadow-[0_3px_0_rgba(5,150,105,0.7)]">
            {time}
          </div>
        </div>
      </div>
      <div className="text-2xl text-[#10b981] mt-4 mb-5 font-bubblegum drop-shadow-[0_2px_0_rgba(5,150,105,0.7)]">
        {phaseName}
      </div>
      <div className="w-full px-6 mb-4">
        <Progress 
          value={progress} 
          className="h-5 bg-[#151e2d] rounded-lg border-[3px] border-[#0f172a]"
          indicatorClassName="bg-[#10b981] shadow-lg shadow-[#10b981]/30 rounded-sm"
        />
      </div>
    </div>
  );
};

export default TimerDisplay;
