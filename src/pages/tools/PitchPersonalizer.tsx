import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Copy, User, Newspaper } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PitchPersonalizer = () => {
  const [journalistName, setJournalistName] = useState("");
  const [beat, setBeat] = useState("");
  const [recentWork, setRecentWork] = useState("");
  const [personalizedOpener, setPersonalizedOpener] = useState("");
  const { toast } = useToast();

  const generateOpener = () => {
    if (!journalistName || !beat) {
      toast({
        title: "Missing information",
        description: "Please enter both journalist name and beat.",
        variant: "destructive",
      });
      return;
    }

    const openers = [
      `Hi ${journalistName}, I've been following your ${beat} coverage and particularly enjoyed your recent work on ${recentWork || 'industry trends'}. I have a story that aligns perfectly with your beat...`,
      
      `${journalistName}, your insights on ${beat} always offer a fresh perspective. Given your expertise in this space, I thought you'd be interested in...`,
      
      `Hello ${journalistName}, I noticed your recent ${beat} coverage and how you focus on ${recentWork || 'innovative developments'}. I have an exclusive story that fits your editorial focus...`,
      
      `Hi ${journalistName}, as someone who covers ${beat} with such depth and accuracy, I wanted to share an exclusive development that your readers would find valuable...`,
      
      `${journalistName}, I've been impressed by your ${beat} reporting, especially your approach to ${recentWork || 'breaking down complex topics'}. I have a timely story that matches your editorial style...`
    ];

    const randomOpener = openers[Math.floor(Math.random() * openers.length)];
    setPersonalizedOpener(randomOpener);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(personalizedOpener);
    toast({
      title: "Opener copied!",
      description: "Personalized pitch opener has been copied to your clipboard.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow container max-w-4xl py-20">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Pitch Personalization Helper</h1>
            <p className="text-xl text-muted-foreground">
              Create tailored pitch openers that reference a journalist's beat and recent work to improve response rates.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Journalist Information
              </CardTitle>
              <CardDescription>
                Enter the journalist's details to generate a personalized pitch opener.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="journalist-name">Journalist Name</Label>
                  <Input
                    id="journalist-name"
                    placeholder="e.g., Sarah Johnson"
                    value={journalistName}
                    onChange={(e) => setJournalistName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="beat">Beat/Coverage Area</Label>
                  <Input
                    id="beat"
                    placeholder="e.g., fintech, healthcare, SaaS"
                    value={beat}
                    onChange={(e) => setBeat(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="recent-work">Recent Article/Work (Optional)</Label>
                <Input
                  id="recent-work"
                  placeholder="e.g., AI startup funding trends, cybersecurity breaches"
                  value={recentWork}
                  onChange={(e) => setRecentWork(e.target.value)}
                />
              </div>

              <Button onClick={generateOpener} className="w-full">
                Generate Personalized Opener
              </Button>

              {personalizedOpener && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Newspaper className="h-5 w-5" />
                      Your Personalized Opener
                    </h3>
                    <Button onClick={copyToClipboard} variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <Textarea
                    value={personalizedOpener}
                    onChange={(e) => setPersonalizedOpener(e.target.value)}
                    className="min-h-[120px]"
                    placeholder="Your personalized opener will appear here..."
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pitch Personalization Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Do This:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Reference specific recent articles</li>
                    <li>• Mention their beat or expertise area</li>
                    <li>• Show you understand their audience</li>
                    <li>• Keep the opener under 2 sentences</li>
                    <li>• Be genuine, not overly flattering</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Avoid This:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Generic "I love your work" statements</li>
                    <li>• Mentioning irrelevant articles</li>
                    <li>• Being too familiar or casual</li>
                    <li>• Making the opener too long</li>
                    <li>• Obvious copy-paste templates</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PitchPersonalizer;