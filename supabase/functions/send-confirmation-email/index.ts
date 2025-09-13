
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email: string;
  confirmationUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request to send-confirmation-email");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const emailRequest: EmailRequest = await req.json();
    console.log("Processing confirmation email request:", emailRequest);

    // Validate required environment variables
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set");
    }

    console.log("Sending email via Resend API");
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Write AI <notifications@pressgenie.com>",
        to: [emailRequest.email],
        subject: "Welcome to Write AI",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Welcome to Write AI!</h1>
            <p>Please confirm your email address by clicking the link below:</p>
            <p>
              <a href="${emailRequest.confirmationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #848ac8; color: white; text-decoration: none; border-radius: 4px;">
                Confirm Email
              </a>
            </p>
            <p>If you didn't create an account with Write AI, you can safely ignore this email.</p>
            <p>Best regards,<br>The Write AI Team</p>
          </div>
        `,
      }),
    });

    const responseText = await res.text();
    console.log("Resend API response status:", res.status);
    console.log("Resend API response:", responseText);

    if (res.ok) {
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.log("Could not parse response as JSON:", e);
        data = { raw: responseText };
      }
      
      console.log("Confirmation email sent successfully:", data);
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      console.error("Error from Resend API:", responseText);
      return new Response(JSON.stringify({ error: responseText }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error: any) {
    console.error("Error in send-confirmation-email function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);
