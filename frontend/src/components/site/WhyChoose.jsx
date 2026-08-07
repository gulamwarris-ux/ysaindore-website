import React from "react";
import { UserRound, HandHeart, Lightbulb, FlaskConical, Compass, MessageSquare, ShieldCheck } from "lucide-react";
import { WHY } from "../../data/content";
import { Reveal } from "./Reveal";

const ICONS = { UserRound, HandHeart, Lightbulb, FlaskConical, Compass, MessageSquare, ShieldCheck };

export const WhyChoose = () => (
  <section className="py-24 md:py-32 bg-white" data-testid="why-section">
    <div className="max-w-7xl mx-auto px-5 md:px-8">
      <Reveal className="max-w-2xl mb-14">
        <span className="text-xs font-bold tracking-[0.22em] text-ysa-green uppercase">Why Parents Choose Us</span>
        <h2 className="mt-3 text-3xl md:text-5xl font-extrabold text-ysa-navy tracking-tight">
          Everything a parent quietly hopes for.
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {WHY.map((w, i) => {
          const Icon = ICONS[w.icon];
          const featured = i === 0;
          return (
            <Reveal key={w.title} delay={(i % 3) * 0.07} className={featured ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : ""}>
              <div
                data-testid={`why-card-${i}`}
                className={`group h-full rounded-2xl p-7 border transition-all duration-300 hover:-translate-y-1 ${
                  featured
                    ? "bg-ysa-blue border-ysa-blue text-white flex flex-col justify-between min-h-[220px]"
                    : "bg-ysa-mist/60 border-ysa-mist hover:bg-white hover:shadow-lift"
                }`}
              >
                <div
                  className={`h-12 w-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                    featured ? "bg-white/15" : "bg-white"
                  }`}
                >
                  <Icon className={`h-6 w-6 ${featured ? "text-ysa-yellow" : "text-ysa-blue"}`} strokeWidth={1.7} />
                </div>
                <div className={featured ? "mt-6" : "mt-4"}>
                  <h3 className={`text-lg font-bold ${featured ? "text-white" : "text-ysa-navy"}`}>{w.title}</h3>
                  <p className={`mt-1.5 text-sm leading-relaxed ${featured ? "text-white/75" : "text-ysa-navy/60"}`}>{w.desc}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);
