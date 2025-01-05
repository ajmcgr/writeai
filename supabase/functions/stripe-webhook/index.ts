import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

console.log('🚀 Initializing Stripe webhook function');

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

serve(async (req) => {
  const timestamp = new Date().toISOString();
  console.log(`\n🔔 [${timestamp}] Webhook received`);
  console.log('📝 Request method:', req.method);
  console.log('🔑 Request headers:', Object.fromEntries(req.headers.entries()));

  if (req.method === 'OPTIONS') {
    console.log('✨ Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('stripe-signature');
    console.log('🔐 Stripe signature present:', !!signature);
    
    if (!signature) {
      console.error('❌ No stripe signature found in request headers');
      return new Response(
        JSON.stringify({ error: 'No signature provided' }), 
        { status: 400, headers: corsHeaders }
      );
    }

    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      console.error('❌ Webhook secret not configured in environment variables');
      return new Response(
        JSON.stringify({ error: 'Webhook secret not configured' }), 
        { status: 500, headers: corsHeaders }
      );
    }

    const body = await req.text();
    console.log('📦 Webhook raw body:', body);

    let event;
    try {
      console.log('🔍 Constructing Stripe event from webhook payload');
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
      console.log('✅ Event constructed successfully:', event.type);
      console.log('📊 Event details:', {
        id: event.id,
        type: event.type,
        created: new Date(event.created * 1000).toISOString(),
        data: event.data.object
      });
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err);
      console.error('🔍 Error details:', {
        message: err.message,
        stack: err.stack
      });
      return new Response(
        JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }), 
        { status: 400, headers: corsHeaders }
      );
    }

    // Handle subscription lifecycle events
    if (event.type === 'customer.subscription.created' || 
        event.type === 'customer.subscription.updated' ||
        event.type === 'checkout.session.completed') {
      console.log(`🔄 Processing subscription event: ${event.type}`);
      const session = event.data.object;

      let customerEmail;
      let customerId;
      let subscriptionId;

      if (event.type === 'checkout.session.completed') {
        console.log('💳 Processing completed checkout session');
        customerEmail = session.customer_details?.email;
        customerId = session.customer;
        subscriptionId = session.subscription;
        console.log('📋 Checkout session details:', {
          customerEmail,
          customerId,
          subscriptionId,
          amount_total: session.amount_total,
          payment_status: session.payment_status
        });
      } else {
        console.log('📝 Processing subscription update');
        const subscription = event.data.object;
        customerId = subscription.customer;
        subscriptionId = subscription.id;
        
        console.log('🔍 Retrieving customer details from Stripe');
        const customer = await stripe.customers.retrieve(customerId);
        console.log('👤 Customer retrieved:', customer);
        customerEmail = typeof customer === 'object' ? customer.email : null;
      }

      if (!customerEmail) {
        console.error('❌ No customer email found in event data');
        throw new Error('No customer email found in event');
      }

      console.log('🔍 Looking up user in Supabase:', customerEmail);
      const { data: users, error: userError } = await supabaseAdmin
        .from('auth.users')
        .select('id')
        .eq('email', customerEmail)
        .single();

      if (userError || !users) {
        console.error('❌ User lookup error:', userError);
        console.error('👥 Users data:', users);
        throw new Error('User not found');
      }

      console.log('✅ User found:', users.id);
      console.log('📝 Updating subscription status in profiles table');
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ 
          subscription_status: 'pro',
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
        })
        .eq('user_id', users.id);

      if (updateError) {
        console.error('❌ Profile update error:', updateError);
        throw new Error(`Failed to update subscription status: ${updateError.message}`);
      }

      console.log('✅ Successfully updated subscription status to pro');
    }

    // Handle subscription cancellation/deletion
    if (event.type === 'customer.subscription.deleted') {
      console.log('🔄 Processing subscription deletion event');
      const subscription = event.data.object;
      const customerId = subscription.customer;

      console.log('🔍 Retrieving customer details for cancelled subscription');
      const customer = await stripe.customers.retrieve(customerId);
      const customerEmail = typeof customer === 'object' ? customer.email : null;

      if (!customerEmail) {
        console.error('❌ No customer email found for cancelled subscription');
        throw new Error('No customer email found in event');
      }

      console.log('🔍 Looking up user for subscription cancellation:', customerEmail);
      const { data: users, error: userError } = await supabaseAdmin
        .from('auth.users')
        .select('id')
        .eq('email', customerEmail)
        .single();

      if (userError || !users) {
        console.error('❌ User lookup error for cancellation:', userError);
        throw new Error('User not found');
      }

      console.log('📝 Updating subscription status to free for user:', users.id);
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ 
          subscription_status: 'free',
          stripe_subscription_id: null,
        })
        .eq('user_id', users.id);

      if (updateError) {
        console.error('❌ Profile update error during cancellation:', updateError);
        throw new Error(`Failed to update subscription status: ${updateError.message}`);
      }

      console.log('✅ Successfully updated subscription status to free');
    }

    console.log('✅ Webhook processing completed successfully');
    return new Response(JSON.stringify({ received: true }), {
      headers: corsHeaders,
      status: 200,
    });
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    console.error('🔍 Error details:', {
      message: error.message,
      stack: error.stack
    });
    return new Response(
      JSON.stringify({ error: error.message }), 
      { headers: corsHeaders, status: 400 }
    );
  }
});