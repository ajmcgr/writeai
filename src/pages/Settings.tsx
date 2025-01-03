import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { PasswordSection } from "@/components/settings/PasswordSection";
import { SubscriptionSection } from "@/components/settings/SubscriptionSection";
import { DeleteAccountSection } from "@/components/settings/DeleteAccountSection";

const Settings = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/signin");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_status")
        .eq("user_id", session.user.id)
        .single();

      setSubscriptionStatus(profile?.subscription_status || "free");
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow container max-w-4xl mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-12">Account Settings</h1>

        <div className="space-y-12">
          <SubscriptionSection subscriptionStatus={subscriptionStatus} />
          <PasswordSection />
          <DeleteAccountSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;