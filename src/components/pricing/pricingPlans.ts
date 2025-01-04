export const plans = {
  monthly: [
    {
      name: "Free Trial",
      description: "Try all Pro features free for 7 days",
      price: "0",
      period: "month",
      features: [
        "7-day free trial with unlimited access",
        "AI-powered suggestions",
        "Premium templates",
        "Download text",
        "Priority support",
      ],
      stripeUrl: "",
    },
    {
      name: "Pro",
      description: "For businesses that need more",
      price: "30",
      period: "month",
      features: [
        "Unlimited AI press release documents",
        "AI-powered suggestions",
        "Premium templates",
        "Download text",
        "Priority support",
      ],
      stripeUrl: "https://buy.stripe.com/3csdUq5MQ6w2gzS4gg",
    },
  ],
  annual: [
    {
      name: "Free Trial",
      description: "Try all Pro features free for 7 days",
      price: "0",
      period: "year",
      features: [
        "7-day free trial with unlimited access",
        "AI-powered suggestions",
        "Premium templates",
        "Download text",
        "Priority support",
      ],
      stripeUrl: "",
    },
    {
      name: "Pro",
      description: "For businesses that need more",
      price: "300",
      period: "year",
      features: [
        "Unlimited AI press release documents",
        "AI-powered suggestions",
        "Premium templates",
        "Download text",
        "Priority support",
      ],
      stripeUrl: "https://buy.stripe.com/aEU8A6cbeaMibfy145",
    },
  ],
};