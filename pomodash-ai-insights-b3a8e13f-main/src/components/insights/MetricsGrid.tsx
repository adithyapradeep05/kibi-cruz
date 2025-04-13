
import React from 'react';
import { Clock, Target, Sparkles } from 'lucide-react';
import { LogEntryType } from '@/types/logs';
import { isToday, parseISO } from 'date-fns';
import FocusMetrics from '../trends/FocusMetrics';

interface MetricsGridProps {
  logs: LogEntryType[];
}

const MetricsGrid: React.FC<MetricsGridProps> = ({ logs }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <FocusMetrics 
          title="Today" 
          value="0" 
          icon={<Clock className="h-4 w-4 text-primary" />} 
        />
        <FocusMetrics 
          title="Total Sessions" 
          value="0" 
          icon={<Target className="h-4 w-4 text-accent" />} 
        />
        <FocusMetrics 
          title="Focus Time" 
          value="0 min" 
          icon={<Clock className="h-4 w-4 text-primary" />} 
        />
        <FocusMetrics 
          title="Avg. Session" 
          value="0 min" 
          icon={<Sparkles className="h-4 w-4 text-accent" />} 
        />
      </div>
      
      <div className="text-center p-4 bg-[#1e293b]/30 rounded-lg border-[3px] border-[#0f172a]/30">
        <p className="text-white font-bold">Lol, we just started, but help us change that :)</p>
      </div>
    </div>
  );
};

export default MetricsGrid;
