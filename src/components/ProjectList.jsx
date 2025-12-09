import React, { useRef, useEffect } from 'react';
import { RiCodeBoxLine, RiMore2Fill, RiEyeLine, RiEditLine, RiDeleteBinLine, RiPlayCircleLine } from 'react-icons/ri';

const ProjectList = ({
    projects,
    activeMenuId,
    setActiveMenuId,
    setPreviewProject,
    setEditingProject,
    handleDeleteProject,
    handleOpenProject
}) => {
    const menuRef = useRef(null);

    // Click outside handler for dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setActiveMenuId]);

    return (
        <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden pb-12">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <h3 className="font-bold text-white">Your Projects</h3>
                <span className="text-xs text-gray-500 hover:text-white cursor-pointer transition-colors">View all</span>
            </div>

            <div className="p-6">
                {projects.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 text-sm">
                        No projects yet. Create one to get started!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projects.map((project) => (
                            <div key={project.id} className="bg-white/[0.02] border border-white/5 rounded-xl p-5 hover:border-violet-500/30 hover:bg-white/[0.04] transition-all group flex flex-col h-48 relative">

                                {/* Header with Date and Menu */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                                        <RiCodeBoxLine className="w-5 h-5" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-[10px] text-gray-600 font-mono border border-white/5 px-2 py-1 rounded">
                                            {new Date(project.created_at).toLocaleDateString()}
                                        </div>
                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveMenuId(activeMenuId === project.id ? null : project.id);
                                                }}
                                                className="text-gray-500 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
                                            >
                                                <RiMore2Fill />
                                            </button>

                                            {/* Dropdown Menu */}
                                            {activeMenuId === project.id && (
                                                <div ref={menuRef} className="absolute right-0 top-8 w-40 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                                    <button
                                                        onClick={() => {
                                                            setPreviewProject(project);
                                                            setActiveMenuId(null);
                                                        }}
                                                        className="w-full text-left px-4 py-2.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors"
                                                    >
                                                        <RiEyeLine className="text-violet-400" /> Show Preview
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingProject(project);
                                                            setActiveMenuId(null);
                                                        }}
                                                        className="w-full text-left px-4 py-2.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors border-t border-white/5"
                                                    >
                                                        <RiEditLine className="text-blue-400" /> Edit Project
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProject(project.id)}
                                                        className="w-full text-left px-4 py-2.5 text-xs text-gray-300 hover:bg-red-500/10 hover:text-red-400 flex items-center gap-2 transition-colors border-t border-white/5"
                                                    >
                                                        <RiDeleteBinLine className="text-red-500" /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <h4 className="text-white font-bold text-lg mb-1 truncate pr-2">{project.name}</h4>
                                <p className="text-gray-500 text-xs line-clamp-2 mb-4 flex-1">
                                    {project.description.split('\n')[0].replace('APP BLUEPRINT: ', '')}
                                </p>

                                <button onClick={() => handleOpenProject(project.id)} className="w-full py-2 rounded-lg bg-violet-500/10 text-violet-400 hover:bg-violet-500 hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-violet-500/10">
                                    <RiPlayCircleLine className="w-4 h-4" /> Start Building
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectList;
