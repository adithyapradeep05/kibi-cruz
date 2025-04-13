
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    const { goalTitle, goalDescription, goalCategory } = await req.json();
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found');
    }

    if (!goalTitle) {
      throw new Error('Goal title is required');
    }

    console.log(`Generating tasks for goal: ${goalTitle}`);

    const prompt = `
Generate a list of 4-6 specific, actionable tasks to achieve this goal:

Goal: ${goalTitle}
${goalDescription ? `Description: ${goalDescription}` : ''}
${goalCategory ? `Category: ${goalCategory}` : ''}

Create tasks that are:
1. Clear and specific
2. Actionable (start with a verb)
3. Realistic and achievable
4. Organized in a logical sequence

Return ONLY the tasks as an array of strings, with no additional text, formatted exactly like this:
["Task 1", "Task 2", "Task 3", "Task 4"]
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that generates clear, actionable tasks for achieving goals. You will return ONLY a JSON array of task strings, nothing else.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`OpenAI API error: ${data.error.message}`);
    }
    
    let generatedTasks = [];
    
    try {
      const content = data.choices[0].message.content.trim();
      // Try to parse the JSON directly
      generatedTasks = JSON.parse(content);
    } catch (parseError) {
      console.error("Error parsing OpenAI response as JSON:", parseError);
      // Fallback: try to extract an array from the text response
      const match = data.choices[0].message.content.match(/\[(.*)\]/s);
      if (match && match[1]) {
        // Split by commas and clean up each task
        generatedTasks = match[1]
          .split('","')
          .map(t => t.replace(/^"|"$|\\"/g, '').trim())
          .filter(t => t.length > 0);
      } else {
        // Last resort: split by newlines
        generatedTasks = data.choices[0].message.content
          .split('\n')
          .map(line => line.replace(/^[0-9]+\.\s*|-\s*/g, '').trim())
          .filter(line => line.length > 0);
      }
    }

    return new Response(JSON.stringify({ tasks: generatedTasks }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-tasks function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
