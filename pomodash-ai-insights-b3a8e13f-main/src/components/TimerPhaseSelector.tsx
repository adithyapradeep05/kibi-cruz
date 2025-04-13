
import React from 'react';
import { Button } from "@/components/ui/button";
import { Clock, Coffee, Leaf } from 'lucide-react';
import { TimerPhase } from '@/types/timer';

interface TimerPhaseSelectorProps {
  currentPhase: TimerPhase;
  onChangePhase: (phase: TimerPhase) => void;
}

const TimerPhaseSelector: React.FC<TimerPhaseSelectorProps> = ({
  currentPhase,
  onChangePhase
}) => {
  return (
    <div className="flex justify-center space-x-3 w-full mb-6">
      <Button
        variant="ghost"
        size="sm"
        className={`rounded-lg py-3 px-4 flex-1 transition-all duration-300 border-[4px] ${
          currentPhase === "work" 
            ? "bg-[#10b981] border-[#0f172a] text-white shadow-[0_6px_0_rgba(5,150,105,0.7)] active:shadow-[0_2px_0_rgba(5,150,105,0.7)] active:translate-y-2 font-bold" 
            : "bg-[#151e2d] border-[#0f172a]/40 text-[#10b981] hover:bg-[#1e293b] hover:border-[#0f172a]/70 shadow-[0_6px_0_rgba(5,150,105,0.3)] hover:shadow-[0_8px_0_rgba(5,150,105,0.3)] active:shadow-[0_2px_0_rgba(5,150,105,0.3)] active:translate-y-2 font-medium"
        } transform hover:scale-105 active:scale-95`}
        onClick={() => onChangePhase("work")}
      >
        <Clock className="mr-1 h-4 w-4" />
        Focus
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`rounded-lg py-3 px-4 flex-1 transition-all duration-300 border-[4px] ${
          currentPhase === "shortBreak" 
            ? "bg-[#10b981] border-[#0f172a] text-white shadow-[0_6px_0_rgba(5,150,105,0.7)] active:shadow-[0_2px_0_rgba(5,150,105,0.7)] active:translate-y-2 font-bold" 
            : "bg-[#151e2d] border-[#0f172a]/40 text-[#10b981] hover:bg-[#1e293b] hover:border-[#0f172a]/70 shadow-[0_6px_0_rgba(5,150,105,0.3)] hover:shadow-[0_8px_0_rgba(5,150,105,0.3)] active:shadow-[0_2px_0_rgba(5,150,105,0.3)] active:translate-y-2 font-medium"
        } transform hover:scale-105 active:scale-95`}
        onClick={() => onChangePhase("shortBreak")}
      >
        <Coffee className="mr-1 h-4 w-4" />
        Short Break
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`rounded-lg py-3 px-4 flex-1 transition-all duration-300 border-[4px] ${
          currentPhase === "longBreak" 
            ? "bg-[#10b981] border-[#0f172a] text-white shadow-[0_6px_0_rgba(5,150,105,0.7)] active:shadow-[0_2px_0_rgba(5,150,105,0.7)] active:translate-y-2 font-bold" 
            : "bg-[#151e2d] border-[#0f172a]/40 text-[#10b981] hover:bg-[#1e293b] hover:border-[#0f172a]/70 shadow-[0_6px_0_rgba(5,150,105,0.3)] hover:shadow-[0_8px_0_rgba(5,150,105,0.3)] active:shadow-[0_2px_0_rgba(5,150,105,0.3)] active:translate-y-2 font-medium"
        } transform hover:scale-105 active:scale-95`}
        onClick={() => onChangePhase("longBreak")}
      >
        <Leaf className="mr-1 h-4 w-4" />
        Long Break
      </Button>
    </div>
  );
};

export default TimerPhaseSelector;
