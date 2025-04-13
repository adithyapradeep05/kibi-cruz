
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { format, subDays, isSameDay, parseISO } from 'date-fns';
import { LogEntryType } from '@/types/logs';

interface ActivityLineChartProps {
  logs: LogEntryType[];
}

const ActivityLineChart: React.FC<ActivityLineChartProps> = ({ logs }) => {
  const getLast7DaysData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const sessionsCount = logs.filter(log => isSameDay(parseISO(log.startTime), date)).length;
      
      data.push({
        date: format(date, 'MMM dd'),
        sessions: sessionsCount,
      });
    }
    
    return data;
  };

  return (
    <div className="h-64 bg-secondary/50 rounded-lg p-4">
      <ChartContainer config={{}} className="h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={getLast7DaysData()} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Line 
              type="monotone" 
              dataKey="sessions" 
              stroke="#9b87f5" 
              strokeWidth={2}
              activeDot={{ r: 8, fill: "#9b87f5", stroke: "white", strokeWidth: 2 }}
              name="Focus Sessions"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default ActivityLineChart;
