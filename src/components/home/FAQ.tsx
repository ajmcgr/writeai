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
      question: "What's included in the free trial?",
      answer: "Our 7-day free trial gives you full access to all Pro features including unlimited AI press release generation, premium templates, and AI-powered suggestions. No credit card required to start.",
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
      answer: "Simply sign up for a free trial to begin. You'll get immediate access to all Pro features for 7 days, with no credit card required. You can upgrade to a Pro plan anytime to continue using all features.",
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
              <AccordionTrigger className="text-xl">{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}