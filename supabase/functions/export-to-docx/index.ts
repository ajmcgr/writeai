import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Document, Packer, Paragraph, TextRun } from "https://esm.sh/docx@8.5.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { content } = await req.json()

    // Create document
    const doc = new Document({
      sections: [{
        properties: {},
        children: content.split('\n').map((line: string) => {
          return new Paragraph({
            children: [
              new TextRun({
                text: line,
              }),
            ],
          })
        }),
      }],
    })

    // Generate and convert to base64
    const buffer = await Packer.toBuffer(doc)
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)))

    return new Response(
      JSON.stringify({ file: base64 }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})