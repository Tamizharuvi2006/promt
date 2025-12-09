import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiHome5Line, RiDashboardLine, RiCpuLine, RiSettings4Line, RiLogoutBoxRLine, RiCodeBoxLine, RiAddLine } from 'react-icons/ri';
import { supabase } from '../supabaseClient';
import logo from '../assets/logo.webp';

const Sidebar = ({ activePage = 'dashboard', projects: propProjects }) => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        if (propProjects) {
            setProjects(propProjects);
        } else {
            fetchProjects();
        }
    }, [propProjects]);

    const fetchProjects = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data } = await supabase
            .from('projects')
            .select('id, name')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });

        if (data) setProjects(data);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    return (
        <aside className="w-64 bg-black/40 border-r border-white/5 flex flex-col hidden md:flex h-screen sticky top-0">
            <div className="p-6">
                <Link to="/" className="flex items-center gap-2 mb-8">
                    <img src={logo} alt="Prompt AI Logo" className="h-10 w-auto" />
                    <span className="text-[16px] font-bold font-mono text-white">
                        PROMPT_AI<span className="text-violet-500">.SYS</span>
                    </span>
                </Link>

                <nav className="space-y-1">
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                        <RiHome5Line className="w-5 h-5" />
                        <span className="text-sm font-medium">Home</span>
                    </Link>

                    <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activePage === 'dashboard' ? 'bg-violet-500/10 border border-violet-500/20 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <RiDashboardLine className={`w-5 h-5 ${activePage === 'dashboard' ? 'text-violet-400' : ''}`} />
                        <span className="text-sm font-medium">Dashboard</span>
                    </Link>

                    {/* Persistent Projects Section */}
                    <div className="pt-4 pb-2">
                        <div className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Your Projects
                        </div>
                        <div className="max-h-[calc(100vh-300px)] overflow-y-auto space-y-0.5 custom-scrollbar">
                            {projects.length > 0 ? (
                                projects.map(project => (
                                    <Link
                                        key={project.id}
                                        to={`/project/${project.id}`}
                                        className="flex items-center gap-3 px-4 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors group"
                                    >
                                        <RiCodeBoxLine className="w-3.5 h-3.5 flex-shrink-0 text-gray-600 group-hover:text-violet-400 transition-colors" />
                                        <span className="truncate">{project.name}</span>
                                    </Link>
                                ))
                            ) : (
                                <div className="px-4 py-2 text-xs text-gray-600 italic">No projects yet</div>
                            )}
                        </div>
                    </div>

                    <Link to="/profile" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activePage === 'profile' ? 'bg-violet-500/10 border border-violet-500/20 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <RiCpuLine className={`w-5 h-5 ${activePage === 'profile' ? 'text-violet-400' : ''}`} />
                        <span className="text-sm font-medium">Profile</span>
                    </Link>

                    <Link to="/#pricing" className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left">
                        <RiSettings4Line className="w-5 h-5" />
                        <span className="text-sm font-medium">Upgrade Plan</span>
                    </Link>
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-white/5">
                <button onClick={handleLogout} className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors text-sm">
                    <RiLogoutBoxRLine className="w-5 h-5" />
                    <span>Log Out</span>
                </button>
                <div className="mt-6 text-[10px] text-gray-600 font-mono">
                    v0.0.1 STABLE
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
