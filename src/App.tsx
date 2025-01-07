import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Index from "./pages/Index";
import Write from "./pages/Write";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Pricing from "./pages/Pricing";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Help from "./pages/Help";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Boilerplate from "./pages/tools/Boilerplate";
import Headline from "./pages/tools/Headline";
import Quote from "./pages/tools/Quote";
import CTA from "./pages/tools/CTA";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState } from "@/components/ui/loading-state";
import { useToast } from "@/hooks/use-toast";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          if (error.message.includes("refresh_token_not_found")) {
            console.log("Invalid refresh token, clearing session");
            await supabase.auth.signOut({ scope: 'local' });
            toast({
              title: "Session expired",
              description: "Please sign in again",
              variant: "destructive",
            });
          }
          setIsAuthenticated(false);
          return;
        }

        console.log("App auth check:", session ? "Authenticated" : "Not authenticated");
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("App auth state changed:", event, session?.user?.email);
      
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, clearing local state');
        setIsAuthenticated(false);
      }
      
      setIsAuthenticated(!!session);
    });

    return () => {
      console.log("Cleaning up App auth subscription");
      subscription.unsubscribe();
    };
  }, [toast]);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route 
          path="/write" 
          element={
            isLoading ? (
              <LoadingState />
            ) : isAuthenticated ? (
              <Write />
            ) : (
              <Navigate to="/signup" replace state={{ redirectTo: "/write" }} />
            )
          } 
        />
        <Route path="/write/:id" element={<Write />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/tools/boilerplate" element={<Boilerplate />} />
        <Route path="/tools/headline" element={<Headline />} />
        <Route path="/tools/quote" element={<Quote />} />
        <Route path="/tools/cta" element={<CTA />} />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;