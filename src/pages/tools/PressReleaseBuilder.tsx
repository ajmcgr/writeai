import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PressReleaseBuilder = () => {
  const [selectedType, setSelectedType] = useState("");
  const [template, setTemplate] = useState("");
  const { toast } = useToast();

  const templates = {
    "product-launch": {
      title: "Product Launch Press Release Template",
      content: `FOR IMMEDIATE RELEASE

[Company Name] Launches [Product Name]: [Brief Description of What It Does]

[Subheadline: One sentence explaining the key benefit or unique selling point]

[CITY, State] – [Date] – [Company Name], [brief company description], today announced the launch of [Product Name], a [product category] designed to [main benefit/solution]. This innovative [product/solution] addresses [problem it solves] and is now available [where/how to get it].

"[Quote from CEO/founder about the product launch and its significance]," said [Name], [Title] of [Company Name]. "[Additional insight about market need or company vision]."

Key Features of [Product Name]:
• [Feature 1 and benefit]
• [Feature 2 and benefit]  
• [Feature 3 and benefit]

[Product Name] is available [pricing/availability details]. [Company Name] expects [growth projections or market impact].

About [Company Name]
[Company boilerplate - 2-3 sentences about what the company does, when founded, location, and mission]

For more information about [Product Name], visit [website] or contact:
[Contact Name]
[Title]
[Phone]
[Email]

###`
    },
    "funding": {
      title: "Funding Announcement Press Release Template",
      content: `FOR IMMEDIATE RELEASE

[Company Name] Raises $[Amount] in [Series X] Funding to [Main Use of Funds]

[Subheadline: One sentence about lead investor and what this enables]

[CITY, State] – [Date] – [Company Name], [brief company description], today announced it has raised $[amount] in [Series X] funding led by [Lead Investor], with participation from [other notable investors]. The funding will be used to [primary use of funds] and [secondary use].

The round brings [Company Name]'s total funding to $[total amount] and values the company at [valuation if disclosed]. Since [last milestone/funding], the company has [key achievements/growth metrics].

"[Quote from CEO about growth, market opportunity, and what this funding enables]," said [CEO Name], CEO and [co-]founder of [Company Name]. "[Vision for future growth and market impact]."

"[Quote from lead investor about why they invested and market opportunity]," said [Investor Name], [Title] at [Investment Firm]. "[Additional insight about the company's potential]."

[Company Name] plans to use the funding to:
• [Specific use 1]
• [Specific use 2]
• [Specific use 3]

About [Company Name]
[Company boilerplate - 2-3 sentences about what the company does, when founded, location, and mission]

About [Lead Investor]
[Brief description of the lead investor]

For more information, visit [website] or contact:
[Contact Name]
[Title]
[Phone]
[Email]

###`
    },
    "partnership": {
      title: "Partnership Announcement Press Release Template",
      content: `FOR IMMEDIATE RELEASE

[Company Name] Partners with [Partner Company] to [Main Benefit/Outcome]

[Subheadline: One sentence explaining what this partnership enables for customers]

[CITY, State] – [Date] – [Company Name], [brief company description], today announced a strategic partnership with [Partner Company], [partner description]. This collaboration will [main outcome/benefit] and is expected to [impact/timeline].

The partnership combines [Company Name]'s [strength/capability] with [Partner Company]'s [strength/capability] to deliver [customer benefit]. [Specific details about what the partnership entails].

"[Quote from your company's executive about the partnership value and strategic fit]," said [Name], [Title] of [Company Name]. "[Additional insight about market opportunity or customer benefit]."

"[Quote from partner company executive about the collaboration]," said [Partner Name], [Title] of [Partner Company]. "[Their perspective on the partnership value]."

Key benefits of the partnership include:
• [Benefit 1 for customers/market]
• [Benefit 2 for customers/market]
• [Benefit 3 for customers/market]

The partnership is effective immediately and [additional details about rollout, availability, etc.].

About [Company Name]
[Company boilerplate - 2-3 sentences about what the company does, when founded, location, and mission]

About [Partner Company]
[Partner company boilerplate]

For more information, visit [website] or contact:
[Contact Name]
[Title]
[Phone]
[Email]

###`
    },
    "event": {
      title: "Event Announcement Press Release Template",
      content: `FOR IMMEDIATE RELEASE

[Company Name] to Host [Event Name]: [Brief Description of Event Focus]

[Subheadline: One sentence about key speakers, attendees, or event highlights]

[CITY, State] – [Date] – [Company Name], [brief company description], today announced [Event Name], a [event type] focused on [event theme/topic]. The event will take place on [date] at [location/virtual platform] and will feature [key highlights].

[Event Name] will bring together [target audience] to [event purpose/goals]. The event will include [format details - keynotes, panels, workshops, etc.] and is expected to attract [expected attendance/reach].

"[Quote from company executive about why they're hosting this event and its importance]," said [Name], [Title] of [Company Name]. "[Additional insight about industry trends or company mission connection]."

Event highlights include:
• [Keynote speaker and topic]
• [Panel or session highlight]
• [Networking or special feature]
• [Any special announcements planned]

[Registration/attendance details]: [How to register, cost, capacity limits, etc.]

[Additional details about sponsors, media partnerships, or special features]

About [Company Name]
[Company boilerplate - 2-3 sentences about what the company does, when founded, location, and mission]

For event information and registration, visit [event website] or contact:
[Contact Name]
[Title]
[Phone]
[Email]

Media Contact:
[Media Contact Name]
[Title]
[Phone]
[Email]

###`
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(template);
    toast({
      title: "Template copied!",
      description: "Press release template has been copied to your clipboard.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow container max-w-4xl py-20">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Press Release Structure Builder</h1>
            <p className="text-xl text-muted-foreground">
              Choose your announcement type and get a professional, SEO-friendly press release template instantly.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Select Your Announcement Type</CardTitle>
              <CardDescription>
                Get a tailored press release template with proper structure and placeholder copy.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Select value={selectedType} onValueChange={(value) => {
                setSelectedType(value);
                setTemplate(templates[value as keyof typeof templates]?.content || "");
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your press release type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product-launch">Product Launch</SelectItem>
                  <SelectItem value="funding">Funding Announcement</SelectItem>
                  <SelectItem value="partnership">Partnership Announcement</SelectItem>
                  <SelectItem value="event">Event Announcement</SelectItem>
                </SelectContent>
              </Select>

              {template && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      {templates[selectedType as keyof typeof templates]?.title}
                    </h3>
                    <Button onClick={copyToClipboard} variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Template
                    </Button>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm font-mono">{template}</pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Tips for Your Press Release</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Include target keywords in your headline and first paragraph</li>
                <li>• Use location and date for local SEO relevance</li>
                <li>• Add your company boilerplate with key terms</li>
                <li>• Include relevant links to your website and resources</li>
                <li>• Optimize for featured snippets with clear, concise information</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PressReleaseBuilder;