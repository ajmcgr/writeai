import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { X, Linkedin } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-3xl mx-auto">
        <div className="space-y-12">
          {/* Our Story Header */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-reckless text-gray-900">Our story</h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              We started this to empower storytellers around the world with the most advanced AI-powered press release technology that just works.
            </p>
          </div>

          {/* Letter Content */}
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p className="text-lg font-semibold text-gray-900">Hello there!</p>
            
            <p>
              I'm Alex MacGregor, a PR strategist who has spent over 8 years helping consumer tech brands tell their stories and get coverage. Throughout this journey, I've watched founders and startups struggle with one of the most fundamental challenges in PR: writing compelling press releases that actually get attention.
            </p>
            
            <p>
              Traditional PR tools were built for agencies with big budgets and dedicated teams. Startups were expected to either hire expensive agencies or figure it out themselves with generic templates that rarely captured their unique story. I found myself constantly explaining the same principles while watching brilliant companies struggle to translate their innovations into press-worthy narratives.
            </p>
            
            <p>
              That frustration became the spark for Write AI. We're building an AI-first press release tool that understands PR best practices and helps you craft professional releases in minutes, not hours.
            </p>
            
            <p>
              Imagine describing your announcement the way you'd pitch it to a journalist—"We just raised Series A to expand our AI-powered productivity tool"—and seeing a polished, journalist-ready press release in seconds. Then imagine having AI analyze your draft and suggest improvements based on what actually gets coverage.
            </p>
            
            <p>
              Our focused team builds during the day and refines AI models at night, driven by a simple goal: help you tell your story without the complexity. We'd rather perfect our AI than add unnecessary features; rather help you get coverage than sell you services you don't need.
            </p>
            
            <p>
              Above all, we believe the best software feels invisible—it melts into your daily rhythm so you can focus on crafting stories, not wrestling with tools.
            </p>
            
            <p>
              If that vision resonates, stay close. We'll be sharing progress openly and shipping fast. Together we can build the tool our industry has been waiting for.
            </p>
            
            <p>
              Thanks for reading, and for giving Write AI a try. You can always contact me directly if you have any questions at alex@trywrite.ai. I look forward to hearing from you.
            </p>
            
            <div className="pt-8">
              <img
                src="/lovable-uploads/11620a6c-93dd-4199-ab21-e032fcf8b2d8.png"
                alt="Alex MacGregor, Founder of Write AI"
                className="w-32 h-32 rounded object-cover mb-4"
              />
              
              <p className="font-semibold text-gray-900">— Alex MacGregor</p>
              <p className="font-semibold text-gray-900 mb-4">Founder, Write AI</p>
              
              <div className="flex space-x-4">
                <a 
                  href="https://www.linkedin.com/in/alexmacgregor2/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Connect with me on LinkedIn
                </a>
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