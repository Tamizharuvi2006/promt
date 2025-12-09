import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroContent = () => {
    const navigate = useNavigate();

    return (
        <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-10 pb-20">
            <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left Column: Text Content */}
                <div className="text-left space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-mono">
                        <span>V 0.0.1 STABLE_RELEASE</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] text-white">
                        The Platform for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-white animate-gradient">Building Apps</span> <br />
                        Easier by Prompt
                    </h1>

                    <p className="text-lg text-gray-400 max-w-lg leading-relaxed border-l-2 border-white/10 pl-6">
                        We provide the best prompts to streamline your build process.
                        Simply describe your app, and let our engine handle the architecture.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-violet-600 font-pj focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-600 rounded-lg overflow-hidden"
                        >
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                            <span>START_BUILDING</span>
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </button>

                        <button
                            onClick={() => navigate('/dashboard')}
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-gray-300 transition-all duration-200 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white rounded-lg font-mono"
                        >
                            New Project
                        </button>
                    </div>

                    <div className="flex items-center gap-6 pt-8 text-sm text-gray-500 font-mono">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            <span>PROMPT OPTIMIZED</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            <span>INSTANT BUILD</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Code/System Visualization */}
                <div className="relative">
                    {/* Glass Window */}
                    <div className="relative rounded-xl bg-[#0f0f0f] border border-white/10 shadow-2xl overflow-hidden group">
                        {/* Window Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                            </div>
                            <div className="font-mono text-xs text-gray-500 flex items-center gap-2">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                builder.tsx
                            </div>
                        </div>

                        {/* Window Content */}
                        <div className="p-6 font-mono text-xs md:text-sm leading-relaxed overflow-x-auto">
                            <div className="flex">
                                <div className="flex-none w-8 text-gray-600 select-none text-right pr-4 border-r border-white/5 mr-4">
                                    {Array.from({ length: 12 }).map((_, i) => <div key={i}>{i + 1}</div>)}
                                </div>
                                <div className="text-gray-300">
                                    <div><span className="text-violet-400">const</span> <span className="text-blue-400">buildApp</span> = <span className="text-violet-400">async</span> (prompt) ={'>'} {'{'}</div>
                                    <div className="pl-4"><span className="text-gray-500">// Describe your vision</span></div>
                                    <div className="pl-4"><span className="text-violet-400">const</span> app = <span className="text-violet-400">await</span> <span className="text-yellow-400">AppBuilder</span>.create({'{'}</div>
                                    <div className="pl-8">prompt: <span className="text-green-400">"Build a CRM for real estate"</span>,</div>
                                    <div className="pl-8">features: <span className="text-fuchsia-400">["auth", "db", "api"]</span>,</div>
                                    <div className="pl-8">style: <span className="text-fuchsia-400">"minimal_dark"</span></div>
                                    <div className="pl-4">{'}'});</div>
                                    <br />
                                    <div className="pl-4"><span className="text-violet-400">return</span> app.<span className="text-blue-400">deploy</span>(<span className="text-green-400">'production'</span>);</div>
                                    <div>{'}'};</div>
                                </div>
                            </div>
                        </div>

                        {/* Glowing effect under code */}
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-violet-900/10 to-transparent pointer-events-none"></div>
                    </div>

                    {/* Floating Elements */}
                    <div className="absolute -right-8 -bottom-8 rounded-lg bg-[#1a1a1a] border border-white/10 p-4 shadow-xl animate-float" style={{ animationDelay: '1s' }}>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs font-mono text-gray-400">Latency</span>
                        </div>
                        <div className="text-xl font-bold font-mono text-white">12ms</div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default HeroContent;
