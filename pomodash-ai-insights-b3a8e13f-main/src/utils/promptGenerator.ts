
import { getLogStatistics } from './analysisStats';
import { LogEntryType } from '@/types/logs';

export const generateAnalysisPrompt = (logs: LogEntryType[], logsForAnalysis: any[]) => {
  const stats = getLogStatistics(logs);
  
  return `
    Analyze the following work sessions log data and provide detailed productivity insights:
    
    Basic Stats:
    - Total Sessions: ${stats.totalSessions}
    - Today's Sessions: ${stats.todaySessions}
    - This Week's Sessions: ${stats.weekSessions}
    - This Month's Sessions: ${stats.monthSessions}
    - Average Session Duration: ${stats.avgDurationMinutes} minutes
    - Total Focus Time: ${Math.round(stats.totalDuration / 60)} minutes
    
    Activity by Day of Week:
    ${Object.entries(stats.dayOfWeekMap)
      .map(([day, count]) => `- ${day}: ${count} sessions`)
      .join('\n')}
    
    Activity by Time of Day:
    - Morning (5-12): ${stats.timeOfDayData.morning} sessions
    - Afternoon (12-17): ${stats.timeOfDayData.afternoon} sessions
    - Evening (17-21): ${stats.timeOfDayData.evening} sessions
    - Night (21-5): ${stats.timeOfDayData.night} sessions
    
    Top Content Keywords:
    ${stats.topKeywords.map(k => `- ${k.word}: ${k.count} occurrences`).join('\n')}
    
    Log Entries Sample (up to 10 most recent):
    ${JSON.stringify(logsForAnalysis.slice(-10), null, 2)}
    
    Please provide:
    1. 🔍 **Productivity Overview**: A brief summary of overall productivity patterns
    2. ⏱️ **Timing Analysis**: When the person is most productive (days/times)
    3. 📊 **Content Insights**: What kinds of tasks they work on most frequently
    4. 💡 **Actionable Suggestions**: 3-4 specific, actionable tips to improve productivity based on the data
    5. 🎯 **Focus Strategy**: A personalized strategy suggestion for better focus sessions
    
    Format your response with markdown, using the emoji headers above, and include both high-level insights and specific details. Make the insights personalized, positive, and actionable.
    `;
};
