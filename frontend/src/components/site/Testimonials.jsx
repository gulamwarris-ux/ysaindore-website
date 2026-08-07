import React from "react";
import { Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "../../data/content";
import { Reveal } from "./Reveal";

export const Testimonials = () => (
  <section className="py-24 md:py-32 bg-ysa-mist relative overflow-hidden" data-testid="testimonials-section">
    <div className="grain" />
    <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
      <Reveal className="max-w-2xl mb-14">
        <span className="text-xs font-bold tracking-[0.22em] text-ysa-green uppercase">Parent Testimonials</span>
        <h2 className="mt-3 text-3xl md:text-5xl font-extrabold text-ysa-navy tracking-tight">
          Trusted by parents across Indore.
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.1}>
            <div className="h-full bg-white rounded-2xl p-7 shadow-soft border border-white flex flex-col" data-testid={`testimonial-${i}`}>
              <Quote className="h-7 w-7 text-ysa-yellow" />
              <div className="flex gap-0.5 mt-3">
                {[...Array(5)].map((_, s) => <Star key={s} className="h-4 w-4 fill-ysa-yellow text-ysa-yellow" />)}
              </div>
              <p className="mt-4 text-ysa-navy/75 leading-relaxed flex-1">“{t.quote}”</p>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-ysa-mist">
                <img src={t.photo} alt={t.name} className="h-12 w-12 rounded-full object-cover" loading="lazy" />
                <div>
                  <div className="font-bold text-ysa-navy text-sm">{t.name}</div>
                  <div className="text-xs text-ysa-navy/50">{t.grade}</div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
