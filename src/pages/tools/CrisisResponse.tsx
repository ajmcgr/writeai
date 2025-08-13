import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CrisisResponse = () => {
  const [situationType, setSituationType] = useState("");
  const [situationDetails, setSituationDetails] = useState("");
  const [responseStatement, setResponseStatement] = useState("");
  const { toast } = useToast();

  const templates = {
    "data-breach": `We are aware of a security incident affecting [specific systems/data]. We immediately took action to secure our systems and are working with cybersecurity experts to investigate.

We take the security of [customer/user] data extremely seriously. Based on our current investigation:
• [What data was potentially affected]
• [What data was NOT affected] 
• [Steps we've taken to secure systems]

We are working closely with [law enforcement/regulatory bodies] and will provide updates as our investigation continues. Affected [customers/users] will be contacted directly with specific information and next steps.

We sincerely apologize for this incident and any inconvenience it may cause.`,

    "service-outage": `We are currently experiencing [service/system] issues affecting [scope of impact]. Our technical teams are actively working to resolve this issue.

What we know:
• Issue began at approximately [time]
• [Brief description of the problem]
• [Current status of resolution efforts]

We understand how disruptive this is to [customers/users] and are working around the clock to restore full service. We will provide updates every [timeframe] until the issue is resolved.

For the latest updates, please visit [status page/website].`,

    "product-recall": `We are voluntarily recalling [product name] [model/batch numbers] due to [safety concern]. Customer safety is our top priority.

What you need to know:
• [Specific products affected]
• [Nature of the safety issue]
• [Immediate steps customers should take]

If you own an affected product:
• Stop using it immediately
• Contact us at [contact information]
• We will provide [remedy - replacement/refund/repair]

We are working closely with [regulatory agencies] and will provide all necessary support to affected customers.`,

    "executive-misconduct": `We recently became aware of allegations concerning [title, not name] at our company. We take such matters extremely seriously and have initiated a thorough investigation.

Our response:
• [Executive] has been [placed on leave/suspended] pending investigation
• We have retained an independent [law firm/investigator] to conduct a comprehensive review
• We are cooperating fully with [relevant authorities if applicable]

These allegations do not reflect our company values. We are committed to maintaining the highest standards of [professional conduct/integrity] and will take appropriate action based on the investigation's findings.`,

    "financial-irregularities": `We have identified [accounting irregularities/financial reporting issues] in our [time period] financial statements. We are taking immediate action to address this situation.

Our response:
• We have engaged [independent accounting firm] to conduct a comprehensive review
• We are working with [regulatory bodies] and providing full cooperation
• [Auditor/Board] is overseeing the investigation process

We are committed to complete transparency and accuracy in our financial reporting. We will provide updates as our review progresses and will file corrected statements if necessary.`
  };

  const generateStatement = () => {
    if (!situationType || !situationDetails) {
      toast({
        title: "Missing information",
        description: "Please select a situation type and provide details.",
        variant: "destructive",
      });
      return;
    }

    const baseTemplate = templates[situationType as keyof typeof templates];
    const customizedStatement = `${baseTemplate}

Additional Context:
${situationDetails}

Contact Information:
[Company Name]
[Contact Person]
[Phone Number]
[Email Address]
[Website/Updates Page]

###

Note: This is a template. Please review with legal counsel before publishing.`;

    setResponseStatement(customizedStatement);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(responseStatement);
    toast({
      title: "Statement copied!",
      description: "Crisis response statement has been copied to your clipboard.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow container max-w-4xl py-20">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Crisis Response Statement Generator</h1>
            <p className="text-xl text-muted-foreground">
              Generate professional holding statements and public responses for crisis situations.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Crisis Situation Details
              </CardTitle>
              <CardDescription>
                Select the type of crisis and provide specific details to generate an appropriate response.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="situation-type">Situation Type</Label>
                <Select value={situationType} onValueChange={setSituationType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the type of crisis situation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="data-breach">Data Breach/Security Incident</SelectItem>
                    <SelectItem value="service-outage">Service Outage/Technical Issues</SelectItem>
                    <SelectItem value="product-recall">Product Recall/Safety Issue</SelectItem>
                    <SelectItem value="executive-misconduct">Executive Misconduct</SelectItem>
                    <SelectItem value="financial-irregularities">Financial Irregularities</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="situation-details">Situation Details</Label>
                <Textarea
                  id="situation-details"
                  placeholder="Provide specific details about the situation, timeline, impact, and any actions already taken..."
                  value={situationDetails}
                  onChange={(e) => setSituationDetails(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              <Button onClick={generateStatement} className="w-full">
                Generate Crisis Response Statement
              </Button>

              {responseStatement && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Crisis Response Statement</h3>
                    <Button onClick={copyToClipboard} variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Statement
                    </Button>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm">{responseStatement}</pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-800">Important Legal Notice</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-orange-700">
                Crisis communications can have significant legal and business implications. Always review any statement with legal counsel, compliance teams, and senior leadership before publication. This tool provides templates only and does not constitute legal advice.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Crisis Communication Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Immediate Response (0-24 hrs):</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Acknowledge the situation quickly</li>
                    <li>• Express concern for those affected</li>
                    <li>• State what you're doing to investigate</li>
                    <li>• Provide a timeline for updates</li>
                    <li>• Offer contact information</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Ongoing Communication:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Provide regular updates as promised</li>
                    <li>• Be transparent about what you know/don't know</li>
                    <li>• Share concrete actions being taken</li>
                    <li>• Address concerns proactively</li>
                    <li>• Document all communications</li>
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

export default CrisisResponse;