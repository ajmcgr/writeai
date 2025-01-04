import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno";

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Get JWT token from Authorization header
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the JWT token with Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const verifyResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: supabaseKey,
      },
    });

    if (!verifyResponse.ok) {
      throw new Error('Invalid authentication token');
    }

    const user = await verifyResponse.json();
    console.log('Authenticated user:', user.email);

    const { period } = await req.json();
    console.log('Creating checkout session for period:', period);

    if (!period) {
      throw new Error('Missing period parameter');
    }

    // Get the appropriate price ID based on the period
    let priceId;
    if (period === 'monthly') {
      priceId = Deno.env.get('STRIPE_MONTHLY_PRICE_ID');
    } else if (period === 'annual') {
      priceId = Deno.env.get('STRIPE_ANNUAL_PRICE_ID');
    }

    if (!priceId) {
      throw new Error(`Missing price ID for ${period} period`);
    }

    // Create or retrieve customer
    const customers = await stripe.customers.list({ email: user.email });
    let customer;

    if (customers.data.length > 0) {
      customer = customers.data[0];
      console.log('Found existing customer:', customer.id);
    } else {
      customer = await stripe.customers.create({ email: user.email });
      console.log('Created new customer:', customer.id);
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/write?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/pricing`,
      client_reference_id: user.id,
      subscription_data: {
        metadata: {
          userId: user.id,
        },
      },
    });

    console.log('Checkout session created:', session.id);

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});