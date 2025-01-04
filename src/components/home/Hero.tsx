import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function Hero() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Hero auth check:", session ? "Authenticated" : "Not authenticated");
      setIsAuthenticated(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Hero auth state changed:", event, session?.user?.email);
      setIsAuthenticated(!!session);
    });

    return () => {
      console.log("Cleaning up Hero auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="relative pt-40 pb-32 md:pt-64 md:pb-48 bg-[#848ac8]">
      <div className="container flex flex-col items-center text-center gap-8">
        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl text-white font-merriweather">
          Meet your AI press release<br />writing assistant
        </h1>
        <p className="text-xl text-white/80 max-w-2xl font-inter">
          Create high-quality and impactful press releases with Write AI.
        </p>
        <Link to={isAuthenticated ? "/write" : "/signup"}>
          <Button size="lg" className="text-lg bg-white text-[#848ac8] hover:bg-gray-100 font-inter">
            Start Writing
          </Button>
        </Link>
        <div className="mt-8 w-full max-w-5xl rounded-lg border bg-card p-4 shadow-lg">
          <img
            src="/placeholder.svg"
            alt="Write AI Screenshot"
            className="w-full rounded"
          />
        </div>
      </div>
    </div>
  );
}