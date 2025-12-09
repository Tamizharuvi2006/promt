import React from 'react';
import { RiBrainLine, RiCpuLine, RiBook3Line, RiRocketLine, RiPieChartLine, RiShieldKeyholeLine } from 'react-icons/ri';

const Features = () => {
    return (
        <section id="features" className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <h2 className="text-sm font-mono text-violet-400 tracking-wider uppercase mb-4">
                        <span className="inline-block w-2 h-2 bg-violet-500 rounded-full mr-2 animate-pulse"></span>
                        Full Stack Generation
                    </h2>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        From Prompt to
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Deployed App <br /> In Seconds</span>
                    </h1>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 grid-rows-[auto_auto_auto]">

                    {/* Large Card - Smart Prompt Enhancer */}
                    <div className="md:col-span-6 lg:col-span-8 row-span-2 glass-card group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="p-8 h-full flex flex-col justify-between relative z-10">
                            <div>
                                <div className="mb-6 text-violet-400">
                                    <RiBrainLine className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Smart Prompt Enhancer</h3>
                                <p className="text-gray-400 max-w-sm">
                                    Transform vague ideas into engineered master prompts. Our AI refines your input for maximum clarity, context, and output quality across any model.
                                </p>
                            </div>

                            {/* Abstract Visualization */}
                            <div className="mt-8 relative h-48 rounded-xl bg-black/40 border border-white/5 overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-0 grid grid-cols-6 gap-1 p-4 opacity-30">
                                    {Array.from({ length: 24 }).map((_, i) => (
                                        <div key={i} className="bg-violet-500/20 rounded-sm animate-pulse" style={{ animationDelay: `${i * 100}ms` }}></div>
                                    ))}
                                </div>
                                <div className="font-mono text-xs text-violet-300 bg-black/60 px-4 py-2 rounded-full border border-violet-500/30 backdrop-blur-md">
                                    Optimizing Context Window... 100%
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tall Card - Multi-Model Support */}
                    <div className="md:col-span-6 lg:col-span-4 row-span-2 glass-card group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-bl from-fuchsia-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="p-8 h-full relative z-10">
                            <div className="mb-6 text-fuchsia-400">
                                <RiCpuLine className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Model Agnostic</h3>
                            <p className="text-gray-400 mb-8">Generated prompts optimized specifically for the nuances of every major LLM.</p>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-fuchsia-500/30 transition-colors cursor-default group/item">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <div className="text-xs text-gray-400 font-mono">GPT-4 / Turbo</div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-fuchsia-500/30 transition-colors cursor-default group/item">
                                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                    <div className="text-xs text-gray-400 font-mono">Claude 3.5 Sonnet</div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-fuchsia-500/30 transition-colors cursor-default group/item">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <div className="text-xs text-gray-400 font-mono">Midjourney v6</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Wide Card - Prompt Library */}
                    <div className="md:col-span-12 lg:col-span-4 glass-card group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500">
                        <div className="p-8 relative z-10">
                            <div className="flex items-start justify-between mb-4">
                                <div className="text-blue-400">
                                    <RiBook3Line className="w-8 h-8" />
                                </div>
                                <span className="text-xs font-mono text-gray-500 border border-white/10 px-2 py-1 rounded">LIBRARY</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Prompt Library</h3>
                            <p className="text-sm text-gray-400">Save, organize, and version control your high-performing prompts.</p>
                        </div>
                    </div>

                    {/* Card - Token Optimization */}
                    <div className="md:col-span-6 lg:col-span-4 glass-card group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500">
                        <div className="p-8 relative z-10 h-full flex flex-col">
                            <div className="mb-4">
                                <div className="text-violet-400">
                                    <RiPieChartLine className="w-8 h-8" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-4">Token Efficiency</h3>
                            <div className="flex-1 flex items-end justify-between gap-2 h-24 pb-2">
                                {[90, 80, 70, 60, 50, 40].map((h, i) => (
                                    <div key={i} className="w-full bg-violet-500/20 rounded-t-sm relative group/bar">
                                        <div
                                            className="absolute bottom-0 w-full bg-violet-500/50 rounded-t-sm transition-all duration-700 group-hover/bar:bg-violet-400"
                                            style={{ height: `${h}%` }}
                                        ></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Card - Private & Secure */}
                    <div className="md:col-span-6 lg:col-span-4 glass-card group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="p-8 relative z-10">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="text-emerald-400">
                                    <RiShieldKeyholeLine className="w-8 h-8" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-white">Private & Secure</h3>
                            <p className="text-sm text-gray-400 mt-2">Your intellectual property is safe. Prompts are stored privately.</p>
                        </div>
                    </div>

                </div>

                {/* Bottom CTA */}
                <div className="mt-24 text-center">
                    <button className="relative inline-flex group">
                        <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
                        <div className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-black font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 border border-white/10 group-hover:bg-gray-900">
                            Start Prompting Now
                            <RiRocketLine className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                        </div>
                    </button>
                </div>

            </div>
        </section>
    );
};

export default Features;
