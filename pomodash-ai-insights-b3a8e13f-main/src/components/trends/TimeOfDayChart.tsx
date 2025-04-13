
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { LogEntryType } from '@/types/logs';

interface TimeOfDayChartProps {
  logs: LogEntryType[];
}

const COLORS = ['#9b87f5', '#F472B6', '#4ECDC4', '#FF9E40', '#FF6B6B', '#A78BFA'];

const TimeOfDayChart: React.FC<TimeOfDayChartProps> = ({ logs }) => {
  const getTimeOfDayData = () => {
    const timeGroups = [
      { name: 'Morning (5-12)', count: 0 },
      { name: 'Afternoon (12-17)', count: 0 },
      { name: 'Evening (17-21)', count: 0 },
      { name: 'Night (21-5)', count: 0 }
    ];

    logs.forEach(log => {
      const date = new Date(log.startTime);
      const hour = date.getHours();

      if (hour >= 5 && hour < 12) {
        timeGroups[0].count += 1;
      } else if (hour >= 12 && hour < 17) {
        timeGroups[1].count += 1;
      } else if (hour >= 17 && hour < 21) {
        timeGroups[2].count += 1;
      } else {
        timeGroups[3].count += 1;
      }
    });

    return timeGroups;
  };

  return (
    <div className="h-56">
      <ChartContainer config={{}} className="h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={getTimeOfDayData()}
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
              {getTimeOfDayData().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default TimeOfDayChart;
