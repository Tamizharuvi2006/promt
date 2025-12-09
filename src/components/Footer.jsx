import React from 'react';
import { RiInstagramLine, RiGlobalLine, RiCopyrightLine } from 'react-icons/ri';

const Footer = () => {
    return (
        <footer className="relative z-10 bg-black/80 backdrop-blur-xl border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white font-mono tracking-tighter">
                            WEBPROMPT<span className="text-violet-500">.APP</span>
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            The advanced AI Prompt Engineering environment for developers, creators, and prompt architects.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Domains</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><a href="https://webprompt.app" className="hover:text-violet-400 transition-colors">webprompt.app</a></li>
                            <li><a href="https://promptweb.app" className="hover:text-violet-400 transition-colors">promptweb.app</a></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Connect</h4>
                        <a
                            href="https://www.instagram.com/pixcy.dev/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-gray-400 hover:text-pink-500 transition-colors group"
                        >
                            <div className="p-2 rounded-lg bg-white/5 group-hover:bg-pink-500/10 transition-colors">
                                <RiInstagramLine className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium">@pixcy.dev</span>
                        </a>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-600">
                    <div className="flex items-center gap-2">
                        <RiCopyrightLine /> 2025 WEBPROMPT.APP // ALL SYSTEMS OPERATIONAL
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
