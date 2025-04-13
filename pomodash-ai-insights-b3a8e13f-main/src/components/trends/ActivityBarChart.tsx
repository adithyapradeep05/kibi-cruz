
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { format, startOfWeek, addDays } from 'date-fns';
import { LogEntryType } from '@/types/logs';

interface ActivityBarChartProps {
  logs: LogEntryType[];
}

const ActivityBarChart: React.FC<ActivityBarChartProps> = ({ logs }) => {
  const getDayOfWeekData = () => {
    const dayData = Array(7).fill(0).map((_, i) => ({
      name: format(addDays(startOfWeek(new Date()), i), 'EEE'),
      count: 0,
      totalMinutes: 0
    }));

    logs.forEach(log => {
      const date = new Date(log.startTime);
      const dayIndex = date.getDay();
      dayData[dayIndex].count += 1;
      dayData[dayIndex].totalMinutes += log.duration / 60;
    });

    return dayData;
  };

  return (
    <div className="h-64">
      <ChartContainer config={{}} className="h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={getDayOfWeekData()}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="#9b87f5" name="Focus Sessions" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default ActivityBarChart;
