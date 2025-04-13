
import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

interface TimerControlsProps {
  isRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onToggleSettings: () => void;
}

const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  onToggleTimer,
  onResetTimer,
  onToggleSettings
}) => {
  return (
    <div className="flex justify-center space-x-8 mt-6">
      <Button
        variant="cartoon"
        size="lg"
        className="h-16 w-16 p-0 rounded-xl border-[4px] border-[#0f172a] bg-[#10b981] text-white hover:bg-[#10b981]/90 hover:text-white transform hover:scale-110 active:scale-95 transition-all duration-300 shadow-[0_8px_0_rgba(16,185,129,0.5)] hover:shadow-[0_10px_0_rgba(16,185,129,0.5)] active:shadow-[0_2px_0_rgba(16,185,129,0.5)] active:translate-y-4"
        onClick={onToggleTimer}
      >
        {isRunning ? <Pause size={32} /> : <Play size={32} />}
      </Button>
      <Button
        variant="cartoon-outline"
        size="lg"
        className="h-16 w-16 p-0 rounded-xl border-[4px] border-[#0f172a]/60 bg-[#151e2d] text-[#10b981] hover:bg-[#151e2d]/90 hover:text-[#10b981] hover:border-[#0f172a] transform hover:scale-110 active:scale-95 transition-all duration-300 shadow-[0_8px_0_rgba(16,185,129,0.3)] hover:shadow-[0_10px_0_rgba(16,185,129,0.3)] active:shadow-[0_2px_0_rgba(16,185,129,0.3)] active:translate-y-4 hover:rotate-180"
        onClick={onResetTimer}
      >
        <RotateCcw size={28} />
      </Button>
    </div>
  );
};

export default TimerControls;
