import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('🔄 Cancel subscription function started');
  
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

    // Verify the user's token
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

    // Get user's Stripe subscription ID
    const { data: profile, error: profileError } = await fetch(
      `${supabaseUrl}/rest/v1/profiles?user_id=eq.${user.id}&select=stripe_subscription_id,stripe_customer_id`,
      {
        headers: {
          Authorization: `Bearer ${supabaseKey}`,
          apikey: supabaseKey,
        },
      }
    ).then(res => res.json());

    if (profileError || !profile || profile.length === 0) {
      console.error('❌ Error fetching profile:', profileError);
      throw new Error('Could not find user profile');
    }

    const subscriptionId = profile[0].stripe_subscription_id;
    if (!subscriptionId) {
      console.error('❌ No active subscription found');
      throw new Error('No active subscription found');
    }

    console.log('📝 Found subscription ID:', subscriptionId);

    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      console.error('❌ Missing Stripe secret key');
      throw new Error('Stripe secret key not configured');
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    // Cancel the subscription at period end
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    console.log('✅ Subscription cancelled successfully:', subscription.id);

    // Update the profile status
    const updateResponse = await fetch(
      `${supabaseUrl}/rest/v1/profiles?user_id=eq.${user.id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${supabaseKey}`,
          apikey: supabaseKey,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          subscription_status: 'free',
          updated_at: new Date().toISOString(),
        }),
      }
    );

    if (!updateResponse.ok) {
      console.error('❌ Failed to update profile status');
      throw new Error('Failed to update profile status');
    }

    return new Response(
      JSON.stringify({ 
        message: 'Subscription cancelled successfully',
        subscription: subscription 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('❌ Error cancelling subscription:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});