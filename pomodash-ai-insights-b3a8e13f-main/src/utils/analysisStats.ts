
import { LogEntryType } from '@/types/logs';
import { format, isToday, isThisWeek, isThisMonth, parseISO } from 'date-fns';

// Generate statistics for OpenAI analysis
export const getLogStatistics = (logs: LogEntryType[]) => {
  // Basic stats
  const totalSessions = logs.length;
  const todaySessions = logs.filter(log => isToday(parseISO(log.startTime))).length;
  const weekSessions = logs.filter(log => isThisWeek(parseISO(log.startTime))).length;
  const monthSessions = logs.filter(log => isThisMonth(parseISO(log.startTime))).length;
  
  const totalDuration = logs.reduce((sum, log) => sum + log.duration, 0);
  const avgDurationMinutes = Math.round(totalDuration / logs.length / 60);
  
  // Day of week analysis
  const dayOfWeekMap: Record<string, number> = {};
  logs.forEach(log => {
    const date = new Date(log.startTime);
    const day = format(date, 'EEEE');
    dayOfWeekMap[day] = (dayOfWeekMap[day] || 0) + 1;
  });
  
  // Time of day analysis
  const timeOfDayData = {
    morning: logs.filter(log => {
      const hour = new Date(log.startTime).getHours();
      return hour >= 5 && hour < 12;
    }).length,
    afternoon: logs.filter(log => {
      const hour = new Date(log.startTime).getHours();
      return hour >= 12 && hour < 17;
    }).length,
    evening: logs.filter(log => {
      const hour = new Date(log.startTime).getHours();
      return hour >= 17 && hour < 21;
    }).length,
    night: logs.filter(log => {
      const hour = new Date(log.startTime).getHours();
      return hour >= 21 || hour < 5;
    }).length
  };
  
  // Content keyword analysis
  const contentWords = logs
    .map(log => log.content.toLowerCase())
    .join(' ')
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3);
    
  const wordFrequency: Record<string, number> = {};
  contentWords.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });
  
  const topKeywords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));

  return {
    totalSessions,
    todaySessions,
    weekSessions,
    monthSessions,
    avgDurationMinutes,
    totalDuration,
    dayOfWeekMap,
    timeOfDayData,
    topKeywords
  };
};

// Format logs for analysis
export const formatLogsForAnalysis = (logs: LogEntryType[]) => {
  return logs.map(log => ({
    phase: log.phase,
    date: format(new Date(log.startTime), 'yyyy-MM-dd'),
    time: format(new Date(log.startTime), 'HH:mm'),
    duration: Math.round(log.duration / 60), // in minutes
    content: log.content
  }));
};
