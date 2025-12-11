import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import Seo from '../components/Seo';

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getProfile = async () => {
            // 1. Get User Session
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                navigate('/');
                return;
            }

            // 2. Fetch Profile Data (including new columns)
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (data) {
                // Merge session email with profile data
                setProfile({
                    ...data,
                    email: session.user.email,
                    tier: data.tier || 'FREE',     // Fallback if null
                    credits: data.credits || 0     // Fallback if null
                });
            }
            setLoading(false);
        };

        getProfile();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 relative overflow-hidden font-sans selection:bg-violet-500/30">
            <Seo
                title="PromptWeb Profile"
                description="View and manage your PromptWeb profile, credits, and subscription."
                keywords="promptweb profile, prompt account, prompt builder profile"
                canonical="https://webprompt.app/profile"
            />
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-fuchsia-600/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="flex items-center justify-between mb-12">
                    <Link to="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Dashboard
                    </Link>
                    <div className="font-mono text-sm text-gray-500">PROMPT_AI_ID: {profile?.custom_id || 'Generating...'}</div>
                </div>

                <div className="bg-[#0f0f0f]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
                    {/* Glossy Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <svg className="w-64 h-64 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" /></svg>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                        {/* Premium Avatar Container */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                            <div className="relative w-32 h-32 rounded-full bg-[#1a1a1a] flex items-center justify-center overflow-hidden border-2 border-black">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl font-bold font-mono text-gray-400">{profile?.full_name?.charAt(0)}</span>
                                )}
                            </div>
                            <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-2 border-black rounded-full" title="Online"></div>
                        </div>

                        <div className="flex-1 space-y-6 w-full">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white flex items-center gap-3 flex-wrap">
                                    {profile?.full_name || 'User'}
                                    {profile?.tier === 'PRO' && (
                                        <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-black text-xs font-bold rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)]">
                                            PRO
                                        </span>
                                    )}
                                </h1>
                                <p className="text-gray-400 font-mono text-sm">{profile?.email}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-white/5">
                                <div className={`p-5 rounded-xl border transition-colors group ${profile?.tier === 'PRO' ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/30' : 'bg-gradient-to-br from-white/5 to-white/[0.02] border-white/5'}`}>
                                    <div className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-2">Current Plan</div>
                                    <div className={`text-xl font-bold tracking-tight transition-colors ${profile?.tier === 'PRO' ? 'text-amber-400' : 'text-white'}`}>
                                        {profile?.tier}
                                        {profile?.tier !== 'FREE' && profile?.plan_expires_at && (
                                            <div className="text-[10px] font-normal text-gray-400 mt-1 font-mono">
                                                Valid until: {new Date(profile.plan_expires_at).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className={`p-5 rounded-xl border transition-colors group ${profile?.credits > 50 ? 'bg-gradient-to-br from-fuchsia-500/10 to-violet-500/5 border-fuchsia-500/30' : 'bg-gradient-to-br from-white/5 to-white/[0.02] border-white/5'}`}>
                                    <div className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-2">Credits Status</div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-bold text-white tracking-tight">{profile?.credits?.toLocaleString()}</span>
                                        <span className="text-sm text-gray-400 font-medium">REMAINING</span>
                                    </div>
                                    {/* Calculated "Used" based on Tier Limits */}
                                    <div className="mt-2 text-[10px] text-gray-500 font-mono flex gap-2">
                                        <span>USED: {
                                            ((profile?.tier === 'FREE' ? 100 :
                                                profile?.tier === 'PLUS' ? 500 :
                                                    profile?.tier === 'PRO' ? 2000 :
                                                        profile?.tier === 'DEVELOPER' ? 6000 : 100) - (profile?.credits || 0)).toLocaleString()
                                        }</span>
                                        <span className="text-gray-600">/</span>
                                        <span>TOTAL: {
                                            (profile?.tier === 'FREE' ? 100 :
                                                profile?.tier === 'PLUS' ? 500 :
                                                    profile?.tier === 'PRO' ? 2000 :
                                                        profile?.tier === 'DEVELOPER' ? 6000 : 100).toLocaleString()
                                        }</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex gap-4">
                                <button className="px-6 py-2.5 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm">
                                    Manage Subscription
                                </button>
                                <button className="px-6 py-2.5 bg-white/5 text-white font-medium rounded-lg hover:bg-white/10 transition-colors border border-white/10 text-sm">
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
