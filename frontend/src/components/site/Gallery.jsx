import React from "react";
import { Reveal } from "./Reveal";
import { GALLERY } from "../../data/content";

export const Gallery = () => (
  <section id="gallery" className="py-24 md:py-32 bg-white" data-testid="gallery-section">
    <div className="max-w-7xl mx-auto px-5 md:px-8">
      <Reveal className="max-w-2xl mb-14">
        <span className="text-xs font-bold tracking-[0.22em] text-ysa-green uppercase">Science in Action</span>
        <h2 className="mt-3 text-3xl md:text-5xl font-extrabold text-ysa-navy tracking-tight">
          Not a photo of a classroom. A window into discovery.
        </h2>
        <p className="mt-4 text-ysa-navy/60 text-lg">Microscopes, robotics, chemistry, STEM models and real scientific discussion — this is what learning looks like here.</p>
      </Reveal>

      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
        {GALLERY.map((g, i) => (
          <Reveal key={i} delay={(i % 4) * 0.06} className="mb-4 break-inside-avoid">
            <figure className="group relative overflow-hidden rounded-2xl shadow-soft" data-testid={`gallery-item-${i}`}>
              <img
                src={g.src}
                alt={g.alt}
                loading="lazy"
                className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                  i % 3 === 0 ? "aspect-[3/4]" : i % 3 === 1 ? "aspect-square" : "aspect-[4/5]"
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ysa-navy/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <figcaption className="absolute bottom-3 left-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                <span className="text-xs font-bold text-ysa-navy bg-ysa-yellow px-2.5 py-1 rounded-full">{g.tag}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
