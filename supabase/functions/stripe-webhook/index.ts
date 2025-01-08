import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import {
  handleCheckoutSession,
  handleSubscriptionEvent,
  handleSubscriptionDeletion
} from './eventHandlers.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req) => {
  const timestamp = new Date().toISOString();
  console.log(`\n🔔 [${timestamp}] Webhook received`);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      throw new Error('No signature provided');
    }

    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new Error('Webhook secret not configured');
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const body = await req.text();
    console.log('📦 Webhook payload received');

    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret
    );

    console.log(`✨ Event type: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSession(event, stripe, supabaseAdmin);
        break;

      case 'customer.subscription.updated':
      case 'customer.subscription.created':
        await handleSubscriptionEvent(event, stripe, supabaseAdmin);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeletion(event, stripe, supabaseAdmin);
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: corsHeaders,
      status: 200,
    });
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { headers: corsHeaders, status: 400 }
    );
  }
});