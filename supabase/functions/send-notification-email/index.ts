import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: "welcome" | "upgrade";
  email: string;
  name?: string;
}

const getEmailContent = (type: "welcome" | "upgrade", name?: string) => {
  switch (type) {
    case "welcome":
      return {
        subject: "Welcome to Press Genie! 🎉",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Welcome to Press Genie${name ? `, ${name}` : ''}!</h1>
            <p>Thank you for joining Press Genie - your AI-powered assistant for creating professional press releases and blog posts.</p>
            <p>You can now:</p>
            <ul>
              <li>Generate professional press releases</li>
              <li>Create engaging blog posts</li>
              <li>Access our specialized content tools</li>
            </ul>
            <p>Get started by logging into your account and trying out our content generation tools.</p>
            <p>Best regards,<br>The Press Genie Team</p>
          </div>
        `,
      };
    case "upgrade":
      return {
        subject: "Welcome to Press Genie Pro! 🌟",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Thank You for Upgrading${name ? `, ${name}` : ''}!</h1>
            <p>Welcome to Press Genie Pro! You now have unlimited access to all our features:</p>
            <ul>
              <li>Unlimited content generation</li>
              <li>Priority support</li>
              <li>Advanced customization options</li>
            </ul>
            <p>Start exploring all the pro features now!</p>
            <p>Best regards,<br>The Press Genie Team</p>
          </div>
        `,
      };
  }
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request to send-notification-email");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const emailRequest: EmailRequest = await req.json();
    console.log("Processing email request:", emailRequest);

    const emailContent = getEmailContent(emailRequest.type, emailRequest.name);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Press Genie <notifications@pressgenie.com>",
        to: [emailRequest.email],
        subject: emailContent.subject,
        html: emailContent.html,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("Email sent successfully:", data);
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
    console.error("Error in send-notification-email function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);