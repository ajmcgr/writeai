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
    const { type, content } = await req.json();

    const systemPrompt = type === "generate" 
      ? "You are an expert PR professional who writes engaging press releases. Create a professional press release that is clear, concise, and engaging. Format the output with proper spacing between paragraphs using double line breaks. Include a headline, dateline, introduction, body paragraphs, quotes if relevant, and a boilerplate. Each section should be properly spaced."
      : "You are an expert PR professional. Rewrite the following content to make it more engaging and professional while maintaining its core message. Format the output with proper spacing between paragraphs using double line breaks:";

    const userPrompt = type === "generate"
      ? content
      : content;

    console.log('Generating content with prompt:', userPrompt);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    // Clean up any HTML tags that might be in the response
    const generatedText = data.choices[0].message.content.replace(/<[^>]*>/g, '');

    console.log('Generated text:', generatedText);

    return new Response(JSON.stringify({ generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-content function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});