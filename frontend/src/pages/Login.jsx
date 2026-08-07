import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user?.is_admin) navigate("/admin", { replace: true });
  }, [user, loading, navigate]);

  const login = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + "/admin";
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-ysa-navy relative overflow-hidden px-5" data-testid="login-page">
      <div className="grain" />
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-ysa-blue/40 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-ysa-yellow/10 blur-3xl" />
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-lift p-8 md:p-10">
        <div className="flex items-center gap-2.5 mb-8">
          <img src="/logo.png" alt="Young Scientist Academy" className="h-11 w-11 rounded-lg object-contain" />
          <div className="leading-none">
            <div className="font-extrabold text-ysa-blue text-sm tracking-tight">YOUNG SCIENTIST</div>
            <div className="font-semibold text-ysa-green text-[11px] tracking-[0.18em]">ACADEMY · INDORE</div>
          </div>
        </div>
        <div className="h-12 w-12 rounded-2xl bg-ysa-blue/10 flex items-center justify-center mb-5">
          <ShieldCheck className="h-6 w-6 text-ysa-blue" />
        </div>
        <h1 className="text-2xl font-extrabold text-ysa-navy">Admin Dashboard</h1>
        <p className="mt-2 text-ysa-navy/60 text-sm">Sign in with your authorised Google account to view and manage enquiries & demo bookings.</p>

        {!loading && user && !user.is_admin && (
          <div className="mt-5 rounded-xl bg-red-50 text-red-700 text-sm px-4 py-3" data-testid="login-not-authorised">
            <strong>{user.email}</strong> is not authorised for admin access.
          </div>
        )}

        <button onClick={login} data-testid="google-login-button"
          className="mt-6 w-full inline-flex items-center justify-center gap-3 bg-white border-2 border-ysa-mist hover:border-ysa-blue text-ysa-navy font-semibold h-12 rounded-xl transition-all hover:-translate-y-0.5">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" className="h-5 w-5" />
          Continue with Google
        </button>

        <Link to="/" className="mt-6 inline-flex items-center gap-1.5 text-sm text-ysa-navy/50 hover:text-ysa-blue">
          <ArrowLeft className="h-4 w-4" /> Back to website
        </Link>
      </div>
    </main>
  );
}
