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
        <div className="mt-8 w-full max-w-5xl">
          <div className="rounded-lg overflow-hidden shadow-2xl">
            {/* Browser Window Header */}
            <div className="bg-gray-100 px-4 py-3 flex items-center border-b">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            {/* Browser Window Content */}
            <div className="bg-white">
              <img
                src="/lovable-uploads/c5e37cd7-f33b-4c16-ac10-2a25dfa2deab.png"
                alt="Write AI Interface Screenshot"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}