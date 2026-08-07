import React from "react";
import { CalendarCheck, Phone } from "lucide-react";
import { Reveal } from "./Reveal";
import { useEnquiry } from "./enquiry";
import { CONTACT } from "../../data/content";

export const CTASection = () => {
  const { openEnquiry } = useEnquiry();
  return (
    <section className="py-20" data-testid="cta-section">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px] bg-ysa-blue px-7 md:px-16 py-16 md:py-20 text-center">
            <div className="grain" />
            <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-ysa-green/30 blur-3xl" />
            <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-ysa-yellow/20 blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight max-w-2xl mx-auto leading-[1.12]">
                Ready to give your child a strong foundation?
              </h2>
              <p className="mt-4 text-white/80 text-lg max-w-xl mx-auto">
                Book a free demo class and see concept-based learning in action.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => openEnquiry("demo")}
                  data-testid="cta-book-demo"
                  className="inline-flex items-center gap-2 bg-ysa-yellow hover:bg-white text-ysa-navy font-bold px-7 py-4 rounded-xl transition-all hover:-translate-y-1 hover:shadow-lift"
                >
                  <CalendarCheck className="h-5 w-5" /> Book Free Demo
                </button>
                <a
                  href={`tel:${CONTACT.phoneIntl}`}
                  data-testid="cta-call"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-4 rounded-xl ring-1 ring-white/25 transition-all hover:-translate-y-1"
                >
                  <Phone className="h-5 w-5" /> Contact Us
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
