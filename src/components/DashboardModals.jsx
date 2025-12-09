import React from 'react';
import { Link } from 'react-router-dom';
import { RiPieChart2Line, RiCloseLine, RiPlayCircleLine, RiEditLine, RiMagicLine } from 'react-icons/ri';
import AuthModal from './AuthModal';

const DashboardModals = ({
    upgradeModalOpen,
    setUpgradeModalOpen,
    previewProject,
    setPreviewProject,
    handleOpenProject,
    editingProject,
    setEditingProject,
    handleUpdateProject,
    showLoginOverlay,
    profile
}) => {
    return (
        <>
            {/* Upgrade Modal */}
            {upgradeModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setUpgradeModalOpen(false)}></div>
                    <div className="relative w-full max-w-md bg-[#0f0f0f] border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
                        <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500 border border-amber-500/20">
                            <RiPieChart2Line className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Upgrade to Create More</h2>
                        <p className="text-gray-400 mb-8">You've reached the project limit for your <strong>{profile?.tier}</strong> plan. Upgrade to PRO to build unlimited apps.</p>
                        <div className="flex flex-col gap-3">
                            <Link to="/#pricing" onClick={() => setUpgradeModalOpen(false)} className="w-full py-3 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold shadow-lg hover:shadow-violet-500/25 transition-all">
                                View Plans
                            </Link>
                            <button onClick={() => setUpgradeModalOpen(false)} className="text-sm text-gray-500 hover:text-white">Maybe Later</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {previewProject && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setPreviewProject(null)}></div>
                    <div className="relative w-full max-w-2xl bg-[#0f0f0f] border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                        <button onClick={() => setPreviewProject(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                            <RiCloseLine className="w-6 h-6" />
                        </button>
                        <h2 className="text-2xl font-bold text-white mb-2 mr-8 truncate">{previewProject.name}</h2>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-xs font-mono text-gray-500 border border-white/10 px-2 py-1 rounded">
                                Created: {new Date(previewProject.created_at).toLocaleDateString()}
                            </span>
                            <span className="text-xs font-mono text-green-500 border border-green-500/20 bg-green-500/5 px-2 py-1 rounded">
                                Active
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-white/5">
                                <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono leading-relaxed">
                                    {previewProject.description}
                                </pre>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button onClick={() => setPreviewProject(null)} className="flex-1 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Close</button>
                            <button onClick={() => handleOpenProject(previewProject.id)} className="flex-1 py-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2">
                                <RiPlayCircleLine className="w-5 h-5" /> Open Project
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Project Modal */}
            {editingProject && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setEditingProject(null)}></div>
                    <div className="relative w-full max-w-lg bg-[#0f0f0f] border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden">
                        <h2 className="text-2xl font-bold text-white mb-6">Edit Project</h2>
                        <form onSubmit={handleUpdateProject} className="space-y-6">
                            <div>
                                <label className="block text-xs font-mono text-gray-500 mb-1.5 uppercase">Project Name</label>
                                <input
                                    type="text"
                                    readOnly
                                    value={editingProject.name}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-gray-400 cursor-not-allowed focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-gray-500 mb-1.5 uppercase">Project Prompt / Description</label>
                                <textarea
                                    required
                                    value={editingProject.description}
                                    onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-violet-500 focus:outline-none min-h-[250px] font-mono text-xs leading-relaxed resize-none"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setEditingProject(null)} className="flex-1 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
                                    Save Changes <RiEditLine />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Login Overlay (Blurred Background) */}
            {showLoginOverlay && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-violet-600/30 animate-bounce">
                            <RiMagicLine className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Login Required</h2>
                        <p className="text-gray-400 mb-8 text-lg">You need to sign in to access your Dashboard.</p>

                        <div className="max-w-md mx-auto bg-[#0a0a0a] border border-white/10 p-1 rounded-2xl box-content">
                            <AuthModal isOpen={true} onClose={() => { }} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DashboardModals;
