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
    const { content } = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert PR professional and editor. Analyze the press release and suggest specific improvements for each section. 
            Your suggestions should enhance clarity, impact, and professionalism while maintaining the core message.
            
            Guidelines for improvements:
            - Make headlines more compelling and attention-grabbing
            - Enhance quotes to be more impactful and memorable
            - Strengthen the opening paragraph to better hook readers
            - Improve clarity and conciseness throughout
            - Add more specific details and metrics where appropriate
            - Enhance the boilerplate to be more compelling
            
            Format each suggestion as "Section Title: Improved Text"
            Only provide suggestions where you can make meaningful improvements.
            If a section is already well-written, do not include it in the suggestions.
            Each suggestion must be on a new line.`
          },
          {
            role: 'user',
            content
          }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ analysis }),
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