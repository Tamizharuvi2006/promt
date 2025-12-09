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
            <Seo
                title="PromptVibely Prompt Web App"
                description="PromptVibely (WebPrompt) is the prompt web app to plan, build, and test AI prompts for production apps."
                keywords="promptvibely, prompt web app, ai prompt builder, webprompt"
                canonical="https://webprompt.app/"
            />

            {/* Navigation - Tech Style */}
            <nav className="relative z-50 px-4 sm:px-6 py-3 border-b border-white/[0.06] backdrop-blur-sm bg-black/20 sticky top-0">
                <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-4 md:gap-6 justify-between flex-nowrap">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink">
                        <img src={logo} alt="Prompt AI Logo" className="h-12 md:h-16 w-auto" />
                        <span className="text-lg md:text-xl font-bold tracking-tight text-white font-mono whitespace-nowrap">
                            PROMPT_AI<span className="text-violet-500">.SYS</span>
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
                        {['FEATURES', 'STATS', 'PRICING', 'ABOUT'].map((item) => (
                            <a key={item} href={`#${item.toLowerCase()}`} className="px-4 py-2 text-xs font-mono text-gray-400 hover:text-white hover:bg-white/5 rounded transition-all">
                                {item}
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 justify-end w-auto ml-auto flex-nowrap">
                        <span className="hidden md:inline-block font-mono text-xs text-emerald-500 whitespace-nowrap">
                            ● SYSTEM_ONLINE
                        </span>
                        {session ? (
                            <div className="flex items-center gap-2 sm:gap-3 justify-end w-auto flex-nowrap">
                                <UserDropdown session={session} profile={profile} />
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="hidden sm:inline-flex px-5 py-2 text-sm font-medium bg-violet-600 text-white hover:bg-violet-500 transition-colors border border-violet-500/60 rounded shadow-sm"
                                >
                                    Launch Console
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 sm:gap-3 justify-end w-auto flex-nowrap">
                                <button
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="px-3 sm:px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-500 transition-colors border border-violet-500/60 rounded w-auto shadow-sm"
                                >
                                    Login
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

                {/* SEO Content Block */}
                <section id="about" className="relative py-16 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a] text-gray-200">
                    <div className="max-w-5xl mx-auto space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">About PromptVibely</h2>
                        <p className="text-base leading-relaxed text-gray-300">
                            PromptVibely is the platform for building apps easier by prompt. We combine a prompt web app, prompt chat, and dashboard workflows so you can design, test, and ship production-grade prompts without wrestling with scattered tools. Every flow in the product is built to keep your prompt engineering loop tight: describe what you want, see a blueprint, iterate with AI, and deploy to your stack.
                        </p>
                        <p className="text-base leading-relaxed text-gray-300">
                            Our dashboard gives you organized projects, credit tracking, and a prompt library. The prompt chat keeps conversation and context together so you can refine instructions before they hit production. We focus on clarity in the prompt itself—role, context, constraints, and evaluation—so your apps stay deterministic across GPT-4, Claude, and any model you run.
                        </p>
                        <p className="text-base leading-relaxed text-gray-300">
                            If you are evaluating prompt builders, compare us against generic editors: PromptVibely bakes in guardrails like token efficiency, response formatting, and reusable blueprints. That means fewer regressions, faster onboarding for teammates, and cleaner handoffs to engineering. The goal is simple: make prompt ops boring, predictable, and fast so your team ships features—not just drafts.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <h3 className="text-lg font-semibold text-white mb-2">Quick links</h3>
                                <ul className="space-y-2 list-disc list-inside">
                                    <li><a href="#features" className="text-violet-300 hover:text-violet-200">Explore features</a></li>
                                    <li><a href="#stats" className="text-violet-300 hover:text-violet-200">View platform stats</a></li>
                                    <li><a href="#pricing" className="text-violet-300 hover:text-violet-200">Check pricing</a></li>
                                    <li><a href="#about" className="text-violet-300 hover:text-violet-200">Why PromptVibely</a></li>
                                    <li><a href="/dashboard" className="text-violet-300 hover:text-violet-200">Open dashboard</a></li>
                                </ul>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <h3 className="text-lg font-semibold text-white mb-2">What you get</h3>
                                <ul className="space-y-2 list-disc list-inside">
                                    <li>Blueprint-first prompt planning</li>
                                    <li>Prompt chat with saved history per project</li>
                                    <li>Credits visibility and upgrade paths</li>
                                    <li>Model-agnostic prompt generation</li>
                                    <li>Secure storage for private prompts</li>
                                </ul>
                            </div>
                        </div>
                        <p className="text-base leading-relaxed text-gray-300">
                            Looking for a prompt web app that stays aligned with your roadmap? PromptVibely centers the words in your H1—building apps easier by prompt—inside every feature. Bring your own stack, connect to your preferred LLM, and keep iterating with a workflow that is designed for real shipping teams.
                        </p>
                    </div>
                </section>
            </main>

            {/* Bottom gradient line */}
            <div className="h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent w-full relative z-10"></div>

            <Footer />

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div>
    );
};

export default Home;
