import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import HeroContent from '../components/HeroContent';
import Pricing from '../components/Pricing';
import Stats from '../components/Stats';
import Features from '../components/Features';
import AuthModal from '../components/AuthModal';
import UserDropdown from '../components/UserDropdown';
import Seo from '../components/Seo';
import Footer from '../components/Footer';

import logo from '../assets/logo.webp';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session }, error }) => {
            if (error) {
                console.error("Supabase Auth Error:", error.message);
                if (error.status === 401) {
                    console.warn("Update your .env file with valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY");
                }
            }
            setSession(session);
        });

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Fetch Profile when session is available
    useEffect(() => {
        if (session?.user?.id) {
            const fetchProfile = async () => {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (!error && data) {
                    setProfile(data);
                }
            };
            fetchProfile();
        } else {
            setProfile(null);
        }
    }, [session]);

    return (
        <div className="min-h-screen bg-[#0a0a0a] relative flex flex-col font-sans selection:bg-violet-500/30">
            <Seo />

            {/* Navigation - Tech Style */}
            <nav className="relative z-50 px-6 py-3 border-b border-white/[0.06] backdrop-blur-sm bg-black/20 sticky top-0">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3 md:gap-6 justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                        <img src={logo} alt="Prompt AI Logo" className="h-16 w-auto" />
                        <span className="text-xl font-bold tracking-tight text-white font-mono">
                            PROMPT_AI<span className="text-violet-500">.SYS</span>
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
                        {['FEATURES', 'STATS', 'PRICING', 'DOCS'].map((item) => (
                            <a key={item} href={`#${item.toLowerCase()}`} className="px-4 py-2 text-xs font-mono text-gray-400 hover:text-white hover:bg-white/5 rounded transition-all">
                                {item}
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 flex-wrap justify-end w-full md:w-auto">
                        <span className="hidden md:inline-block font-mono text-xs text-emerald-500 whitespace-nowrap">
                            ● SYSTEM_ONLINE
                        </span>
                        {session ? (
                            <div className="flex items-center gap-3 flex-wrap justify-end w-full md:w-auto">
                                <UserDropdown session={session} profile={profile} />
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="px-5 py-2 text-sm font-medium bg-white text-black hover:bg-violet-50 transition-colors border border-transparent rounded w-full sm:w-auto"
                                >
                                    Launch Console
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 flex-wrap justify-end w-full md:w-auto">
                                <button
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="text-sm font-medium text-gray-300 hover:text-white transition-colors w-full sm:w-auto text-left"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="px-5 py-2 text-sm font-medium bg-white text-black hover:bg-violet-50 transition-colors border border-transparent rounded w-full sm:w-auto"
                                >
                                    Launch Console
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <main className="relative z-10 bg-transparent">
                {/* Hero */}
                <HeroContent />

                {/* Stats */}
                <div id="stats">
                    <Stats />
                </div>

                {/* Pricing */}
                <Pricing
                    session={session}
                    profile={profile}
                    onOpenAuth={() => setIsAuthModalOpen(true)}
                />

                {/* Features */}
                <Features />
            </main>

            {/* Bottom gradient line */}
            <div className="h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent w-full relative z-10"></div>

            <Footer />

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div>
    );
};

export default Home;
