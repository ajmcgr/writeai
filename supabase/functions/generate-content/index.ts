import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const formatToHtml = (text: string) => {
  return text
    .split('\n\n')
    .map(paragraph => `<p>${paragraph.trim()}</p>`)
    .join('');
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, content } = await req.json();
    console.log('Received request:', { type, content });

    const systemPrompt = type === "generate" 
      ? `You are an expert PR professional specializing in writing compelling press releases. Follow these guidelines:

1. Structure:
- Start with a clear, attention-grabbing headline
- Include a dateline
- Write a strong lead paragraph that covers the 5 W's (who, what, when, where, why)
- Develop the story with 2-3 body paragraphs
- Include at least one relevant quote from a key stakeholder
- End with a clear call to action and boilerplate

2. Style:
- Use clear, concise language
- Write in an active voice
- Keep paragraphs short (2-3 sentences)
- Use industry-standard AP style
- Maintain a professional, objective tone
- Focus on newsworthy angles
- Include specific details and data points

3. Format:
- Use proper spacing between paragraphs
- Structure content in a logical flow
- Ensure each section transitions smoothly

Generate a press release that follows these guidelines exactly.`
      : `You are an expert PR professional. Rewrite the following press release to make it more impactful while maintaining its core message. Focus on:

1. Strengthening the headline
2. Making the lead paragraph more compelling
3. Improving quote authenticity
4. Enhancing clarity and conciseness
5. Strengthening the call to action
6. Maintaining proper press release format and AP style

Keep the same basic structure but enhance the language and impact. Format with proper spacing between paragraphs.`;

    const userPrompt = type === "generate"
      ? "Generate a press release"
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
        temperature: 0.5, // Reduced for more focused outputs
        max_tokens: 1500, // Increased for longer, more detailed content
        presence_penalty: 0.1, // Slight penalty to prevent repetition
        frequency_penalty: 0.1, // Slight penalty to encourage diverse language
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    const cleanText = data.choices[0].message.content.replace(/<[^>]*>/g, '');
    const generatedText = formatToHtml(cleanText);

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