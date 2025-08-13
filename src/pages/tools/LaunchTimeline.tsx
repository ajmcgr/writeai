import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Download } from "lucide-react";
import { format, subDays, addDays } from "date-fns";

const LaunchTimeline = () => {
  const [launchDate, setLaunchDate] = useState("");
  const [launchType, setLaunchType] = useState("");
  const [timeline, setTimeline] = useState<any[]>([]);

  const generateTimeline = () => {
    if (!launchDate || !launchType) return;

    const launch = new Date(launchDate);
    const timelineEvents = [];

    // Base timeline for most launches
    const baseEvents = [
      { days: -21, title: "Media List Research", description: "Research and compile target journalist list", type: "prep" },
      { days: -14, title: "Press Materials Creation", description: "Draft press release, fact sheet, and media kit", type: "content" },
      { days: -10, title: "Internal Review", description: "Legal, compliance, and executive review of materials", type: "review" },
      { days: -7, title: "Media Outreach Begins", description: "Send embargoed materials to tier-1 journalists", type: "outreach" },
      { days: -3, title: "Embargo Reminder", description: "Send reminder about embargo terms and launch timing", type: "reminder" },
      { days: -1, title: "Final Preparations", description: "Prepare spokespeople, finalize social posts", type: "prep" },
      { days: 0, title: "LAUNCH DAY", description: "Press release goes live, announcement made", type: "launch" },
      { days: 1, title: "Follow-up Outreach", description: "Reach out to journalists who didn't cover initially", type: "followup" },
      { days: 3, title: "Coverage Analysis", description: "Track and analyze media coverage", type: "analysis" },
      { days: 7, title: "Thank You Notes", description: "Send thank you notes to journalists who covered", type: "followup" }
    ];

    // Customize based on launch type
    let customEvents = [...baseEvents];
    
    if (launchType === "product") {
      customEvents.splice(1, 0, 
        { days: -28, title: "Product Demo Prep", description: "Prepare product demos and screenshots", type: "prep" },
        { days: -5, title: "Beta User Outreach", description: "Contact beta users for testimonials", type: "outreach" }
      );
    } else if (launchType === "funding") {
      customEvents.splice(0, 0,
        { days: -30, title: "Investor Quotes", description: "Secure quotes from lead investors", type: "content" },
        { days: -14, title: "Financial Metrics", description: "Prepare growth metrics and use of funds", type: "content" }
      );
    } else if (launchType === "partnership") {
      customEvents.splice(1, 0,
        { days: -21, title: "Partner Coordination", description: "Align messaging with partner's PR team", type: "coordination" },
        { days: -7, title: "Joint Interview Prep", description: "Prepare executives for joint interviews", type: "prep" }
      );
    } else if (launchType === "event") {
      customEvents.splice(0, 0,
        { days: -45, title: "Venue & Speaker Confirmation", description: "Confirm venue, speakers, and agenda", type: "prep" },
        { days: -30, title: "Registration Setup", description: "Set up event registration and landing page", type: "prep" }
      );
    }

    // Generate timeline with actual dates
    customEvents.forEach(event => {
      const eventDate = event.days === 0 ? launch : 
                      event.days < 0 ? subDays(launch, Math.abs(event.days)) :
                      addDays(launch, event.days);
      
      timelineEvents.push({
        ...event,
        date: eventDate,
        dateString: format(eventDate, "MMM d, yyyy"),
        dayOfWeek: format(eventDate, "EEEE")
      });
    });

    timelineEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
    setTimeline(timelineEvents);
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      prep: "bg-blue-100 text-blue-800",
      content: "bg-green-100 text-green-800",
      review: "bg-yellow-100 text-yellow-800",
      outreach: "bg-purple-100 text-purple-800",
      reminder: "bg-orange-100 text-orange-800",
      launch: "bg-red-100 text-red-800",
      followup: "bg-indigo-100 text-indigo-800",
      analysis: "bg-gray-100 text-gray-800",
      coordination: "bg-pink-100 text-pink-800"
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const downloadTimeline = () => {
    const csvContent = [
      ["Date", "Day of Week", "Task", "Description", "Type"],
      ...timeline.map(event => [
        event.dateString,
        event.dayOfWeek,
        event.title,
        event.description,
        event.type
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `launch-timeline-${format(new Date(launchDate), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow container max-w-4xl py-20">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Launch Timeline Planner</h1>
            <p className="text-xl text-muted-foreground">
              Generate a backward-planned PR calendar with all the key dates for your launch.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Launch Details
              </CardTitle>
              <CardDescription>
                Enter your launch date and type to generate a customized PR timeline.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="launch-date">Launch Date</Label>
                  <Input
                    id="launch-date"
                    type="date"
                    value={launchDate}
                    onChange={(e) => setLaunchDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="launch-type">Launch Type</Label>
                  <Select value={launchType} onValueChange={setLaunchType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select launch type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product">Product Launch</SelectItem>
                      <SelectItem value="funding">Funding Announcement</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="general">General Announcement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={generateTimeline} className="w-full" disabled={!launchDate || !launchType}>
                <Clock className="h-4 w-4 mr-2" />
                Generate PR Timeline
              </Button>

              {timeline.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Your PR Launch Timeline</h3>
                    <Button onClick={downloadTimeline} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download CSV
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {timeline.map((event, index) => (
                      <Card key={index} className={event.days === 0 ? "border-red-300 bg-red-50" : ""}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-3">
                                <div className="text-sm font-medium text-gray-500">
                                  {event.dateString} ({event.dayOfWeek})
                                </div>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                                  {event.type}
                                </span>
                              </div>
                              <h4 className="font-semibold">{event.title}</h4>
                              <p className="text-sm text-gray-600">{event.description}</p>
                            </div>
                            {event.days !== 0 && (
                              <div className="text-right text-sm text-gray-500">
                                {event.days > 0 ? `+${event.days}` : event.days} days
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>PR Timeline Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Pre-Launch (2-6 weeks):</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Research and target relevant journalists</li>
                    <li>• Create compelling press materials</li>
                    <li>• Secure internal approvals</li>
                    <li>• Begin embargoed outreach to key media</li>
                    <li>• Prepare spokespeople and talking points</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Post-Launch (1-2 weeks):</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Follow up with interested journalists</li>
                    <li>• Monitor and track media coverage</li>
                    <li>• Respond to interview requests quickly</li>
                    <li>• Share coverage internally and with partners</li>
                    <li>• Thank journalists who provided coverage</li>
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

export default LaunchTimeline;