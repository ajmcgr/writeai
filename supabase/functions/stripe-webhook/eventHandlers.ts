import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { handleSubscriptionChange } from './subscriptionHandler.ts';

export const handleCheckoutSession = async (
  event: Stripe.Event,
  stripe: Stripe,
  supabaseAdmin: ReturnType<typeof createClient>
) => {
  const session = event.data.object as Stripe.Checkout.Session;
  console.log('💳 Processing completed checkout session:', session.id);
  
  let customerEmail;
  const customerId = session.customer as string;
  
  try {
    const customer = await stripe.customers.retrieve(customerId);
    if ('deleted' in customer) {
      throw new Error('Customer was deleted');
    }
    customerEmail = customer.email;
  } catch (error) {
    console.log('⚠️ Could not retrieve customer from ID, falling back to session email');
    customerEmail = session.customer_email;
    if (!customerEmail) {
      throw new Error('No customer email found in session or customer object');
    }
  }

  await handleSubscriptionChange(
    supabaseAdmin,
    customerEmail,
    'pro',
    customerId,
    session.subscription as string
  );
};

export const handleSubscriptionEvent = async (
  event: Stripe.Event,
  stripe: Stripe,
  supabaseAdmin: ReturnType<typeof createClient>
) => {
  const subscription = event.data.object as Stripe.Subscription;
  console.log(`📝 Processing subscription ${event.type}:`, subscription.id);
  
  try {
    const customer = await stripe.customers.retrieve(subscription.customer as string);
    if ('deleted' in customer) {
      throw new Error('Customer was deleted');
    }
    const customerEmail = customer.email;
    if (!customerEmail) {
      throw new Error('No customer email found');
    }

    await handleSubscriptionChange(
      supabaseAdmin,
      customerEmail,
      'pro',
      subscription.customer as string,
      subscription.id
    );
  } catch (error) {
    console.error('❌ Error processing subscription event:', error);
    throw error;
  }
};

export const handleSubscriptionDeletion = async (
  event: Stripe.Event,
  stripe: Stripe,
  supabaseAdmin: ReturnType<typeof createClient>
) => {
  const subscription = event.data.object as Stripe.Subscription;
  console.log('🗑️ Processing subscription deletion:', subscription.id);
  
  try {
    const customer = await stripe.customers.retrieve(subscription.customer as string);
    if ('deleted' in customer) {
      throw new Error('Customer was deleted');
    }
    const customerEmail = customer.email;
    if (!customerEmail) {
      throw new Error('No customer email found');
    }

    await handleSubscriptionChange(
      supabaseAdmin,
      customerEmail,
      'free',
      subscription.customer as string,
      null
    );
  } catch (error) {
    console.error('❌ Error processing subscription deletion:', error);
    throw error;
  }
};