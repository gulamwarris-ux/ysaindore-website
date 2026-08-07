import React from "react";
import Marquee from "react-fast-marquee";
import { JOURNEY } from "../../data/content";

export const Ribbon = () => (
  <div className="bg-ysa-navy py-4 border-y border-white/10" data-testid="marquee-ribbon">
    <Marquee speed={40} gradient={false} autoFill>
      {JOURNEY.map((word, i) => (
        <div key={i} className="flex items-center">
          <span className="text-white font-extrabold text-2xl md:text-3xl tracking-tight px-6">{word}</span>
          <span className="text-ysa-yellow text-2xl">✦</span>
        </div>
      ))}
    </Marquee>
  </div>
);
