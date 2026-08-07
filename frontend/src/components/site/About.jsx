import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { FOUNDER } from "../../data/content";
import { Reveal } from "./Reveal";

const CHAPTERS = [
  { n: "01", title: "We teach concepts, not shortcuts", body: "Marks fade; understanding compounds. Every idea begins with something a child can observe, question and predict — so the learning actually lasts." },
  { n: "02", title: "Small batches, real attention", body: "In a crowd, doubts hide. In our rooms, every child is seen, heard and stretched at exactly their pace." },
  { n: "03", title: "Curiosity is the curriculum", body: "We protect the instinct to ask 'why'. Hands-on activities and honest mentoring turn hesitant students into confident thinkers." },
];

export const About = () => (
  <section id="about" className="py-24 md:py-32 bg-ysa-mist relative overflow-hidden" data-testid="about-section">
    <div className="grain" />
    <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
      <Reveal className="max-w-3xl mb-16">
        <span className="text-xs font-bold tracking-[0.22em] text-ysa-green uppercase">Our Belief</span>
        <h2 className="mt-3 text-3xl md:text-5xl font-extrabold text-ysa-navy tracking-tight leading-[1.1]">
          A different kind of academy — one that grows thinkers.
        </h2>
        <p className="mt-6 text-xl md:text-2xl font-semibold text-ysa-blue leading-snug">
          Where students don't just study science—<span className="text-ysa-green">they experience it.</span>
        </p>
      </Reveal>

      <div className="grid lg:grid-cols-3 gap-6 mb-16">
        {CHAPTERS.map((c, i) => (
          <Reveal key={c.n} delay={i * 0.1}>
            <div className="h-full bg-white rounded-2xl p-8 border border-white shadow-soft">
              <div className="text-5xl font-extrabold text-ysa-yellow/90">{c.n}</div>
              <h3 className="mt-4 text-xl font-bold text-ysa-navy">{c.title}</h3>
              <p className="mt-3 text-ysa-navy/60 leading-relaxed">{c.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Founder */}
      <Reveal>
        <div className="grid lg:grid-cols-[0.4fr_0.6fr] gap-8 bg-ysa-navy rounded-[32px] p-8 md:p-12 overflow-hidden relative">
          <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-ysa-blue/40 blur-3xl" />
          <div className="relative z-10 flex flex-col items-center lg:items-start">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.7 }}
              className="h-40 w-40 rounded-3xl bg-gradient-to-br from-ysa-yellow to-[#e08a00] flex items-center justify-center shadow-lift ring-4 ring-white/10"
            >
              <span className="text-6xl font-extrabold text-ysa-navy">{FOUNDER.monogram}</span>
            </motion.div>
            <div className="mt-5 text-center lg:text-left">
              <div className="text-2xl font-extrabold text-white">{FOUNDER.name}</div>
              <div className="text-ysa-yellow font-semibold text-sm mt-1">{FOUNDER.role}</div>
            </div>
          </div>

          <div className="relative z-10 text-white">
            <Quote className="h-8 w-8 text-ysa-yellow mb-3" />
            <p className="text-lg md:text-xl leading-relaxed text-white/90">{FOUNDER.bio}</p>
            <blockquote className="mt-5 text-ysa-yellow/90 italic font-medium">“{FOUNDER.quote}”</blockquote>
            <div className="mt-6 flex flex-wrap gap-2">
              {FOUNDER.credentials.map((c) => (
                <span key={c} className="text-xs font-semibold bg-white/10 text-white/90 px-3 py-1.5 rounded-full ring-1 ring-white/15">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);
