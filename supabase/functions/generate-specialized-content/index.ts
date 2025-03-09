
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: context }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;
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
