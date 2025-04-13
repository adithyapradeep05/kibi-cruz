
import React from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { LogEntryType } from '@/types/logs';

interface ProductivityStatsProps {
  logs: LogEntryType[];
}

const ProductivityStats: React.FC<ProductivityStatsProps> = ({ logs }) => {
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
    <div className="grid grid-cols-1 gap-4 h-56 overflow-auto py-2">
      <div className="bg-background/40 p-3 rounded-lg">
        <div className="text-sm font-medium text-muted-foreground">Most Active Day</div>
        <div className="text-xl font-semibold mt-1">
          {getDayOfWeekData().reduce((max, day) => day.count > max.count ? day : max, { name: 'None', count: 0 }).name}
        </div>
      </div>
      
      <div className="bg-background/40 p-3 rounded-lg">
        <div className="text-sm font-medium text-muted-foreground">Longest Average Sessions</div>
        <div className="text-xl font-semibold mt-1">
          {getAvgDurationByDay().reduce((max, day) => day.avgMinutes > max.avgMinutes ? day : max, { name: 'None', avgMinutes: 0 }).name}
        </div>
      </div>
      
      <div className="bg-background/40 p-3 rounded-lg">
        <div className="text-sm font-medium text-muted-foreground">Preferred Time</div>
        <div className="text-xl font-semibold mt-1">
          {getTimeOfDayData().reduce((max, time) => time.count > max.count ? time : max, { name: 'None', count: 0 }).name}
        </div>
      </div>
    </div>
  );
};

export default ProductivityStats;
