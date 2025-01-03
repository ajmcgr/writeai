import { Button } from "@/components/ui/button";

export function Enterprise() {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container max-w-4xl text-center px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight sm:text-4xl mb-4">
          Enterprise Solutions
        </h2>
        <p className="text-lg md:text-xl mb-8 text-primary-foreground/90">
          Custom solutions for high-volume press release needs. Let's discuss how we can help scale your communications.
        </p>
        <Button size="lg" variant="secondary" asChild>
          <a href="mailto:support@trywrite.ai">Contact Us</a>
        </Button>
      </div>
    </section>
  );
}