import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CalendarCheck, ArrowRight, Sparkles } from "lucide-react";
import { useEnquiry } from "./enquiry";
import { scrollToId } from "./Reveal";

const lineParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const lineChild = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

const Line = ({ children, className = "" }) => (
  <span className="line-mask">
    <motion.span variants={lineChild} className={`block ${className}`}>{children}</motion.span>
  </span>
);

export const Hero = () => {
  const { openEnquiry } = useEnquiry();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  return (
    <section id="hero" ref={ref} className="relative min-h-[100svh] flex items-center pt-24 pb-16 overflow-hidden bg-ysa-mist">
      <div className="grain" />
      {/* decorative blobs */}
      <div className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-ysa-yellow/20 blur-3xl" />
      <div className="absolute bottom-0 -left-32 w-[380px] h-[380px] rounded-full bg-ysa-green/10 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center w-full">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="inline-flex items-center gap-2 bg-white border border-ysa-mist rounded-full pl-2 pr-4 py-1.5 shadow-soft mb-6"
          >
            <span className="bg-ysa-yellow text-ysa-navy text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> INDORE
            </span>
            <span className="text-xs font-medium text-ysa-navy/70">Concepts Today. Innovations Tomorrow.</span>
          </motion.div>

          <motion.h1
            variants={lineParent} initial="hidden" animate="show"
            className="text-4xl sm:text-5xl lg:text-[4.2rem] font-extrabold leading-[1.04] tracking-tight text-ysa-navy"
          >
            <Line>Building</Line>
            <Line className="text-ysa-blue">Curious Minds.</Line>
            <Line>Creating Future</Line>
            <Line className="text-ysa-green">Innovators.</Line>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
            className="mt-6 text-base md:text-lg text-ysa-navy/70 max-w-xl font-medium"
          >
            Small Batches <span className="text-ysa-yellow font-bold">•</span> Individual Attention{" "}
            <span className="text-ysa-yellow font-bold">•</span> Concept Mastery{" "}
            <span className="text-ysa-yellow font-bold">•</span> Expert Mentoring
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <button
              onClick={() => openEnquiry("demo")}
              data-testid="hero-book-demo"
              className="inline-flex items-center gap-2 bg-ysa-blue hover:bg-ysa-navy text-white font-semibold px-7 py-4 rounded-xl transition-all hover:-translate-y-1 hover:shadow-lift"
            >
              <CalendarCheck className="h-5 w-5" /> Book a Free Demo
            </button>
            <button
              onClick={() => scrollToId("courses")}
              data-testid="hero-explore-courses"
              className="inline-flex items-center gap-2 bg-white border-2 border-ysa-navy/10 hover:border-ysa-blue text-ysa-navy font-semibold px-7 py-4 rounded-xl transition-all hover:-translate-y-1"
            >
              Explore Courses <ArrowRight className="h-5 w-5" />
            </button>
          </motion.div>
        </div>

        {/* Photography — spotlight clipped frame with parallax */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="relative rounded-[28px] overflow-hidden shadow-lift aspect-[4/5] max-w-[460px] mx-auto ring-1 ring-ysa-navy/5">
            <motion.img
              style={{ y, scale }}
              src="https://images.pexels.com/photos/8471859/pexels-photo-8471859.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=740"
              alt="Young students conducting a science experiment in the lab"
              className="w-full h-[118%] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ysa-navy/25 to-transparent" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
            className="absolute -bottom-5 -left-2 sm:left-4 bg-white rounded-2xl shadow-lift px-5 py-3.5 flex items-center gap-3"
          >
            <div className="text-3xl font-extrabold text-ysa-blue">15+</div>
            <div className="text-xs font-semibold text-ysa-navy/70 leading-tight">Years Building<br />Young Scientists</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.25 }}
            className="absolute -top-3 -right-1 sm:right-2 bg-ysa-yellow rounded-2xl shadow-lift px-4 py-3 rotate-3"
          >
            <div className="text-xs font-bold text-ysa-navy leading-tight">Concept-Based<br />Learning ✦</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
