import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, RefreshCw, BarChart2, Layout, Save, History, Upload, Download } from "lucide-react";

export function Features() {
  const features = [
    {
      title: "AI Rewrite",
      description: "Transform your content with AI-powered rewriting that maintains your message while improving clarity and impact.",
      icon: RefreshCw,
    },
    {
      title: "AI Analysis",
      description: "Get instant feedback on your writing with AI-powered analysis of tone, readability, and impact.",
      icon: BarChart2,
    },
    {
      title: "Professional Templates",
      description: "Start with expertly crafted templates for product launches, company news, partnerships, and more.",
      icon: FileText,
    },
    {
      title: "Smart Formatting",
      description: "Format your content quickly with markdown shortcuts and intuitive styling tools.",
      icon: Layout,
    },
    {
      title: "Auto-save",
      description: "Never lose your work with automatic saving",
      icon: Save,
    },
    {
      title: "Version History",
      description: "Track changes and restore previous versions",
      icon: History,
    },
    {
      title: "Import Files",
      description: "Upload and convert existing documents",
      icon: Upload,
    },
    {
      title: "Export Options",
      description: "Download in multiple formats",
      icon: Download,
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Powerful features to help you write better
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to create professional press releases.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <feature.icon className="h-8 w-8 mb-4" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}