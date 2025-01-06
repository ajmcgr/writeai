import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

const handleSubscriptionChange = async (supabaseAdmin: any, customerEmail: string, status: 'pro' | 'free', customerId: string, subscriptionId: string | null = null) => {
  console.log(`🔄 Updating subscription for ${customerEmail} to ${status}`);
  
  // Get user from auth.users using the database function
  const { data: users, error: userError } = await supabaseAdmin.rpc('get_user_by_email', {
    p_email: customerEmail
  });

  if (userError) {
    console.error('❌ User lookup error:', userError);
    throw new Error('User lookup failed');
  }

  if (!users || users.length === 0) {
    console.error('❌ No user found with email:', customerEmail);
    throw new Error('User not found');
  }

  const userId = users[0].id;
  console.log(`✅ Found user: ${userId}`);

  const updateData = {
    subscription_status: status,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    updated_at: new Date().toISOString()
  };

  const { error: updateError } = await supabaseAdmin
    .from('profiles')
    .update(updateData)
    .eq('user_id', userId);

  if (updateError) {
    console.error('❌ Profile update error:', updateError);
    throw new Error(`Failed to update subscription status: ${updateError.message}`);
  }

  console.log(`✅ Successfully updated profile for ${customerEmail} to ${status}`);
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
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('💳 Processing completed checkout session:', session.id);
        
        const customer = await stripe.customers.retrieve(session.customer as string);
        if (!customer || customer.deleted) {
          throw new Error('Customer not found or deleted');
        }

        const customerEmail = typeof customer === 'object' ? customer.email : null;
        if (!customerEmail) {
          throw new Error('Customer email not found');
        }

        await handleSubscriptionChange(
          supabaseAdmin,
          customerEmail,
          'pro',
          session.customer as string,
          session.subscription as string
        );
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.created': {
        const subscription = event.data.object;
        console.log(`📝 Processing subscription ${event.type}:`, subscription.id);
        
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        if (!customer || customer.deleted) {
          throw new Error('Customer not found or deleted');
        }

        const customerEmail = typeof customer === 'object' ? customer.email : null;
        if (!customerEmail) {
          throw new Error('Customer email not found');
        }

        await handleSubscriptionChange(
          supabaseAdmin,
          customerEmail,
          'pro',
          subscription.customer as string,
          subscription.id
        );
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        console.log('🗑️ Processing subscription deletion:', subscription.id);
        
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        if (!customer || customer.deleted) {
          throw new Error('Customer not found or deleted');
        }

        const customerEmail = typeof customer === 'object' ? customer.email : null;
        if (!customerEmail) {
          throw new Error('Customer email not found');
        }

        await handleSubscriptionChange(
          supabaseAdmin,
          customerEmail,
          'free',
          subscription.customer as string,
          null
        );
        break;
      }
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