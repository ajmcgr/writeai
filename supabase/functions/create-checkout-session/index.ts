import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('🚀 Create checkout session function started');
  
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('❌ No authorization header found');
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('🔑 Token received, verifying with Supabase...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase configuration');
      throw new Error('Missing Supabase configuration');
    }

    const verifyResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: supabaseKey,
      },
    });

    if (!verifyResponse.ok) {
      console.error('❌ Invalid authentication token');
      throw new Error('Invalid authentication token');
    }

    const user = await verifyResponse.json();
    console.log('✅ Authenticated user:', user.email);

    const { period } = await req.json();
    console.log('📅 Creating checkout session for period:', period);

    if (!period) {
      console.error('❌ Missing period parameter');
      throw new Error('Missing period parameter');
    }

    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      console.error('❌ Missing Stripe secret key');
      throw new Error('Stripe secret key not configured');
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    const monthlyPriceId = Deno.env.get('STRIPE_MONTHLY_PRICE_ID');
    const annualPriceId = Deno.env.get('STRIPE_ANNUAL_PRICE_ID');
    
    if (!monthlyPriceId || !annualPriceId) {
      console.error('❌ Missing Stripe price IDs');
      throw new Error('Stripe price IDs not configured');
    }

    console.log('💰 Available price IDs - Monthly:', monthlyPriceId, 'Annual:', annualPriceId);

    const priceId = period === 'monthly' ? monthlyPriceId : annualPriceId;
    console.log('💳 Selected price ID:', priceId);

    console.log('🔍 Looking up customer by email:', user.email);
    const customers = await stripe.customers.list({ email: user.email });
    let customer;

    if (customers.data.length > 0) {
      customer = customers.data[0];
      console.log('✅ Found existing customer:', customer.id);
    } else {
      customer = await stripe.customers.create({ email: user.email });
      console.log('✅ Created new customer:', customer.id);
    }

    console.log('🛍️ Creating Stripe checkout session...');
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
      allow_promotion_codes: true, // Enable promotion codes in checkout
      subscription_data: {
        metadata: {
          userId: user.id,
        },
      },
    });

    console.log('✅ Checkout session created successfully:', session.id);

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});