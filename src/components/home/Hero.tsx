
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";

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

    // Load Senja widget script
    const script = document.createElement('script');
    script.src = "https://widget.senja.io/widget/f10a97a0-8bad-4cf0-8ced-3790e0588932/platform.js";
    script.async = true;
    script.type = "text/javascript";
    document.body.appendChild(script);

    // Add custom styles for Senja widget text
    const style = document.createElement('style');
    style.textContent = `
      .senja-embed .senja-text {
        color: white !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      console.log("Cleaning up Hero auth subscription");
      subscription.unsubscribe();
      // Clean up script and styles if component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div className="relative pt-20 pb-32 md:pt-36 md:pb-48 bg-[#848ac8]">
      <div className="container flex flex-col items-center text-center gap-8">
        <p className="text-white text-xs md:text-sm">
          Made for PR & Social Media pro's, Agencies and Freelancers
        </p>
        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl text-white font-merriweather">
          Meet your AI press release<br />writing assistant
        </h1>
        <p className="text-xl text-white/80 max-w-2xl">
          Create high-quality and impactful press releases with Write AI.
        </p>
        
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col md:flex-row items-center justify-center gap-0 md:gap-0">
            <Link to={isAuthenticated ? "/write" : "/signup"} className="mb-4 md:mb-0">
              <Button size="lg" className="text-base bg-white text-black hover:bg-gray-100 font-inter px-6">
                {isAuthenticated ? "Start Writing" : "Start Free Trial"} <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            
            {/* Senja Widget */}
            <div className="w-full md:w-[300px]">
              <div className="senja-embed" 
                  data-id="f10a97a0-8bad-4cf0-8ced-3790e0588932" 
                  data-mode="shadow" 
                  data-lazyload="false" 
                  style={{display: 'block'}}
              />
            </div>
          </div>
          
          {/* Features text row */}
          <div className="w-full flex justify-center">
            <div className="flex flex-wrap justify-center gap-4 text-white/90 text-sm md:text-base">
              <span>✓ 7 days free trial</span>
              <span>✓ Secure payment</span>
              <span>✓ Cancel any-time</span>
            </div>
          </div>
        </div>

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
                src="/lovable-uploads/81ec2df4-13e8-4ad0-b31f-94e51cbe920a.png"
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
