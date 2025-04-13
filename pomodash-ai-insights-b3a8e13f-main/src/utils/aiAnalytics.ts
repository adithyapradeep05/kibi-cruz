
import { LogEntryType } from '@/types/logs';
import { getStoredApiKey, hasApiKey } from './apiKeyStorage';
import { generateLocalAnalysis } from './localAnalysis';
import { formatLogsForAnalysis } from './analysisStats';
import { generateAnalysisPrompt } from './promptGenerator';
import { supabase } from '@/integrations/supabase/client';

// Re-export the API key functions for backward compatibility
export { getStoredApiKey, setApiKey, hasApiKey } from './apiKeyStorage';

export const analyzeLogTrends = async (logs: LogEntryType[]): Promise<string> => {
  if (logs.length === 0) {
    return "No work sessions logged yet. Start tracking your productivity to see insights.";
  }

  try {
    console.log(`Starting analysis of ${logs.length} logs...`);
    
    // Prepare log data for analysis
    const logsForAnalysis = formatLogsForAnalysis(logs);
    const prompt = generateAnalysisPrompt(logs, logsForAnalysis);

    console.log("Sending request to Supabase Edge Function...");

    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('analyze-productivity', {
      body: { prompt }
    });

    if (error) {
      console.error("Supabase Edge Function error:", error);
      throw new Error(`Edge Function error: ${error.message}`);
    }

    console.log("Edge Function response received");
    return data.generatedText;
  } catch (error) {
    console.error('Error analyzing logs with Edge Function:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return "Invalid API key. Please check your OpenAI API key in the Supabase Edge Function settings.";
      }
      return `Error: ${error.message}`;
    }
    
    return "Unable to analyze logs. Please try again later.";
  }
};

// Export local analysis implementation for backward compatibility
export { generateLocalAnalysis } from './localAnalysis';
