import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

serve(async (req) => {
  console.log('Received webhook request');

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('stripe-signature');
    
    if (!signature) {
      console.error('No stripe signature found');
      return new Response(
        JSON.stringify({ error: 'No signature provided' }), 
        { status: 400, headers: corsHeaders }
      );
    }

    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      console.error('Webhook secret not configured');
      return new Response(
        JSON.stringify({ error: 'Webhook secret not configured' }), 
        { status: 500, headers: corsHeaders }
      );
    }

    const body = await req.text();
    console.log('Webhook body:', body);

    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        webhookSecret
      );
      console.log('Event constructed successfully:', event.type);
    } catch (err) {
      console.error(`Webhook signature verification failed:`, err);
      return new Response(
        JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }), 
        { status: 400, headers: corsHeaders }
      );
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('Processing checkout session:', session);

      const customerEmail = session.customer_details?.email;
      if (!customerEmail) {
        throw new Error('No customer email in session');
      }

      console.log('Looking up user with email:', customerEmail);
      const { data: users, error: userError } = await supabaseAdmin
        .from('auth.users')
        .select('id')
        .eq('email', customerEmail)
        .single();

      if (userError || !users) {
        console.error('User lookup error:', userError);
        throw new Error('User not found');
      }

      console.log('Updating subscription status for user:', users.id);
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ subscription_status: 'pro' })
        .eq('user_id', users.id);

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw new Error(`Failed to update subscription status: ${updateError.message}`);
      }

      console.log('Successfully updated subscription status');
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: corsHeaders,
      status: 200,
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { headers: corsHeaders, status: 400 }
    );
  }
});