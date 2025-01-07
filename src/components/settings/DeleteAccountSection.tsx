import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash2 } from "lucide-react";
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

export function DeleteAccountSection() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDeleteAccount = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error("No active session found");
        toast({
          title: "Error",
          description: "You must be logged in to delete your account",
          variant: "destructive",
        });
        navigate("/signin");
        return;
      }

      console.log("Starting account deletion process for user:", session.user.id);

      // Delete user content first
      const { error: contentError } = await supabase
        .from("content")
        .delete()
        .eq("user_id", session.user.id);

      if (contentError) {
        console.error("Error deleting user content:", contentError);
        throw new Error("Failed to delete user content");
      }

      console.log("Successfully deleted user content");

      // Delete user profile
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("user_id", session.user.id);

      if (profileError) {
        console.error("Error deleting user profile:", profileError);
        throw new Error("Failed to delete user profile");
      }

      console.log("Successfully deleted user profile");

      // Delete the auth user
      const { error: deleteError } = await supabase.auth.admin.deleteUser(
        session.user.id,
        true // The second parameter (true) means to also delete user data
      );

      if (deleteError) {
        console.error("Error deleting auth user:", deleteError);
        throw new Error("Failed to delete user account");
      }

      console.log("Successfully deleted auth user");

      // Sign out the user last
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) {
        console.error("Error signing out:", signOutError);
        throw new Error("Failed to sign out");
      }

      console.log("Successfully signed out user");

      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Error in account deletion process:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete account",
        variant: "destructive",
      });
    }
  };

  return (
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
  );
}