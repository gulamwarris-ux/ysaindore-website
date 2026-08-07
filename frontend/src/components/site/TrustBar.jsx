import React from "react";
import { Award, Users, Target, GraduationCap } from "lucide-react";
import { TRUST } from "../../data/content";
import { Reveal } from "./Reveal";

const ICONS = [Award, Users, Target, GraduationCap];

export const TrustBar = () => (
  <section className="bg-ysa-blue relative overflow-hidden" data-testid="trust-bar">
    <div className="grain" />
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 grid grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
      {TRUST.map((t, i) => {
        const Icon = ICONS[i];
        return (
          <Reveal key={t.label} delay={i * 0.08} className="flex items-center gap-4">
            <div className="shrink-0 h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center ring-1 ring-white/20">
              <Icon className="h-6 w-6 text-ysa-yellow" strokeWidth={1.7} />
            </div>
            <div className="text-white">
              <div className="text-xl md:text-2xl font-extrabold leading-none">
                {t.value} <span className="text-sm font-semibold text-white/90">{t.label}</span>
              </div>
              <div className="text-xs text-white/60 mt-1">{t.sub}</div>
            </div>
          </Reveal>
        );
      })}
    </div>
  </section>
);
