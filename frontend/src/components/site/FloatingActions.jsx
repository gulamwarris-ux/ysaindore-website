import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Phone, CalendarCheck, Plus, X } from "lucide-react";
import { CONTACT } from "../../data/content";
import { useEnquiry } from "./enquiry";

export const FloatingActions = () => {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const { openEnquiry } = useEnquiry();

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const actions = [
    {
      key: "demo", label: "Book Free Demo", icon: CalendarCheck, bg: "bg-ysa-blue",
      onClick: () => { setOpen(false); openEnquiry("demo"); },
    },
    {
      key: "whatsapp", label: "WhatsApp", icon: MessageCircle, bg: "bg-ysa-green",
      href: `https://wa.me/${CONTACT.whatsapp}?text=Hi%20Young%20Scientist%20Academy,%20I'd%20like%20to%20know%20more.`,
    },
    {
      key: "call", label: "Call Now", icon: Phone, bg: "bg-ysa-navy",
      href: `tel:${CONTACT.phoneIntl}`,
    },
  ];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
          className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3"
          data-testid="floating-menu"
        >
          <AnimatePresence>
            {open && actions.map((a, i) => {
              const Icon = a.icon;
              const content = (
                <>
                  <span className="bg-white text-ysa-navy text-sm font-semibold px-3 py-1.5 rounded-lg shadow-lift whitespace-nowrap">
                    {a.label}
                  </span>
                  <span className={`h-12 w-12 rounded-full ${a.bg} text-white flex items-center justify-center shadow-lift`}>
                    <Icon className="h-5 w-5" />
                  </span>
                </>
              );
              const motionProps = {
                initial: { opacity: 0, y: 14, scale: 0.8 },
                animate: { opacity: 1, y: 0, scale: 1 },
                exit: { opacity: 0, y: 14, scale: 0.8 },
                transition: { delay: i * 0.05, ease: [0.16, 1, 0.3, 1] },
                className: "flex items-center gap-3",
                "data-testid": `float-${a.key}`,
              };
              return a.href ? (
                <motion.a key={a.key} href={a.href} target={a.key === "whatsapp" ? "_blank" : undefined}
                  rel="noreferrer" aria-label={a.label} onClick={() => setOpen(false)} {...motionProps}>
                  {content}
                </motion.a>
              ) : (
                <motion.button key={a.key} onClick={a.onClick} aria-label={a.label} {...motionProps}>
                  {content}
                </motion.button>
              );
            })}
          </AnimatePresence>

          <button
            onClick={() => setOpen((v) => !v)}
            data-testid="floating-toggle"
            aria-label={open ? "Close contact menu" : "Open contact menu"}
            className="relative h-14 w-14 rounded-full bg-ysa-yellow text-ysa-navy flex items-center justify-center shadow-lift hover:scale-110 transition-transform"
          >
            {!open && <span className="absolute inset-0 rounded-full bg-ysa-yellow animate-ping opacity-30" />}
            <motion.span animate={{ rotate: open ? 90 : 0 }} className="relative">
              {open ? <X className="h-7 w-7" /> : <Plus className="h-7 w-7" strokeWidth={2.5} />}
            </motion.span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
