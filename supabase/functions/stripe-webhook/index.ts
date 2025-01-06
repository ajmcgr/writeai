import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.0.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function handleSubscriptionChange(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  console.log('Processing subscription:', subscription.id);
  
  try {
    // Get customer email from Stripe
    const customer = await stripe.customers.retrieve(subscription.customer as string);
    console.log('Retrieved customer:', customer.email);

    if (!customer.email) {
      throw new Error('Customer email not found');
    }

    // Use the database function to get user ID
    const { data: userData, error: userError } = await supabase.rpc(
      'get_user_by_email',
      { p_email: customer.email }
    );

    if (userError) {
      console.error('User lookup error:', userError);
      throw new Error(`User lookup failed: ${userError.message}`);
    }

    if (!userData || userData.length === 0) {
      console.error('No user found for email:', customer.email);
      throw new Error('User not found');
    }

    const userId = userData[0].id;
    console.log('Found user ID:', userId);

    // Determine subscription status
    const subscriptionStatus = subscription.status === 'active' ? 'pro' : 'free';
    console.log('Setting subscription status to:', subscriptionStatus);

    // Update profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        subscription_status: subscriptionStatus,
        stripe_customer_id: subscription.customer as string,
        stripe_subscription_id: subscription.id,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Profile update error:', updateError);
      throw new Error(`Failed to update profile: ${updateError.message}`);
    }

    console.log('Successfully updated profile for user:', userId);
  } catch (error) {
    console.error('Error processing webhook:', error);
    throw error;
  }
}

serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response('No signature found', { status: 400 });
    }

    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      return new Response('Webhook secret not configured', { status: 500 });
    }

    const body = await req.text();
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    console.log('Processing event type:', event.type);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionChange(event);
        break;
      default:
        console.log('Unhandled event type:', event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});