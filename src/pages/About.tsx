import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { X, Linkedin } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-2xl mx-auto">
        <div className="space-y-12">
          {/* Letter Content with Border - includes headline and all content */}
          <div className="border border-gray-200 rounded-lg p-12 bg-white">
            {/* Our Story Header inside letter */}
            <div className="text-center space-y-6 mb-12">
              <h1 className="text-4xl md:text-5xl font-reckless text-gray-900">Our story</h1>
              <p className="text-lg text-gray-700 leading-relaxed">
                We started this to empower storytellers around the world with the most advanced AI-powered press release technology that just works.
              </p>
            </div>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-xl font-semibold text-gray-900">Hello there!</p>
              
              <p className="text-lg">
                I'm Alex MacGregor, a PR strategist who has spent over 8 years helping consumer tech brands tell their stories and get coverage. Throughout this journey, I've watched founders and startups struggle with one of the most fundamental challenges in PR: writing compelling press releases that actually get attention.
              </p>
              
              <p className="text-lg">
                Traditional PR tools were built for agencies with big budgets and dedicated teams. Startups were expected to either hire expensive agencies or figure it out themselves with generic templates that rarely captured their unique story. I found myself constantly explaining the same principles while watching brilliant companies struggle to translate their innovations into press-worthy narratives.
              </p>
              
              <p className="text-lg">
                That frustration became the spark for Write AI. We're building an AI-first press release tool that understands PR best practices and helps you craft professional releases in minutes, not hours.
              </p>
              
              <p className="text-lg">
                Imagine describing your announcement the way you'd pitch it to a journalist—"We just raised Series A to expand our AI-powered productivity tool"—and seeing a polished, journalist-ready press release in seconds. Then imagine having AI analyze your draft and suggest improvements based on what actually gets coverage.
              </p>
              
              <p className="text-lg">
                Our focused team builds during the day and refines AI models at night, driven by a simple goal: help you tell your story without the complexity. We'd rather perfect our AI than add unnecessary features; rather help you get coverage than sell you services you don't need.
              </p>
              
              <p className="text-lg">
                Above all, we believe the best software feels invisible—it melts into your daily rhythm so you can focus on crafting stories, not wrestling with tools.
              </p>
              
              <p className="text-lg">
                If that vision resonates, stay close. We'll be sharing progress openly and shipping fast. Together we can build the tool our industry has been waiting for.
              </p>
              
              <p className="text-lg">
                Thanks for reading, and for giving Write AI a try. You can always contact me directly if you have any questions at alex@trywrite.ai. I look forward to hearing from you.
              </p>
              
              <div className="pt-8 border-t border-gray-100 mt-8">
                <img
                  src="/alex-signature.png"
                  alt="Alex MacGregor signature"
                  className="w-32 h-auto mb-4"
                />
                
                <p className="font-semibold text-gray-900">— Alex MacGregor</p>
                <p className="font-semibold text-gray-900">Founder, Write AI</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;