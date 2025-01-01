import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-reckless">About Write AI</h1>
              <p className="text-lg text-gray-700">
                Write AI is the leading AI-powered press release writing tool, designed to help businesses create compelling and effective press releases in minutes. Our advanced AI technology combines industry best practices with natural language processing to deliver outstanding results every time.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-reckless">Founder</h2>
              <p className="text-lg text-gray-700">My name is Alex MacGregor.</p>
              <p className="text-lg text-gray-700">
                I've done Marketing & Communications for over 8 years with a proven track record of driving success for leading consumer tech brands.
              </p>
              <p className="text-lg text-gray-700">
                Now, I help founders and startups with PR.
              </p>
            </div>
          </div>
          
          <div className="relative">
            <img
              src="/lovable-uploads/11620a6c-93dd-4199-ab21-e032fcf8b2d8.png"
              alt="Alex MacGregor"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;