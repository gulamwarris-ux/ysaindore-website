import React, { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import "@/App.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { EnquiryProvider } from "@/components/site/enquiry";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingActions } from "@/components/site/FloatingActions";
import { AuthCallback } from "@/components/site/AuthCallback";
import { ProtectedAdmin } from "@/components/site/ProtectedAdmin";
import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/AdminDashboard";

function Layout() {
  const location = useLocation();

  // Process OAuth return synchronously during render (prevents race conditions).
  if (location.hash?.includes("session_id=")) return <AuthCallback />;

  const bare = location.pathname.startsWith("/admin") || location.pathname === "/login";

  return (
    <>
      {!bare && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedAdmin><AdminDashboard /></ProtectedAdmin>} />
      </Routes>
      {!bare && <Footer />}
      {!bare && <FloatingActions />}
    </>
  );
}

function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    window.__lenis = lenis;
    let raf;
    const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); window.__lenis = null; };
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <EnquiryProvider>
            <Layout />
            <Toaster position="top-center" richColors />
          </EnquiryProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
