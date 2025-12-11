import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RiHome4Line, RiDashboardLine, RiShieldKeyholeLine } from 'react-icons/ri';
import { supabase } from '../supabaseClient';
import Seo from '../components/Seo';

const ErrorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasSession, setHasSession] = useState(false);
  const [cleaned, setCleaned] = useState(false);

  // Detect existing session to tailor the primary action
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setHasSession(!!data?.session);
    };
    checkSession();
  }, []);

  // If URL has auth tokens, strip them to avoid broken routes
  useEffect(() => {
    const url = new URL(window.location.href);
    const hasTokens = url.searchParams.get('access_token') || url.searchParams.get('refresh_token');
    if (hasTokens && !cleaned) {
      url.search = '';
      window.history.replaceState({}, '', url.toString());
      setCleaned(true);
    }
  }, [cleaned]);

  const goHome = () => navigate('/');
  const goDashboard = () => navigate('/dashboard');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4">
      <Seo
        title="PromptWeb | Page Not Found"
        description="PromptWeb prompt web app page not found. Return to dashboard or home."
        keywords="promptweb 404, prompt web app not found"
        canonical="https://webprompt.app/404"
      />
      <div className="max-w-lg w-full bg-[#0f0f0f] border border-white/10 rounded-2xl p-8 shadow-2xl text-center space-y-4">
        <div className="flex items-center justify-center gap-3 text-fuchsia-300 text-sm font-mono">
          <RiShieldKeyholeLine className="w-6 h-6" />
          <span>Page not found or expired link</span>
        </div>
        <h1 className="text-2xl font-bold">Let's get you back on track</h1>
        <p className="text-gray-400 text-sm leading-relaxed">
          The page you requested does not exist or your link has expired. If you arrived here from an auth email, try again—your magic link may have been used already.
        </p>

        {location?.search && (
          <div className="text-[11px] text-gray-500 bg-white/5 border border-white/10 rounded-lg p-3">
            Cleaned query: tokens removed for safety.
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={hasSession ? goDashboard : goHome}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-colors"
          >
            {hasSession ? <RiDashboardLine className="w-5 h-5" /> : <RiHome4Line className="w-5 h-5" />}
            {hasSession ? 'Return to Dashboard' : 'Return Home'}
          </button>
          <button
            onClick={hasSession ? goHome : goDashboard}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold transition-colors"
          >
            {hasSession ? <RiHome4Line className="w-5 h-5" /> : <RiDashboardLine className="w-5 h-5" />}
            {hasSession ? 'Go Home' : 'Go to Dashboard'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
