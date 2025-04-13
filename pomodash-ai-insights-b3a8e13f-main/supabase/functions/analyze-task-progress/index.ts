
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
    const { tasks, goalTitle } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found in environment variables');
    }

    if (tasks.length === 0) {
      return new Response(JSON.stringify({ progress: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Format tasks for analysis with more detailed information
    const formattedTasks = tasks.map(task => ({
      content: task.content,
      completed: task.completed,
      date: task.logId ? 'Has been linked to a logged session' : 'Not linked to any session'
    }));

    const prompt = `
    Analyze the following tasks for a goal titled "${goalTitle}" and determine overall progress percentage (0-100):
    
    ${JSON.stringify(formattedTasks, null, 2)}
    
    Based on the tasks' status and content, determine an appropriate progress percentage.
    For incomplete tasks, estimate partial progress based on the task description.
    Consider word choice, complexity, and dependencies implied in the tasks.
    A task linked to a logged session may indicate more progress than others.
    Return ONLY a number between 0 and 100 representing the percentage completion.
    `;

    console.log("Sending request to OpenAI for task progress analysis");

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a goal progress analyzer specializing in understanding task descriptions. Analyze the tasks and determine a progress percentage. Respond with ONLY a number between 0 and 100.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error details:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const progressText = data.choices[0].message.content.trim();
    
    // Extract number from response
    const progressNumber = parseInt(progressText.match(/\d+/)?.[0] || '0', 10);
    
    // Validate result is in range
    const progress = Math.min(100, Math.max(0, progressNumber));
    console.log(`AI progress analysis result: ${progress}%`);
    
    return new Response(JSON.stringify({ progress }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-task-progress function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
