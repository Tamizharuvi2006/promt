import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

const UserDropdown = ({ session, profile }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    // Get display name and avatar (fallback to email initial)
    const email = session?.user?.email || '';
    const displayName = profile?.full_name || email.split('@')[0] || 'User';
    const avatarUrl = profile?.avatar_url;
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
            >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 p-[1px]">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xs font-bold text-white font-mono">{initial}</span>
                        )}
                    </div>
                </div>

                {/* Name */}
                <span className="hidden md:inline text-sm font-medium text-gray-300 group-hover:text-white transition-colors max-w-[100px] truncate">
                    {displayName}
                </span>

                {/* Arrow Icon */}
                <svg
                    className={`hidden md:block w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#0f0f0f] border border-white/10 rounded-xl shadow-2xl py-2 z-50 transform origin-top-right transition-all">
                    <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-1">Signed in as</p>
                        <p className="text-sm text-white font-medium truncate">{email}</p>
                        <div className="mt-2 flex items-center gap-2">
                            <div className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${profile?.tier === 'PRO' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                profile?.tier === 'PLUS' ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' :
                                    profile?.tier === 'DEVELOPER' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                        'bg-white/5 text-gray-400 border-white/5'
                                }`}>
                                {profile?.tier || 'FREE'}
                            </div>
                            <span className="text-[10px] font-mono text-gray-600 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                                {profile?.custom_id || 'ID...'}
                            </span>
                        </div>
                    </div>

                    <div className="py-2">
                        <Link to="/dashboard" className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                            Dashboard
                        </Link>
                        <Link to="/profile" className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            Profile
                        </Link>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            Settings
                        </button>
                    </div>

                    <div className="border-t border-white/5 pt-2">
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            Log Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;
