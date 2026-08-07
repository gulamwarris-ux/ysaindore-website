import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, CalendarCheck } from "lucide-react";
import { NAV } from "../../data/content";
import { scrollToId } from "./Reveal";
import { useEnquiry } from "./enquiry";

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { openEnquiry } = useEnquiry();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (item) => {
    setOpenMenu(false);
    if (item.route) { navigate(item.to); return; }
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => scrollToId(item.to), 350);
    } else scrollToId(item.to);
  };

  return (
    <header
      data-testid="site-header"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/85 backdrop-blur-xl shadow-soft border-b border-ysa-mist" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-[68px] flex items-center justify-between">
        <button onClick={() => go({ to: "hero" })} className="flex items-center gap-2.5 group" data-testid="logo-button">
          <img src="/logo.png" alt="Young Scientist Academy logo" className="h-10 w-10 rounded-lg object-contain" />
          <div className="leading-none text-left">
            <div className="font-extrabold text-ysa-blue text-[15px] tracking-tight">YOUNG SCIENTIST</div>
            <div className="font-semibold text-ysa-green text-[11px] tracking-[0.18em]">ACADEMY · INDORE</div>
          </div>
        </button>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((item) => (
            <button
              key={item.label}
              data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => go(item)}
              className="px-3.5 py-2 text-sm font-medium text-ysa-navy/80 hover:text-ysa-blue rounded-lg hover:bg-ysa-mist transition-colors"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openEnquiry("demo")}
            data-testid="header-book-demo"
            className="hidden sm:inline-flex items-center gap-2 bg-ysa-blue hover:bg-ysa-navy text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lift"
          >
            <CalendarCheck className="h-4 w-4" /> Book Free Demo
          </button>
          <button
            className="lg:hidden p-2 text-ysa-navy"
            onClick={() => setOpenMenu((v) => !v)}
            data-testid="mobile-menu-toggle"
            aria-label="Toggle menu"
          >
            {openMenu ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {openMenu && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-white border-t border-ysa-mist"
          >
            <div className="px-5 py-4 flex flex-col gap-1">
              {NAV.map((item) => (
                <button
                  key={item.label}
                  onClick={() => go(item)}
                  className="text-left px-3 py-3 rounded-lg text-ysa-navy font-medium hover:bg-ysa-mist"
                  data-testid={`mobile-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => { setOpenMenu(false); openEnquiry("demo"); }}
                className="mt-2 bg-ysa-blue text-white font-semibold px-4 py-3 rounded-xl"
                data-testid="mobile-book-demo"
              >
                Book Free Demo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
