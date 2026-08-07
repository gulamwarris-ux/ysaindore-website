import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Phone } from "lucide-react";
import { CONTACT } from "../../data/content";

export const FloatingActions = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.a
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            href={`https://wa.me/${CONTACT.whatsapp}?text=Hi%20Young%20Scientist%20Academy,%20I'd%20like%20to%20know%20more.`}
            target="_blank" rel="noreferrer" data-testid="float-whatsapp" aria-label="Chat on WhatsApp"
            className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full bg-ysa-green text-white flex items-center justify-center shadow-lift hover:scale-110 transition-transform"
          >
            <span className="absolute inset-0 rounded-full bg-ysa-green animate-ping opacity-30" />
            <MessageCircle className="h-7 w-7 relative" />
          </motion.a>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {show && (
          <motion.a
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            href={`tel:${CONTACT.phoneIntl}`} data-testid="float-call" aria-label="Call now"
            className="fixed bottom-5 left-5 z-50 h-14 w-14 rounded-full bg-ysa-blue text-white flex items-center justify-center shadow-lift hover:scale-110 transition-transform"
          >
            <Phone className="h-6 w-6" />
          </motion.a>
        )}
      </AnimatePresence>
    </>
  );
};
