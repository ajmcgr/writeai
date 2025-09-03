import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function Templates() {
  const templates = [
    {
      title: "Product Launch",
      description: "Announce new products or services with compelling features and benefits.",
      example: "Company X Launches Revolutionary AI-Powered Solution",
    },
    {
      title: "Company News",
      description: "Share important company updates, milestones, and achievements.",
      example: "Company X Celebrates 10 Years of Innovation",
    },
    {
      title: "Partnership Announcement",
      description: "Announce strategic partnerships and collaborations.",
      example: "Company X Partners with Industry Leader to Transform Market",
    },
    {
      title: "Executive Appointment",
      description: "Announce new leadership appointments and organizational changes.",
      example: "Company X Appoints New Chief Technology Officer",
    },
    {
      title: "Award Recognition",
      description: "Share industry awards, recognition, and accolades.",
      example: "Company X Wins Prestigious Industry Excellence Award",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">
            Press release templates
          </h2>
          <p className="text-xl text-muted-foreground">
            Start with proven templates for every announcement type.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.title}>
              <CardHeader>
                <CardTitle>{template.title}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted rounded-md">
                  <p className="text-sm italic">{template.example}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}