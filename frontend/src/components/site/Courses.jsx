import React from "react";
import { Sprout, BookOpen, GraduationCap, FlaskConical, Trophy, Atom, ArrowUpRight } from "lucide-react";
import { COURSES } from "../../data/content";
import { Reveal } from "./Reveal";
import { useEnquiry } from "./enquiry";

const ICONS = { Sprout, BookOpen, GraduationCap, FlaskConical, Trophy, Atom };

export const Courses = () => {
  const { openEnquiry } = useEnquiry();
  return (
    <section id="courses" className="py-24 md:py-32 bg-white" data-testid="courses-section">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <Reveal className="max-w-2xl mb-14">
          <span className="text-xs font-bold tracking-[0.22em] text-ysa-green uppercase">Our Programs</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-extrabold text-ysa-navy tracking-tight">
            Courses built around <span className="text-ysa-blue">understanding</span>, not memorising.
          </h2>
          <p className="mt-4 text-ysa-navy/60 text-lg">
            From playful foundations to board mastery — every program is concept-first, activity-driven and mentored in small batches.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES.map((c, i) => {
            const Icon = ICONS[c.icon];
            return (
              <Reveal key={c.title} delay={(i % 3) * 0.08}>
                <div
                  data-testid={`course-card-${i}`}
                  className="group h-full bg-white border border-ysa-mist rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift hover:border-transparent"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${c.color}18` }}
                    >
                      <Icon className="h-7 w-7" strokeWidth={1.7} style={{ color: c.color }} />
                    </div>
                    <span className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-ysa-mist text-ysa-navy/60">
                      {c.tag}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-ysa-navy">{c.title}</h3>
                  <p className="mt-2 text-ysa-navy/60 text-[15px] leading-relaxed">{c.desc}</p>
                  <button
                    onClick={() => openEnquiry("admission")}
                    data-testid={`course-learn-more-${i}`}
                    className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-ysa-blue group-hover:gap-2 transition-all"
                  >
                    Learn More <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
