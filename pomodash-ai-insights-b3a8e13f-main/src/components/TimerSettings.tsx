
import React from 'react';
import { cn } from '@/lib/utils';
import { Slider } from "@/components/ui/slider";
import { TimerSettings as TimerSettingsType } from '@/types/timer';

interface TimerSettingsProps {
  isVisible: boolean;
  settings: TimerSettingsType;
  onSettingsChange: (settings: TimerSettingsType) => void;
}

const TimerSettings: React.FC<TimerSettingsProps> = ({ 
  isVisible,
  settings,
  onSettingsChange
}) => {
  return (
    <div className={cn(
      "w-full transition-all duration-300 space-y-6 overflow-hidden rounded-3xl p-6 mt-8",
      isVisible 
        ? "max-h-[500px] opacity-100 bg-card-dark/80 border-2 border-white/5 shadow-lg shadow-kiwi-light/10" 
        : "max-h-0 opacity-0 p-0"
    )}>
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-white font-medium">Work Minutes</span>
          <span className="text-kiwi-light font-mono font-bold">{settings.workMinutes}</span>
        </div>
        <Slider
          min={5}
          max={60}
          step={5}
          value={[settings.workMinutes]}
          onValueChange={(value) => onSettingsChange({ ...settings, workMinutes: value[0] })}
          className="cursor-pointer h-2"
        />
      </div>
      
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-white font-medium">Short Break</span>
          <span className="text-kiwi-light font-mono font-bold">{settings.shortBreakMinutes}</span>
        </div>
        <Slider
          min={1}
          max={15}
          step={1}
          value={[settings.shortBreakMinutes]}
          onValueChange={(value) => onSettingsChange({ ...settings, shortBreakMinutes: value[0] })}
          className="cursor-pointer h-2"
        />
      </div>
      
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-white font-medium">Long Break</span>
          <span className="text-kiwi-light font-mono font-bold">{settings.longBreakMinutes}</span>
        </div>
        <Slider
          min={5}
          max={30}
          step={5}
          value={[settings.longBreakMinutes]}
          onValueChange={(value) => onSettingsChange({ ...settings, longBreakMinutes: value[0] })}
          className="cursor-pointer h-2"
        />
      </div>
      
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-white font-medium">Sessions Before Long Break</span>
          <span className="text-kiwi-light font-mono font-bold">{settings.pomosBeforeLongBreak}</span>
        </div>
        <Slider
          min={1}
          max={6}
          step={1}
          value={[settings.pomosBeforeLongBreak]}
          onValueChange={(value) => onSettingsChange({ ...settings, pomosBeforeLongBreak: value[0] })}
          className="cursor-pointer h-2"
        />
      </div>
    </div>
  );
};

export default TimerSettings;
