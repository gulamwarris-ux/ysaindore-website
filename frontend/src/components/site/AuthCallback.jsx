import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { exchangeSession } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

// REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
export const AuthCallback = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;
    const match = window.location.hash.match(/session_id=([^&]+)/);
    const sid = match ? decodeURIComponent(match[1]) : null;
    (async () => {
      if (!sid) { navigate("/login", { replace: true }); return; }
      try {
        const u = await exchangeSession(sid);
        setUser(u);
        window.history.replaceState(null, "", window.location.pathname);
        navigate("/admin", { state: { user: u }, replace: true });
      } catch {
        navigate("/login", { replace: true });
      }
    })();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-ysa-mist">
      <div className="text-ysa-navy font-semibold animate-pulse">Signing you in…</div>
    </div>
  );
};
