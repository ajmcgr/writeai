import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import Stripe from 'https://esm.sh/stripe@14.21.0';

export const handleSubscriptionChange = async (
  supabaseAdmin: ReturnType<typeof createClient>,
  customerEmail: string,
  status: 'pro' | 'free',
  customerId: string,
  subscriptionId: string | null = null
) => {
  console.log(`🔄 Updating subscription for ${customerEmail} to ${status}`);
  
  try {
    const { data: users, error: userError } = await supabaseAdmin
      .rpc('get_user_by_email', {
        p_email: customerEmail
      });

    console.log('User lookup response:', { users, userError });

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

    console.log('Updating profile with data:', updateData);

    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('user_id', userId);

    if (updateError) {
      console.error('❌ Profile update error:', updateError);
      throw new Error(`Failed to update subscription status: ${updateError.message}`);
    }

    console.log(`✅ Successfully updated profile for ${customerEmail} to ${status}`);
  } catch (error) {
    console.error('❌ Error in handleSubscriptionChange:', error);
    throw error;
  }
};