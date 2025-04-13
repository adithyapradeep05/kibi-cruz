
import { LogEntryType } from '@/types/logs';
import { format, isToday, isThisWeek, parseISO } from 'date-fns';

// Local analysis implementation that mimics what OpenAI would return
export const generateLocalAnalysis = (logs: LogEntryType[]): string => {
  if (logs.length === 0) {
    return "No work sessions logged yet. Start tracking your productivity to see insights.";
  }

  // Count sessions by day of week
  const dayCount: Record<string, number> = {};
  const wordsByDay: Record<string, string[]> = {};
  
  logs.forEach(log => {
    const date = parseISO(log.startTime);
    const day = format(date, 'EEEE');
    
    dayCount[day] = (dayCount[day] || 0) + 1;
    
    // Extract words from content for basic content analysis
    const words = log.content
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    if (!wordsByDay[day]) {
      wordsByDay[day] = [];
    }
    
    wordsByDay[day].push(...words);
  });

  // Find most productive day
  let mostProductiveDay = '';
  let maxSessions = 0;
  
  Object.entries(dayCount).forEach(([day, count]) => {
    if (count > maxSessions) {
      mostProductiveDay = day;
      maxSessions = count;
    }
  });

  // Count today's and this week's sessions
  const todaySessions = logs.filter(log => isToday(parseISO(log.startTime))).length;
  const weekSessions = logs.filter(log => isThisWeek(parseISO(log.startTime))).length;

  // Calculate average session duration
  const totalDuration = logs.reduce((sum, log) => sum + log.duration, 0);
  const avgDurationMinutes = Math.round(totalDuration / logs.length / 60);

  // Find most common words (basic content analysis)
  const allWords = Object.values(wordsByDay).flat();
  const wordFrequency: Record<string, number> = {};
  
  allWords.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });
  
  const sortedWords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);

  // Build analysis text
  return `
🔍 **Productivity Analysis**

Based on your logged work sessions, here's what I've noticed:

⏱️ **Work Patterns:**
- Your most productive day appears to be ${mostProductiveDay} with ${maxSessions} sessions.
- Average work session duration: ${avgDurationMinutes} minutes.
- You've completed ${todaySessions} sessions today and ${weekSessions} this week.

🔑 **Content Analysis:**
Top themes in your work: ${sortedWords.length > 0 ? sortedWords.join(', ') : 'Not enough data yet'}.

💡 **Suggestions:**
${getMockSuggestions(mostProductiveDay, avgDurationMinutes)}

Keep tracking your productivity! As you log more sessions, these insights will become more accurate and helpful.
`;
};

// Mock suggestions based on simple patterns
export const getMockSuggestions = (mostProductiveDay: string, avgDuration: number): string => {
  const suggestions = [];
  
  if (avgDuration < 20) {
    suggestions.push("Consider longer focus sessions. Research shows that 25-45 minute sessions are often optimal for deep work.");
  } else if (avgDuration > 50) {
    suggestions.push("Your sessions are quite long. Consider adding more breaks to maintain energy and focus throughout the day.");
  }
  
  if (mostProductiveDay) {
    suggestions.push(`You seem most productive on ${mostProductiveDay}s. Consider scheduling your most important tasks on this day.`);
  }
  
  if (suggestions.length === 0) {
    suggestions.push("Continue your current rhythm, it appears to be working well for you.");
    suggestions.push("Try experimenting with different session lengths to find your optimal focus time.");
  }
  
  return suggestions.join("\n- ");
};
