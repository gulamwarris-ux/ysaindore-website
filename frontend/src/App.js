import React, { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lenis from "lenis";
import "@/App.css";
import { Toaster } from "@/components/ui/sonner";
import { EnquiryProvider } from "@/components/site/enquiry";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingActions } from "@/components/site/FloatingActions";
import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";

function App() {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenisRef.current = lenis;
    window.__lenis = lenis;
    let raf;
    const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); window.__lenis = null; };
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <EnquiryProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
          </Routes>
          <Footer />
          <FloatingActions />
          <Toaster position="top-center" richColors />
        </EnquiryProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
