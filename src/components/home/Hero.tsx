import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <div className="relative pt-20 pb-16 md:pt-32 md:pb-24 bg-[#848ac8]">
      <div className="container flex flex-col items-center text-center gap-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-white font-reckless">
          Meet your AI press release writing assistant
        </h1>
        <p className="text-xl text-white/80 max-w-2xl font-mabry">
          Create high-quality and impactful press releases with Write AI
        </p>
        <Link to="/app">
          <Button size="lg" className="text-lg bg-white text-[#848ac8] hover:bg-gray-100 font-mabry">
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