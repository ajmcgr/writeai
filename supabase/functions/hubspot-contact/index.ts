import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const HUBSPOT_ACCESS_TOKEN = Deno.env.get('HUBSPOT_ACCESS_TOKEN');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactRequest {
  email: string;
  name?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request to hubspot-contact function");

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const contactRequest: ContactRequest = await req.json();
    console.log("Processing contact request:", contactRequest);

    // Create contact in HubSpot
    const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        properties: {
          email: contactRequest.email,
          firstname: contactRequest.name?.split(' ')[0] || '',
          lastname: contactRequest.name?.split(' ').slice(1).join(' ') || '',
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Error from HubSpot API:", error);
      throw new Error(`HubSpot API error: ${error}`);
    }

    const data = await response.json();
    console.log("Contact created successfully in HubSpot:", data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in hubspot-contact function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
};

serve(handler);