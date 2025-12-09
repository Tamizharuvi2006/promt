import React from 'react';
import { RiFolder3Line, RiCpuLine, RiRocketLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';

const DashboardStats = ({ projects, profile, setUpgradeModalOpen, currentLimit, usagePercentage }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Stat 1: Total Projects */}
            <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <RiFolder3Line className="w-24 h-24 text-violet-500" />
                </div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-gray-400 font-medium">Total Projects</h3>
                        <RiFolder3Line className="text-violet-500 w-5 h-5" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{projects.length}</div>
                    <div className="text-xs text-violet-400">Active AI projects</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-transparent opacity-50"></div>
            </div>

            {/* Stat 2: Credits */}
            <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <RiCpuLine className="w-24 h-24 text-fuchsia-500" />
                </div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-gray-400 font-medium">AI Credits</h3>
                        <RiCpuLine className="text-fuchsia-500 w-5 h-5" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{profile?.credits || 0}</div>
                    <div className="text-xs text-fuchsia-400">Generations remaining</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-fuchsia-500 to-transparent opacity-50"></div>
            </div>

            {/* Stat 3: Plan Usage */}
            <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5"></div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                    <h3 className="text-gray-400 font-medium">Current Plan</h3>
                    <div className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${profile?.tier === 'PRO' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-violet-500/10 text-violet-400 border-violet-500/20'
                        }`}>
                        {profile?.tier || 'FREE'}
                    </div>
                </div>
                <div className="relative flex items-center justify-center py-2">
                    <div className="relative w-32 h-16 overflow-hidden">
                        <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-8 border-white/10"></div>
                        <div
                            className="absolute top-0 left-0 w-32 h-32 rounded-full"
                            style={{
                                background: `conic-gradient(from 225deg, transparent 0deg, #8b5cf6 0deg ${usagePercentage * 1.8}deg, transparent ${usagePercentage * 1.8}deg 360deg)`,
                            }}
                        ></div>
                    </div>
                    <div className="absolute bottom-0 text-center">
                        <span className="text-xl font-bold text-white block">{projects.length} / {currentLimit === 9999 ? '∞' : currentLimit}</span>
                        <span className="text-[10px] text-gray-500 uppercase">Projects Used</span>
                    </div>
                </div>
                <button onClick={() => setUpgradeModalOpen(true)} className="w-full mt-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 transition-opacity text-white text-xs font-bold py-2 rounded-lg shadow-lg shadow-violet-500/20 uppercase tracking-wide">
                    Upgrade Plan
                </button>
            </div>
        </div>
    );
};

export default DashboardStats;
