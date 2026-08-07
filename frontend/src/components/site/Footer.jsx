import React from "react";
import { useNavigate } from "react-router-dom";
import { Instagram, Facebook, Youtube, MessageCircle, Phone, Mail, MapPin, Clock } from "lucide-react";
import { NAV, COURSES, CONTACT } from "../../data/content";
import { scrollToId } from "./Reveal";

const SOCIAL_ICONS = { Instagram, Facebook, Youtube };

export const Footer = () => {
  const navigate = useNavigate();
  const go = (item) => {
    if (item.route) return navigate(item.to);
    if (window.location.pathname !== "/") { navigate("/"); setTimeout(() => scrollToId(item.to), 350); }
    else scrollToId(item.to);
  };

  return (
    <footer className="bg-ysa-navy text-white pt-16 pb-8 relative overflow-hidden" data-testid="site-footer">
      <div className="grain" />
      <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
        <div className="grid gap-10 lg:grid-cols-4 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Young Scientist Academy" className="h-11 w-11 rounded-lg bg-white p-1 object-contain" />
              <div className="leading-none">
                <div className="font-extrabold text-[15px]">YOUNG SCIENTIST</div>
                <div className="font-semibold text-ysa-yellow text-[11px] tracking-[0.18em]">ACADEMY · INDORE</div>
              </div>
            </div>
            <p className="mt-4 text-white/60 text-sm leading-relaxed max-w-xs">
              Concepts Today. Innovations Tomorrow. Concept-based science & maths coaching for Grades 3–10.
            </p>
            <div className="flex gap-2 mt-5">
              {CONTACT.socials.map((s) => {
                const Icon = SOCIAL_ICONS[s.icon];
                return (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}
                    className="h-10 w-10 rounded-xl bg-white/10 hover:bg-ysa-yellow hover:text-ysa-navy flex items-center justify-center transition-colors">
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-ysa-yellow mb-4 text-sm tracking-wide uppercase">Quick Links</h4>
            <ul className="space-y-2.5">
              {NAV.map((item) => (
                <li key={item.label}>
                  <button onClick={() => go(item)} className="text-white/70 hover:text-white text-sm transition-colors">{item.label}</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-ysa-yellow mb-4 text-sm tracking-wide uppercase">Courses</h4>
            <ul className="space-y-2.5">
              {COURSES.map((c) => (
                <li key={c.title} className="text-white/70 text-sm">{c.title}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-ysa-yellow mb-4 text-sm tracking-wide uppercase">Contact</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li><a href={`tel:${CONTACT.phoneIntl}`} className="flex items-center gap-2 hover:text-white"><Phone className="h-4 w-4 text-ysa-yellow" /> {CONTACT.phone}</a></li>
              <li><a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white"><MessageCircle className="h-4 w-4 text-ysa-yellow" /> WhatsApp Chat</a></li>
              <li><a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 hover:text-white"><Mail className="h-4 w-4 text-ysa-yellow" /> {CONTACT.email}</a></li>
              <li className="flex items-start gap-2"><MapPin className="h-4 w-4 text-ysa-yellow mt-0.5 shrink-0" /> 27 Pakiza Greens, Indore 452016, Madhya Pradesh</li>
              <li className="flex items-start gap-2"><Clock className="h-4 w-4 text-ysa-yellow mt-0.5 shrink-0" /> Mon–Sat: 3:30 PM – 8:30 PM · Sun & holidays closed</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>© {new Date().getFullYear()} Young Scientist Academy, Indore. All rights reserved.</p>
          <div className="flex gap-4">
            <button className="hover:text-white">Privacy Policy</button>
            <a href={CONTACT.mapLink} target="_blank" rel="noreferrer" className="hover:text-white">Google Map</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
