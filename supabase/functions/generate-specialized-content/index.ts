
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PROMPTS = {
  boilerplate: "You are an expert PR professional. Create a professional company boilerplate that is clear, concise, and engaging. Use the following context:",
  headline: "You are an expert PR professional. Create an attention-grabbing headline that is clear, concise, and compelling. Use the following context:",
  quote: "You are an expert PR professional. Create an impactful quote that adds credibility and human interest to the story. Use the following context:",
  cta: "You are an expert PR professional. Create a compelling call-to-action that drives engagement and action. Use the following context:"
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, context } = await req.json();
    console.log(`Generating ${type} content with context: ${context.substring(0, 100)}...`);

    if (!type || !context) {
      throw new Error('Missing required parameters: type and context');
    }

    if (!PROMPTS[type]) {
      throw new Error(`Invalid content type: ${type}`);
    }

    const systemPrompt = PROMPTS[type];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicApiKey!,
        'content-type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        system: systemPrompt,
        messages: [
          { role: 'user', content: context }
        ],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Claude API Error:', errorData);
      throw new Error(`Claude API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const generatedText = data.content[0].text;
    console.log(`Successfully generated ${type} content`);

    return new Response(JSON.stringify({ generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
