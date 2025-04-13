
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { reflection, email } = await req.json();
    
    if (!reflection || !email) {
      throw new Error('Missing required data: reflection or email');
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      throw new Error('Resend API key not found in environment variables');
    }

    // Generate email HTML
    const emailHTML = generateEmailHTML(reflection);

    // Send email using Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Kiwi Productivity <productivity@resend.dev>',
        to: email,
        subject: `Your Weekly Reflection - ${new Date(reflection.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`,
        html: emailHTML,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Resend API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return new Response(JSON.stringify({ id: data.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in send-weekly-reflection function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

const generateEmailHTML = (reflection: any) => {
  const date = new Date(reflection.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Your Weekly Reflection</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .container {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      padding: 30px;
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
      margin-bottom: 20px;
    }
    .logo {
      max-width: 120px;
      margin-bottom: 10px;
    }
    h1 {
      color: #33C3F0;
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    h2 {
      font-size: 18px;
      color: #333;
      margin-top: 25px;
      margin-bottom: 10px;
    }
    .date {
      color: #888;
      margin-top: 5px;
    }
    .summary {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 6px;
      margin: 20px 0;
      font-style: italic;
    }
    .stat {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .stat-label {
      color: #666;
    }
    .stat-value {
      font-weight: 500;
    }
    .section {
      margin-bottom: 25px;
    }
    .focus-item {
      background: #e6f7ff;
      padding: 10px 15px;
      border-radius: 6px;
      margin-bottom: 10px;
    }
    .mood {
      display: inline-block;
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
      background: #33C3F0;
      color: white;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      color: #888;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Weekly Reflection</h1>
      <div class="date">${date}</div>
    </div>
    
    <div class="summary">
      "${reflection.summary}"
    </div>
    
    <div class="section">
      <h2>Your Week in Numbers</h2>
      <div class="stat">
        <span class="stat-label">Tasks Completed:</span>
        <span class="stat-value">${reflection.stats.tasksCompleted} of ${reflection.stats.totalTasks}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Focus Sessions:</span>
        <span class="stat-value">${reflection.stats.focusSessionsCount}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Total Focus Time:</span>
        <span class="stat-value">${reflection.stats.totalFocusMinutes} minutes</span>
      </div>
      <div class="stat">
        <span class="stat-label">Streak Status:</span>
        <span class="stat-value">${reflection.stats.streakStatus}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Progress Momentum:</span>
        <span class="stat-value">${reflection.progressMomentum}/10</span>
      </div>
    </div>
    
    <div class="section">
      <h2>Mood & Energy</h2>
      <div class="stat">
        <span class="stat-label">Overall Mood:</span>
        <span class="mood">${reflection.moodTrend}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Energy Levels:</span>
        <span class="mood" style="background: #6c5ce7;">${reflection.energyLevel}</span>
      </div>
    </div>
    
    ${reflection.activeGoals.length > 0 ? `
    <div class="section">
      <h2>Most Active Goals</h2>
      ${reflection.activeGoals.map(goal => `<div class="focus-item">${goal}</div>`).join('')}
    </div>
    ` : ''}
    
    ${reflection.ignoredGoals.length > 0 ? `
    <div class="section">
      <h2>Goals Needing Attention</h2>
      ${reflection.ignoredGoals.map(goal => `<div class="focus-item" style="background: #fff3cd;">${goal}</div>`).join('')}
    </div>
    ` : ''}
    
    <div class="section">
      <h2>Focus for Next Week</h2>
      ${reflection.nextWeekFocus.map(item => `<div class="focus-item" style="background: #d4edda;">${item}</div>`).join('')}
    </div>
    
    <div class="footer">
      <p>Keep up the great work! See you next week.</p>
      <p>This email was sent by Kiwi Productivity</p>
    </div>
  </div>
</body>
</html>
  `;
};
