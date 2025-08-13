import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Search, Users } from "lucide-react";

const HeadlineAnalyzer = () => {
  const [headline, setHeadline] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);

  const analyzeHeadline = () => {
    if (!headline.trim()) return;

    const words = headline.trim().split(/\s+/);
    const charCount = headline.length;
    
    // SEO scoring factors
    let seoScore = 50; // Base score
    
    // Length scoring (ideal: 50-60 characters)
    if (charCount >= 50 && charCount <= 60) seoScore += 20;
    else if (charCount >= 40 && charCount <= 70) seoScore += 10;
    else if (charCount < 30 || charCount > 80) seoScore -= 10;
    
    // Power words detection
    const powerWords = ['exclusive', 'breaking', 'announces', 'launches', 'reveals', 'unveils', 'introduces', 'breakthrough', 'revolutionary', 'innovative', 'first', 'new', 'major', 'significant'];
    const foundPowerWords = powerWords.filter(word => 
      headline.toLowerCase().includes(word.toLowerCase())
    );
    seoScore += foundPowerWords.length * 5;
    
    // Number inclusion
    const hasNumbers = /\d/.test(headline);
    if (hasNumbers) seoScore += 10;
    
    // Engagement scoring factors
    let engagementScore = 40; // Base score
    
    // Emotional words
    const emotionalWords = ['amazing', 'incredible', 'shocking', 'stunning', 'remarkable', 'extraordinary', 'game-changing', 'groundbreaking'];
    const foundEmotionalWords = emotionalWords.filter(word => 
      headline.toLowerCase().includes(word.toLowerCase())
    );
    engagementScore += foundEmotionalWords.length * 8;
    
    // Question format
    if (headline.includes('?')) engagementScore += 15;
    
    // Action words
    const actionWords = ['discover', 'learn', 'find', 'explore', 'unlock', 'master', 'achieve', 'transform'];
    const foundActionWords = actionWords.filter(word => 
      headline.toLowerCase().includes(word.toLowerCase())
    );
    engagementScore += foundActionWords.length * 6;
    
    // Urgency words
    const urgencyWords = ['now', 'today', 'immediately', 'urgent', 'breaking', 'just in'];
    const foundUrgencyWords = urgencyWords.filter(word => 
      headline.toLowerCase().includes(word.toLowerCase())
    );
    engagementScore += foundUrgencyWords.length * 8;
    
    // Cap scores at 100
    seoScore = Math.min(seoScore, 100);
    engagementScore = Math.min(engagementScore, 100);
    
    // Generate recommendations
    const recommendations = [];
    
    if (charCount < 40) {
      recommendations.push("Consider making your headline longer (40-60 characters is ideal for SEO)");
    } else if (charCount > 70) {
      recommendations.push("Consider shortening your headline (40-60 characters is ideal for SEO)");
    }
    
    if (foundPowerWords.length === 0) {
      recommendations.push("Add power words like 'announces', 'launches', 'unveils', or 'breakthrough'");
    }
    
    if (!hasNumbers) {
      recommendations.push("Consider including specific numbers or statistics");
    }
    
    if (foundEmotionalWords.length === 0) {
      recommendations.push("Add emotional words to increase engagement");
    }
    
    if (!headline.includes(':')) {
      recommendations.push("Consider using a colon to separate main topic from details");
    }
    
    if (foundUrgencyWords.length === 0) {
      recommendations.push("Add urgency words like 'now' or 'today' if appropriate");
    }

    setAnalysis({
      seoScore,
      engagementScore,
      wordCount: words.length,
      charCount,
      foundPowerWords,
      foundEmotionalWords,
      foundActionWords,
      foundUrgencyWords,
      hasNumbers,
      recommendations
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow container max-w-4xl py-20">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">PR Headline Analyzer</h1>
            <p className="text-xl text-muted-foreground">
              Analyze your press release headline for SEO and engagement optimization.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Enter Your Headline</CardTitle>
              <CardDescription>
                Paste your press release headline to get an instant analysis with SEO and engagement scores.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="headline">Press Release Headline</Label>
                <Textarea
                  id="headline"
                  placeholder="Enter your press release headline here..."
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="text-sm text-muted-foreground">
                  Characters: {headline.length} | Words: {headline.trim() ? headline.trim().split(/\s+/).length : 0}
                </div>
              </div>

              <Button onClick={analyzeHeadline} className="w-full" disabled={!headline.trim()}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Analyze Headline
              </Button>

              {analysis && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Search className="h-5 w-5" />
                          SEO Score
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className={`text-2xl font-bold ${getScoreColor(analysis.seoScore)}`}>
                              {analysis.seoScore}/100
                            </span>
                            <Badge variant={getScoreVariant(analysis.seoScore)}>
                              {analysis.seoScore >= 80 ? "Excellent" : analysis.seoScore >= 60 ? "Good" : "Needs Work"}
                            </Badge>
                          </div>
                          <Progress value={analysis.seoScore} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          Engagement Score
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className={`text-2xl font-bold ${getScoreColor(analysis.engagementScore)}`}>
                              {analysis.engagementScore}/100
                            </span>
                            <Badge variant={getScoreVariant(analysis.engagementScore)}>
                              {analysis.engagementScore >= 80 ? "Excellent" : analysis.engagementScore >= 60 ? "Good" : "Needs Work"}
                            </Badge>
                          </div>
                          <Progress value={analysis.engagementScore} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Headline Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="font-semibold">Length</div>
                          <div>{analysis.charCount} characters</div>
                          <div>{analysis.wordCount} words</div>
                        </div>
                        <div>
                          <div className="font-semibold">Power Words</div>
                          <div>{analysis.foundPowerWords.length} found</div>
                          {analysis.foundPowerWords.length > 0 && (
                            <div className="text-green-600">{analysis.foundPowerWords.join(", ")}</div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold">Emotional Words</div>
                          <div>{analysis.foundEmotionalWords.length} found</div>
                          {analysis.foundEmotionalWords.length > 0 && (
                            <div className="text-blue-600">{analysis.foundEmotionalWords.join(", ")}</div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold">Numbers</div>
                          <div>{analysis.hasNumbers ? "✓ Present" : "✗ Missing"}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {analysis.recommendations.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysis.recommendations.map((rec: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-blue-500 mt-1">•</span>
                              <span className="text-sm">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Headline Optimization Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">SEO Best Practices:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Keep headlines 40-60 characters for search results</li>
                    <li>• Include target keywords naturally</li>
                    <li>• Use numbers and specific data points</li>
                    <li>• Include location for local SEO</li>
                    <li>• Use action words like "announces" or "launches"</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Engagement Tactics:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Create curiosity with compelling language</li>
                    <li>• Use emotional triggers appropriately</li>
                    <li>• Include urgency when relevant</li>
                    <li>• Make the benefit clear to readers</li>
                    <li>• Test different headline variations</li>
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

export default HeadlineAnalyzer;