import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const Pricing = ({ session, profile, onOpenAuth }) => {
    const [loadingTier, setLoadingTier] = useState(null);

    const handlePurchase = async (tierName, credits, price) => {
        // 1. Check if logged in
        if (!session) {
            onOpenAuth();
            return;
        }

        // 2. Prevent re-purchasing current plan
        if (profile?.tier === tierName) return;

        try {
            setLoadingTier(tierName);

            // 3. Call Secure RPC to update plan
            const { error } = await supabase.rpc('purchase_plan', {
                target_tier: tierName,
                target_credits: credits
            });

            if (error) {
                if (error.code === 'PGRST202') {
                    alert('SYSTEM ERROR: The "purchase_plan" function is missing from the database.\n\nPlease run the code in "src/rpc_purchase.sql" in your Supabase SQL Editor to fix this.');
                } else {
                    throw error;
                }
                return;
            }

            // 4. Reload page to show new status (simple refresh)
            window.location.reload();

        } catch (error) {
            console.error('Purchase failed:', error);
            alert('Purchase failed: ' + error.message);
        } finally {
            setLoadingTier(null);
        }
    };

    const getButtonState = (tierName) => {
        if (loadingTier === tierName) return 'Processing...';
        if (profile?.tier === tierName) return 'Current Plan';
        return 'Upgrade';
    };

    const isCurrent = (tierName) => profile?.tier === tierName;

    return (
        <section id="pricing" className="relative py-24 px-6 border-t border-white/5 bg-black/40 backdrop-blur-3xl">
            <div className="absolute inset-0 bg-violet-900/5 pointer-events-none"></div>
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                        Simple, Transparent <span className="text-violet-400">Pricing</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Start building for free. Scale as you grow. No hidden fees.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Free Tier */}
                    <div className={`relative group p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${isCurrent('FREE') ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-white mb-2">Free</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-white">₹0</span>
                                <span className="text-sm text-gray-500">/mo</span>
                            </div>
                        </div>
                        <ul className="space-y-3 mb-8 text-sm text-gray-400">
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                1 Project
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                100 Credits
                            </li>
                        </ul>
                        <button
                            onClick={() => handlePurchase('FREE', 10, 0)}
                            disabled={isCurrent('FREE') || loadingTier}
                            className={`w-full py-2.5 rounded-lg font-medium transition-colors border ${isCurrent('FREE') ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 cursor-default' : 'bg-white/10 text-white hover:bg-white/20 border-white/10'}`}
                        >
                            {isCurrent('FREE') ? 'Current Plan' : 'Downgrade'}
                        </button>
                    </div>

                    {/* Plus Tier */}
                    <div className={`relative group p-6 rounded-2xl border transition-all duration-300 ${isCurrent('PLUS') ? 'border-violet-500/50 bg-violet-500/5' : 'border-white/10 bg-white/5 opacity-70 grayscale-[0.5] hover:opacity-100 hover:grayscale-0'}`}>
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-violet-300 mb-2">Plus</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-white">₹19</span>
                                <span className="text-sm text-gray-500">/mo</span>
                            </div>
                        </div>
                        <ul className="space-y-3 mb-8 text-sm text-gray-400">
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                3 Projects
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                500 Credits
                            </li>
                        </ul>
                        <button
                            disabled={true}
                            className="w-full py-2.5 rounded-lg font-medium transition-colors border bg-white/5 text-gray-400 border-white/5 cursor-not-allowed"
                        >
                            Coming Soon
                        </button>
                    </div>

                    {/* Pro Tier */}
                    <div className={`relative group p-6 rounded-2xl border transition-all duration-300 shadow-2xl ${isCurrent('PRO') ? 'border-amber-500/50 bg-amber-500/10 shadow-amber-900/20' : 'border-violet-500/30 bg-violet-900/10 opacity-70 grayscale-[0.5] hover:opacity-100 hover:grayscale-0'}`}>
                        {!isCurrent('PRO') && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-500 text-white px-3 py-0.5 rounded-full text-xs font-bold tracking-wide border border-gray-400">COMING SOON</div>}
                        <div className="mb-4">
                            <h3 className={`text-xl font-bold mb-2 ${isCurrent('PRO') ? 'text-amber-400' : 'text-violet-400'}`}>Pro</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-white">₹49</span>
                                <span className="text-sm text-gray-500">/mo</span>
                            </div>
                        </div>
                        <ul className="space-y-3 mb-8 text-sm text-gray-300">
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                7 Projects
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                2,000 Credits
                            </li>
                        </ul>
                        <button
                            disabled={true}
                            className="w-full py-2.5 rounded-lg font-bold transition-colors shadow-lg bg-gray-600/20 text-gray-300 border border-gray-500/30 cursor-not-allowed"
                        >
                            Coming Soon
                        </button>
                    </div>

                    {/* Developer Tier */}
                    <div className={`relative group p-6 rounded-2xl border transition-all duration-300 ${isCurrent('DEVELOPER') ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/10 bg-white/5 opacity-70 grayscale-[0.5] hover:opacity-100 hover:grayscale-0'}`}>
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-white mb-2">Developer</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-white">₹149</span>
                                <span className="text-sm text-gray-500">/mo</span>
                            </div>
                        </div>
                        <ul className="space-y-3 mb-8 text-sm text-gray-400">
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                20 Projects
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                6,000 Credits
                            </li>
                        </ul>
                        <button
                            disabled={true}
                            className="w-full py-2.5 rounded-lg font-medium transition-colors border bg-white/5 text-gray-400 border-white/5 cursor-not-allowed"
                        >
                            Coming Soon
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
