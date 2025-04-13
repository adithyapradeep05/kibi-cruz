
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { format, startOfWeek, addDays } from 'date-fns';
import { LogEntryType } from '@/types/logs';

interface SessionLengthChartProps {
  logs: LogEntryType[];
}

const SessionLengthChart: React.FC<SessionLengthChartProps> = ({ logs }) => {
  const getAvgDurationByDay = () => {
    const durationsSum = Array(7).fill(0);
    const counts = Array(7).fill(0);
    
    logs.forEach(log => {
      const date = new Date(log.startTime);
      const dayIndex = date.getDay();
      durationsSum[dayIndex] += log.duration;
      counts[dayIndex] += 1;
    });
    
    return Array(7).fill(0).map((_, i) => ({
      name: format(addDays(startOfWeek(new Date()), i), 'EEE'),
      avgMinutes: counts[i] > 0 ? Math.round(durationsSum[i] / counts[i] / 60) : 0
    }));
  };

  return (
    <div className="h-56">
      <ChartContainer config={{}} className="h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={getAvgDurationByDay()}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Bar dataKey="avgMinutes" fill="#9b87f5" name="Average Minutes">
              <defs>
                <linearGradient id="accentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9b87f5" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#9b87f5" stopOpacity={0.5}/>
                </linearGradient>
              </defs>
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default SessionLengthChart;
