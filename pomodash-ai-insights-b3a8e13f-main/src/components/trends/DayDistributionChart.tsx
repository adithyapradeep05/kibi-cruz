
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { format, startOfWeek, addDays } from 'date-fns';
import { LogEntryType } from '@/types/logs';

interface DayDistributionChartProps {
  logs: LogEntryType[];
}

const COLORS = ['#9b87f5', '#F472B6', '#4ECDC4', '#FF9E40', '#FF6B6B', '#A78BFA'];

const DayDistributionChart: React.FC<DayDistributionChartProps> = ({ logs }) => {
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
    <div className="flex items-center justify-center h-56">
      {logs.length > 0 ? (
        <ChartContainer config={{}} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={getDayOfWeekData().filter(day => day.count > 0)}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                nameKey="name"
                label={({ name, percent }) => 
                  percent > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''
                }
              >
                {getDayOfWeekData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      ) : (
        <div className="text-center text-muted-foreground">No data available</div>
      )}
    </div>
  );
};

export default DayDistributionChart;
