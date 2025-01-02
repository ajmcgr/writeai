import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Lock, CreditCard, Trash2 } from "lucide-react";

const Settings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/signin");
        return;
      }

      // Fetch subscription status
      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_status")
        .eq("user_id", session.user.id)
        .single();

      setSubscriptionStatus(profile?.subscription_status || "free");
    };

    checkAuth();
  }, [navigate]);

  const handlePasswordChange = async () => {
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Delete user's content
      await supabase
        .from("content")
        .delete()
        .eq("user_id", session.user.id);

      // Delete user's profile
      await supabase
        .from("profiles")
        .delete()
        .eq("user_id", session.user.id);

      // Sign out and delete auth user
      await supabase.auth.signOut();

      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted",
      });
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive",
      });
    }
  };

  const handleUpgrade = () => {
    navigate("/pricing");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow container max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-12">Account Settings</h1>

        <div className="space-y-12">
          {/* Password Change Section */}
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="h-5 w-5 text-gray-500" />
              <h2 className="text-xl font-semibold">Change Password</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button 
                onClick={handlePasswordChange} 
                disabled={isLoading || !password || !confirmPassword}
              >
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </div>

          {/* Subscription Section */}
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="h-5 w-5 text-gray-500" />
              <h2 className="text-xl font-semibold">Subscription</h2>
            </div>
            <div className="space-y-6">
              <p className="text-gray-600">
                Current Plan: <span className="font-semibold capitalize">{subscriptionStatus}</span>
              </p>
              {subscriptionStatus === "free" && (
                <Button onClick={handleUpgrade}>
                  Upgrade to Pro
                </Button>
              )}
            </div>
          </div>

          {/* Delete Account Section */}
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3 mb-6">
              <Trash2 className="h-5 w-5 text-red-500" />
              <h2 className="text-xl font-semibold text-red-500">Delete Account</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteAccount}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;