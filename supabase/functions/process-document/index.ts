import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { mammoth } from 'https://deno.land/x/mammoth@1.6.0/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file) {
      throw new Error('No file uploaded')
    }

    let text = ''
    const fileType = file.name.split('.').pop()?.toLowerCase()
    const arrayBuffer = await file.arrayBuffer()

    console.log('Processing file:', file.name, 'of type:', fileType)

    switch (fileType) {
      case 'txt':
        text = await file.text()
        break
      case 'doc':
      case 'docx':
        const result = await mammoth.extractRawText({ arrayBuffer })
        text = result.value
        break
      case 'odt':
        // For ODT files, we'll use a simple text extraction for now
        // In a production environment, you might want to use a more robust ODT parser
        const decoder = new TextDecoder('utf-8')
        text = decoder.decode(arrayBuffer)
        break
      default:
        throw new Error('Unsupported file type')
    }

    console.log('Successfully extracted text from file')

    return new Response(
      JSON.stringify({ text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing document:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})