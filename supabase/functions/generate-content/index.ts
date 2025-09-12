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
    console.log('Received request:', { type, content });

    const systemPrompt = type === "generate" 
      ? `You are an expert PR professional specializing in writing compelling press releases. You will be given keywords or a title, and you must generate a detailed press release about that topic. Follow these guidelines:

1. Structure:
- Create an attention-grabbing headline based on the provided keywords
- Include a dateline with current date and location
- Write a strong lead paragraph covering the 5 W's (who, what, when, where, why)
- Develop 2-3 detailed body paragraphs with specific features, specifications, and benefits
- Include 2-3 relevant quotes from company executives or stakeholders
- End with availability information, pricing (if applicable), and a clear call to action
- Add a boilerplate about the company

2. Style and Content:
- Use clear, professional language
- Write in active voice
- Keep paragraphs concise (2-3 sentences)
- Follow AP style guidelines
- Include specific technical details and specifications
- Highlight key features and innovations
- Mention target audience and market positioning
- Include pricing and availability details when relevant
- Reference industry trends or market context

3. Format and Flow:
- Use proper paragraph spacing (separate paragraphs with blank lines)
- Ensure smooth transitions between sections
- Structure content in a logical, news-style format

Generate a detailed, accurate press release that expands on the provided keywords while maintaining journalistic standards and PR best practices.`
      : `You are an expert PR professional. Rewrite the following press release to make it more impactful while maintaining its core message. Focus on:

1. Strengthening the headline
2. Making the lead paragraph more compelling
3. Improving quote authenticity
4. Enhancing clarity and conciseness
5. Strengthening the call to action

Keep the same basic structure but enhance the language and impact. Use proper paragraph spacing (separate paragraphs with blank lines).`;

    const userPrompt = type === "generate"
      ? `Generate a comprehensive press release based on these keywords: ${content}`
      : content;

    console.log('Generating content with prompt:', userPrompt);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY')!,
        'content-type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Claude API error:', error);
      throw new Error(`Claude API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Claude response:', data);

    if (!data.content?.[0]?.text) {
      throw new Error('Invalid response from Claude');
    }

    const generatedText = data.content[0].text;
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