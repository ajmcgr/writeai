import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  const faqs = [
    {
      question: "How does the AI press release assistant work?",
      answer: "Our AI assistant uses advanced language models to help you generate and refine press releases. Simply input your content or start from scratch, and our AI will help you create professional, engaging press releases.",
    },
    {
      question: "What's included in the free plan?",
      answer: "The free plan includes 3 AI press release rewrites every 24 hours, basic templates, and the ability to download your content in text format. You also get access to our AI-powered suggestions.",
    },
    {
      question: "Can I upgrade or downgrade my plan anytime?",
      answer: "Yes, you can change your plan at any time. When upgrading, you'll get immediate access to pro features. If you downgrade, you'll continue to have pro access until the end of your current billing period.",
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, we offer a 14-day money-back guarantee if you're not satisfied with your pro subscription. Contact our support team to process your refund.",
    },
    {
      question: "How do I get started?",
      answer: "Simply sign up for a free account to begin. You can immediately start using our AI assistant to create press releases, and upgrade to pro whenever you need more features.",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Frequently Asked Questions
          </h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}