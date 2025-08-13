import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { X, Linkedin } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="space-y-12">
          {/* Our Story Header */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-reckless text-gray-900">Our story</h1>
            <p className="text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
              We started this to empower storytellers around the world with the most advanced AI-powered press release technology that just works.
            </p>
          </div>

          {/* Letter Content */}
          <div className="prose prose-lg max-w-none space-y-8">
            <div className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-2xl font-reckless text-gray-900 mb-6">Hello there!</h2>
              
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                  I'm Alex MacGregor, a PR strategist who has spent over 8 years helping consumer tech brands tell their stories and get coverage. Throughout this journey, I've watched founders and startups struggle with one of the most fundamental challenges in PR: writing compelling press releases that actually get attention.
                </p>
                
                <p>
                  Traditional PR was built for agencies with big budgets and dedicated teams. Startups were expected to either hire expensive agencies or figure it out themselves with generic templates that rarely captured their unique story. I found myself constantly explaining the same principles: lead with impact, include compelling quotes, structure for scanability—while watching brilliant companies struggle to translate their innovations into press-worthy narratives.
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
                  Every press release you create teaches our AI something new about effective storytelling. Every successful placement validates our belief that great PR shouldn't require a PR degree.
                </p>
              </div>
            </div>

            {/* Founder Photo and Social Links */}
            <div className="flex flex-col md:flex-row items-center gap-8 pt-8">
              <div className="flex-shrink-0">
                <img
                  src="/lovable-uploads/11620a6c-93dd-4199-ab21-e032fcf8b2d8.png"
                  alt="Alex MacGregor, Founder of Write AI"
                  className="w-48 h-48 rounded-lg shadow-lg object-cover"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-reckless text-gray-900">Alex MacGregor</h3>
                  <p className="text-gray-600">Founder, Write AI</p>
                </div>
                <div className="flex space-x-4">
                  <a 
                    href="https://x.com/alexmacgregor__" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/alexmacgregor2/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Linkedin className="h-6 w-6" />
                  </a>
                </div>
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