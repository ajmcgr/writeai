import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting content analysis...');
    const { content } = await req.json();
    console.log('Content received:', content.substring(0, 100) + '...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: `You are an expert PR professional and editor. Analyze the press release and provide specific, actionable improvements.
            Focus on enhancing:
            1. Headlines - Make them more compelling and newsworthy
            2. Lead paragraph - Strengthen the hook and key message
            3. Quotes - Make them more impactful and authentic
            4. Body content - Improve clarity, conciseness, and storytelling
            5. Call to action - Make it more compelling
            6. Boilerplate - Enhance company description
            
            For each suggestion:
            1. First identify the exact text to be replaced by quoting it
            2. Then provide the improved version
            3. Each suggestion must be clearly separated
            
            Format each suggestion exactly like this:
            Original: "exact text to replace"
            Improved: "improved version"
            
            Do not include any other text or formatting.
            Each suggestion must be separated by two newlines.
            Only provide suggestions where you can make meaningful improvements.`
          },
          {
            role: 'user',
            content
          }
        ],
        temperature: 0.7,
      }),
    });

    console.log('OpenAI API response received');
    const data = await response.json();
    console.log('Analysis generated:', data.choices[0].message.content);

    return new Response(
      JSON.stringify({ analysis: data.choices[0].message.content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-content function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});