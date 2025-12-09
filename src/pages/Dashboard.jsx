import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { RiSearchLine, RiNotification3Line, RiAddLine } from 'react-icons/ri';
import UserDropdown from '../components/UserDropdown';
import Sidebar from '../components/Sidebar';
import DashboardStats from '../components/DashboardStats';
import ProjectList from '../components/ProjectList';
import ProjectWizard from '../components/ProjectWizard';
import DashboardModals from '../components/DashboardModals';
import Seo from '../components/Seo';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [user, setUser] = useState(null);

    // Modal States
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
    const [showLoginOverlay, setShowLoginOverlay] = useState(false);
    const [previewProject, setPreviewProject] = useState(null);
    const [editingProject, setEditingProject] = useState(null);
    const [activeMenuId, setActiveMenuId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            setUser(user);

            // Get Profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            setProfile(profileData);

            // Get Projects
            const { data: projectsData } = await supabase
                .from('projects')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (projectsData) setProjects(projectsData);
        } else {
            setShowLoginOverlay(true);
        }
        setLoading(false);
    };

    const handleCreateProject = async (projectData, onSuccess) => {
        const limitMap = { 'FREE': 1, 'PLUS': 5, 'PRO': 20, 'DEVELOPER': 9999 };
        const limit = limitMap[profile?.tier || 'FREE'];

        if (projects.length >= limit) {
            onSuccess(); // Close wizard
            setUpgradeModalOpen(true);
            return;
        }

        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { data, error } = await supabase
                .from('projects')
                .insert([
                    { user_id: user.id, name: projectData.name, description: projectData.description }
                ])
                .select();

            if (error) throw error;

            setProjects([data[0], ...projects]);
            onSuccess(); // Reset wizard
        } catch (err) {
            if (err.message.includes('Project limit reached')) {
                onSuccess();
                setUpgradeModalOpen(true);
            } else {
                alert("Error creating project: " + err.message);
            }
        }
    };

    const handleDeleteProject = async (projectId) => {
        if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', projectId);

            if (!error) {
                setProjects(projects.filter(p => p.id !== projectId));
                setActiveMenuId(null);
            } else {
                alert("Error deleting project: " + error.message);
            }
        }
    };

    const handleUpdateProject = async (e) => {
        e.preventDefault();
        if (!editingProject) return;

        const { error } = await supabase
            .from('projects')
            .update({ name: editingProject.name, description: editingProject.description })
            .eq('id', editingProject.id);

        if (!error) {
            setProjects(projects.map(p => p.id === editingProject.id ? editingProject : p));
            setEditingProject(null);
        } else {
            alert("Error updating project: " + error.message);
        }
    };

    const handleOpenProject = (projectId) => {
        navigate(`/project/${projectId}`);
    };

    if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white font-mono">INITIALIZING_DASHBOARD...</div>;

    const currentLimit = profile?.tier === 'FREE' ? 1 : profile?.tier === 'PLUS' ? 5 : profile?.tier === 'PRO' ? 20 : 9999;
    const usagePercentage = Math.min((projects.length / currentLimit) * 100, 100);

    return (
        <div className="min-h-screen bg-[#0a0a0a] font-sans selection:bg-violet-500/30 flex overflow-hidden">
            <Seo title="Dashboard" description="Manage your AI projects and prompts." />
            <Sidebar activePage="dashboard" projects={projects} />

            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Header */}
                <header className="h-20 border-b border-white/5 bg-black/20 backdrop-blur-sm flex items-center justify-between px-8 relative z-50">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative w-96 hidden md:block">
                            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:border-violet-500/50 focus:outline-none transition-all"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                                <span className="text-[10px] text-gray-500 border border-white/10 px-1 rounded">⌘K</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="text-gray-400 hover:text-white relative">
                            <RiNotification3Line className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-violet-500 rounded-full"></span>
                        </button>
                        <div className="h-6 w-px bg-white/10"></div>
                        <UserDropdown session={{ user: user }} profile={profile} />
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 relative z-0">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                            <p className="text-gray-400">Welcome back! Here's what's happening in your AI workspace.</p>
                        </div>
                        <button
                            onClick={() => setIsWizardOpen(true)}
                            className="bg-white text-black hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            <RiAddLine className="w-5 h-5" />
                            New Project
                        </button>
                    </div>

                    <DashboardStats
                        projects={projects}
                        profile={profile}
                        setUpgradeModalOpen={setUpgradeModalOpen}
                        currentLimit={currentLimit}
                        usagePercentage={usagePercentage}
                    />

                    <ProjectList
                        projects={projects}
                        activeMenuId={activeMenuId}
                        setActiveMenuId={setActiveMenuId}
                        setPreviewProject={setPreviewProject}
                        setEditingProject={setEditingProject}
                        handleDeleteProject={handleDeleteProject}
                        handleOpenProject={handleOpenProject}
                    />
                </div>
            </main>

            <ProjectWizard
                isOpen={isWizardOpen}
                onClose={() => setIsWizardOpen(false)}
                onCreateProject={handleCreateProject}
            />

            <DashboardModals
                upgradeModalOpen={upgradeModalOpen}
                setUpgradeModalOpen={setUpgradeModalOpen}
                previewProject={previewProject}
                setPreviewProject={setPreviewProject}
                handleOpenProject={handleOpenProject}
                editingProject={editingProject}
                setEditingProject={setEditingProject}
                handleUpdateProject={handleUpdateProject}
                showLoginOverlay={showLoginOverlay}
                profile={profile}
            />
        </div>
    );
};

export default Dashboard;
