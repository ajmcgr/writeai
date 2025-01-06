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

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Press Genie <notifications@pressgenie.com>",
        to: [emailRequest.email],
        subject: "Confirm your Press Genie account",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Welcome to Press Genie!</h1>
            <p>Please confirm your email address by clicking the link below:</p>
            <p>
              <a href="${emailRequest.confirmationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #848ac8; color: white; text-decoration: none; border-radius: 4px;">
                Confirm Email
              </a>
            </p>
            <p>If you didn't create an account with Press Genie, you can safely ignore this email.</p>
            <p>Best regards,<br>The Press Genie Team</p>
          </div>
        `,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("Confirmation email sent successfully:", data);
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      const error = await res.text();
      console.error("Error from Resend API:", error);
      return new Response(JSON.stringify({ error }), {
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