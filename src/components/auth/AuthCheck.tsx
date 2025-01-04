import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface AuthCheckProps {
  isAuthenticated: boolean;
}

export const AuthCheck = ({ isAuthenticated }: AuthCheckProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If coming from a payment (Stripe adds ?session_id to the URL)
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      console.log("Payment redirect detected, redirecting to signin with return URL");
      navigate("/signin", { state: { redirectTo: location.pathname } });
      return;
    }
  }, [location, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4 text-center">
          <h1 className="text-4xl font-bold">Welcome to Press Genie</h1>
          <p className="text-lg text-gray-600">
            Your AI-powered assistant for creating professional press releases and blog posts.
          </p>
          <Button
            onClick={() => navigate("/signin", { 
              state: { redirectTo: location.pathname } 
            })}
            className="w-full"
          >
            Sign In to Continue
          </Button>
        </div>
      </div>
    );
  }

  return null;
};