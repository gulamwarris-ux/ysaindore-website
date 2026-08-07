import React from "react";
import { Hero } from "../components/site/Hero";
import { TrustBar } from "../components/site/TrustBar";
import { Courses } from "../components/site/Courses";
import { BoardAssessment } from "../components/site/BoardAssessment";
import { About } from "../components/site/About";
import { WhyChoose } from "../components/site/WhyChoose";
import { Ribbon } from "../components/site/Marquee";
import { LearningJourney } from "../components/site/LearningJourney";
import { Gallery } from "../components/site/Gallery";
import { Testimonials } from "../components/site/Testimonials";
import { CTASection } from "../components/site/CTASection";
import { Contact } from "../components/site/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustBar />
      <Courses />
      <BoardAssessment />
      <About />
      <Ribbon />
      <WhyChoose />
      <LearningJourney />
      <Gallery />
      <Testimonials />
      <CTASection />
      <Contact />
    </main>
  );
}
