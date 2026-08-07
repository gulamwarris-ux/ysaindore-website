import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";
import { BOARDS } from "../../data/content";
import { Reveal } from "./Reveal";
import { useEnquiry } from "./enquiry";

export const BoardAssessment = () => {
  const { openEnquiry } = useEnquiry();
  return (
    <section id="assessment" className="py-14" data-testid="assessment-section">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px] bg-ysa-yellow px-7 md:px-14 py-12 md:py-16">
            <div className="grain" />
            <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-white/20 blur-2xl" />
            <div className="relative z-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
              <div>
                <span className="inline-flex items-center gap-2 bg-ysa-navy text-white text-xs font-bold tracking-wide uppercase px-3 py-1.5 rounded-full">
                  <Compass className="h-3.5 w-3.5" /> Signature Feature
                </span>
                <h2 className="mt-5 text-3xl md:text-5xl font-extrabold text-ysa-navy tracking-tight leading-[1.08]">
                  Confused about which board is right for your child?
                </h2>
                <p className="mt-4 text-ysa-navy/80 text-lg max-w-xl font-medium">
                  Our scientifically designed <strong>Board Selection Assessment</strong> helps you understand whether
                  CBSE, ICSE, IB or the State Board best matches your child's learning style, strengths and future aspirations.
                </p>
                <button
                  onClick={() => openEnquiry("assessment")}
                  data-testid="assessment-cta"
                  className="mt-8 inline-flex items-center gap-2 bg-ysa-navy hover:bg-ysa-blue text-white font-semibold px-7 py-4 rounded-xl transition-all hover:-translate-y-1 hover:shadow-lift"
                >
                  Take the Assessment <ArrowRight className="h-5 w-5" />
                </button>
              </div>

              <div className="relative flex flex-wrap gap-3 justify-center lg:justify-end">
                {BOARDS.map((b, i) => (
                  <motion.div
                    key={b}
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-white rounded-2xl shadow-lift px-6 py-5 min-w-[130px] text-center"
                  >
                    <div className="text-2xl font-extrabold text-ysa-blue">{b}</div>
                    <div className="text-xs text-ysa-navy/50 mt-1 font-medium">Which fits?</div>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                  className="w-full text-center lg:text-right text-6xl font-extrabold text-ysa-navy/15 select-none"
                >
                  ?
                </motion.div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
