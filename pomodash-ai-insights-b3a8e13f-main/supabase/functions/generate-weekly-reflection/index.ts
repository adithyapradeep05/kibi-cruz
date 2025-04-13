
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { logs, goals, streak } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found in environment variables');
    }

    // Prepare data for analysis
    const logsInfo = logs.map(log => ({
      date: new Date(log.startTime).toLocaleDateString(),
      duration: Math.round(log.duration / 60), // in minutes
      content: log.content,
      completedTasks: log.tasks?.filter(t => t.completed).length || 0,
      totalTasks: log.tasks?.length || 0
    }));

    const goalsInfo = goals.map(goal => ({
      title: goal.title,
      progress: goal.progress,
      status: goal.status
    }));

    const promptContent = `
Generate a friendly, encouraging weekly reflection summary for a productivity app user.

Here is their data from the past week:
- Focus sessions logged: ${logs.length}
- Total focus time: ${logs.reduce((sum, log) => sum + log.duration, 0) / 60} minutes
- Current streak: ${streak.currentStreak} days
- Tasks completed: ${logs.reduce((sum, log) => sum + (log.tasks?.filter(t => t.completed).length || 0), 0)}
- Active goals: ${goalsInfo.filter(g => g.status === 'active').map(g => g.title).join(', ')}

Write a natural-sounding summary (about 3-4 sentences) that:
1. Highlights their accomplishments
2. Mentions any patterns in their productivity
3. Provides friendly encouragement
4. Suggests one specific thing they could focus on next week

The tone should be like a supportive productivity coach - encouraging without being pushy.
`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a supportive productivity coach that provides personalized weekly reflection summaries.'
          },
          {
            role: 'user',
            content: promptContent
          }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error details:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const summary = data.choices[0].message.content;

    return new Response(JSON.stringify({ summary }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in weekly reflection generation:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
