
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
    const { goal } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found in environment variables');
    }

    // Prepare goal data for OpenAI analysis
    const formattedGoal = {
      title: goal.title,
      description: goal.description,
      createdAt: goal.createdAt,
      targetDate: goal.targetDate,
      progress: goal.progress,
      category: goal.category,
      tasks: goal.tasks.map(task => ({
        content: task.content,
        completed: task.completed
      }))
    };

    const prompt = `
    Analyze the following goal and provide insights:
    
    Goal: ${JSON.stringify(formattedGoal, null, 2)}
    
    Please provide:
    1. 🎯 **Progress Overview**: A brief assessment of current progress (${goal.progress}%)
    2. 📊 **Task Analysis**: Insights on completed vs pending tasks
    3. 🔍 **Next Steps**: Recommend the 2-3 most important next actions based on pending tasks
    4. ⏱️ **Timeline Assessment**: If there's a target date, assess if the goal is on track
    5. 💡 **Optimization Tips**: 2-3 specific suggestions to improve progress
    
    Format your response with markdown, using the emoji headers above. Make the insights personalized, positive, and actionable. Keep your analysis concise and focused on helping achieve this goal efficiently.
    `;

    console.log("Sending request to OpenAI for goal analysis");

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
            content: 'You are an expert goal coach and productivity analyst. Your analysis should be specific, evidence-based, and immediately useful. Focus on providing actionable insights, not general advice.'
          },
          {
            role: 'user',
            content: prompt
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
    console.log("OpenAI goal analysis response received");
    const analysisText = data.choices[0].message.content;

    return new Response(JSON.stringify({ analysis: analysisText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-goal function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
