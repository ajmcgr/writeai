import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface AuthCheckProps {
  isAuthenticated: boolean;
}

export const AuthCheck = ({ isAuthenticated }: AuthCheckProps) => {
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4 text-center">
          <h1 className="text-4xl font-bold">Welcome to Press Genie</h1>
          <p className="text-lg text-gray-600">
            Your AI-powered assistant for creating professional press releases and blog posts.
          </p>
          <Button
            onClick={() => navigate("/auth")}
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