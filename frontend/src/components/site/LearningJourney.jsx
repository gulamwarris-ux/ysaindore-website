import React from "react";
import { motion } from "framer-motion";
import { JOURNEY } from "../../data/content";
import { Reveal } from "./Reveal";

export const LearningJourney = () => (
  <section className="py-24 md:py-32 bg-ysa-navy relative overflow-hidden" data-testid="journey-section">
    <div className="grain" />
    <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
      <Reveal className="max-w-2xl mb-16">
        <span className="text-xs font-bold tracking-[0.22em] text-ysa-yellow uppercase">The Learning Journey</span>
        <h2 className="mt-3 text-3xl md:text-5xl font-extrabold text-white tracking-tight">
          Six steps from curiosity to excellence.
        </h2>
      </Reveal>

      <div className="relative">
        <div className="hidden md:block absolute top-7 left-0 right-0 h-0.5 bg-white/10" />
        <motion.div
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          style={{ transformOrigin: "left" }}
          className="hidden md:block absolute top-7 left-0 right-0 h-0.5 bg-gradient-to-r from-ysa-green via-ysa-yellow to-ysa-yellow"
        />
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-4">
          {JOURNEY.map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="h-14 w-14 rounded-full bg-ysa-blue border-2 border-ysa-yellow flex items-center justify-center text-white font-extrabold text-lg shadow-lift">
                {i + 1}
              </div>
              <div className="mt-4 text-white font-bold">{step}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
