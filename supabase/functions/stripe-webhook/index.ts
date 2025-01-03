import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response('No signature', { status: 400 });
    }

    const body = await req.text();
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    if (!webhookSecret) {
      console.error('Webhook secret not configured');
      return new Response('Webhook secret not configured', { status: 500 });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 });
    }

    console.log('Processing event:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const customerEmail = session.customer_details.email;

      if (!customerEmail) {
        throw new Error('No customer email in session');
      }

      // Get user by email
      const { data: users, error: userError } = await supabaseClient
        .from('auth.users')
        .select('id')
        .eq('email', customerEmail)
        .single();

      if (userError || !users) {
        throw new Error('User not found');
      }

      // Update subscription status
      const { error: updateError } = await supabaseClient
        .from('profiles')
        .update({ subscription_status: 'pro' })
        .eq('user_id', users.id);

      if (updateError) {
        throw new Error(`Failed to update subscription status: ${updateError.message}`);
      }

      console.log('Successfully updated subscription status for user:', customerEmail);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});