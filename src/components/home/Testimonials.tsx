import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import sarahJohnsonAvatar from "@/assets/avatars/sarah-johnson.jpg";
import michaelChenAvatar from "@/assets/avatars/michael-chen.jpg";
import emilyRodriguezAvatar from "@/assets/avatars/emily-rodriguez.jpg";
import davidKimAvatar from "@/assets/avatars/david-kim.jpg";
import lisaThompsonAvatar from "@/assets/avatars/lisa-thompson.jpg";
import jamesWilsonAvatar from "@/assets/avatars/james-wilson.jpg";

export function Testimonials() {
  const testimonials = [
    {
      author: "Sarah Johnson",
      role: "PR Director",
      content: "Write AI has transformed how we create press releases. The AI suggestions are spot-on!",
      handle: "@sarahjpr",
      avatar: sarahJohnsonAvatar,
      initials: "SJ",
    },
    {
      author: "Michael Chen",
      role: "Communications Manager",
      content: "The templates save us hours of work. Best PR tool investment we've made.",
      handle: "@mchenpr",
      avatar: michaelChenAvatar,
      initials: "MC",
    },
    {
      author: "Emily Rodriguez",
      role: "PR Specialist",
      content: "Clean interface, powerful AI, and great templates. Exactly what we needed.",
      handle: "@emilyrpr",
      avatar: emilyRodriguezAvatar,
      initials: "ER",
    },
    {
      author: "David Kim",
      role: "Agency Owner",
      content: "Our team's productivity doubled since using Write AI. The ROI is incredible.",
      handle: "@davidkpr",
      avatar: davidKimAvatar,
      initials: "DK",
    },
    {
      author: "Lisa Thompson",
      role: "PR Consultant",
      content: "Finally, an AI tool that understands PR! The quality of suggestions is amazing.",
      handle: "@lisatpr",
      avatar: lisaThompsonAvatar,
      initials: "LT",
    },
    {
      author: "James Wilson",
      role: "Media Relations",
      content: "Game-changer for our press release workflow. Highly recommend!",
      handle: "@jameswpr",
      avatar: jamesWilsonAvatar,
      initials: "JW",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">
            Loved by PR professionals
          </h2>
          <p className="text-xl text-muted-foreground">
            See what people are saying about Write AI.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                    <AvatarFallback>{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="mb-4">{testimonial.content}</p>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <p className="text-sm text-primary">{testimonial.handle}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}