import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Sidebar from '../components/Sidebar';
import { RiCpuLine, RiSendPlane2Fill, RiCodeBoxLine, RiRobot2Line, RiUser3Line } from 'react-icons/ri';
import UserDropdown from '../components/UserDropdown';
import { sendMessageToOpenRouter } from '../services/aiService';
import Seo from '../components/Seo';

const ProjectChat = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const [sidebarProjects, setSidebarProjects] = useState([]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const fetchProjectAndUser = async () => {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                navigate('/');
                return;
            }
            setUser(user);

            // Fetch Profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            setProfile(profileData);

            // Fetch Sidebar Projects
            const { data: projects } = await supabase
                .from('projects')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            if (projects) setSidebarProjects(projects);

            // Fetch Current Project
            const { data: projectData, error } = await supabase
                .from('projects')
                .select('*')
                .eq('id', id)
                .eq('user_id', user.id)
                .single();

            if (error || !projectData) {
                navigate('/dashboard');
                return;
            }

            setProject(projectData);

            // Fetch Chat History
            await fetchChatHistory(projectData.id, projectData.description);
            setLoading(false);
        };

        fetchProjectAndUser();
    }, [id, navigate]);

    const fetchChatHistory = async (projectId, projectDescription) => {
        const { data: history, error } = await supabase
            .from('project_chat_history')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching chat history:', error);
            return;
        }

        // Initialize with Blueprint and a clarifying question if empty
        if ((!history || history.length === 0) && projectDescription) {
            const initialSystem = {
                project_id: projectId,
                role: 'system',
                content: `PROJECT BLUEPRINT CONTEXT:\n\n${projectDescription}\n\n[SYSTEM: Initialize context based on this blueprint.]`
            };

            const initialAssistant = {
                project_id: projectId,
                role: 'assistant',
                content: 'Before I craft the full prompt, what is the most critical outcome and how many pages do you want (home, listing, detail, cart/checkout, about/contact, auth, error)? Any must-have components or data sources to include? Say "send prompt" when ready.'
            };

            await supabase.from('project_chat_history').insert([initialSystem, initialAssistant]);

            setMessages([initialSystem, initialAssistant]);
        } else {
            setMessages(history || []);
        }
    };
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || !user || !project || sending) return;

        // Credit Check
        if ((profile?.credits || 0) < 20) {
            alert("Insufficient credits! You need 20 credits to send a prompt.");
            return;
        }

        const userMsgContent = inputMessage.trim();
        setInputMessage('');
        setSending(true);

        // 1. Optimistic UI Update
        const tempUserMsg = { role: 'user', content: userMsgContent, created_at: new Date().toISOString() };
        setMessages(prev => [...prev, tempUserMsg]);

        try {
            // 2. Save User Message to DB
            const { error: sendError } = await supabase
                .from('project_chat_history')
                .insert([{
                    project_id: project.id,
                    role: 'user',
                    content: userMsgContent
                }]);

            if (sendError) throw sendError;

            // 3. Deduct Credits
            const { error: creditError } = await supabase
                .from('profiles')
                .update({ credits: (profile.credits - 20) })
                .eq('id', user.id);

            if (creditError) {
                console.error("Credit deduction failed:", creditError);
            } else {
                setProfile(prev => ({ ...prev, credits: prev.credits - 20 }));
            }

            // 4. AI Response (OpenRouter API)
            const historyForAi = [...messages, tempUserMsg];
            const aiResponseContent = await sendMessageToOpenRouter(historyForAi, project);

            // 5. Save AI Response to DB
            const { data: aiMsgData, error: responseError } = await supabase
                .from('project_chat_history')
                .insert([{
                    project_id: project.id,
                    role: 'assistant',
                    content: aiResponseContent
                }])
                .select()
                .single();

            if (responseError) throw responseError;

            // 6. Update UI
            setMessages(prev => [...prev, aiMsgData]);

        } catch (err) {
            console.error('AI Interaction Error:', err);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "⚠️ I encountered an error. Please check your API key and try again.",
                created_at: new Date().toISOString()
            }]);
        } finally {
            setSending(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // Optional: Show a toast
    };

    if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white font-mono">LOADING_PROJECT...</div>;

    return (
        <div className="min-h-screen bg-[#0a0a0a] font-sans selection:bg-violet-500/30 flex overflow-hidden">
            <Seo
                title={project?.name ? `${project.name} | PromptVibely Prompt Chat` : 'PromptVibely Prompt Chat'}
                description={project?.name ? `Chat, iterate, and ship prompts for ${project.name} in PromptVibely.` : 'Chat, iterate, and ship prompts in PromptVibely.'}
                keywords="promptvibely prompt chat, prompt builder, project chat, ai prompt iteration"
            />

            {/* Sidebar */}
            <Sidebar activePage="dashboard" projects={sidebarProjects} />

            {/* Chat Interface */}
            <main className="flex-1 flex flex-col min-h-screen relative bg-[#0f0f0f]">

                {/* Header (Same as before) */}
                <header className="h-16 border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-sm flex items-center justify-between px-6 z-20">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                            <RiCodeBoxLine />
                        </div>
                        <div>
                            <h1 className="text-sm font-bold text-white leading-none mb-1">{project?.name}</h1>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-[10px] text-gray-500 font-mono">ONLINE</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-full">
                            <RiCpuLine className="text-fuchsia-400 w-3.5 h-3.5" />
                            <span className="text-xs font-bold text-fuchsia-100">
                                {profile?.credits || 0} <span className="text-fuchsia-500/50 font-normal">Credits</span>
                            </span>
                        </div>
                        <div className="h-4 w-px bg-white/10"></div>
                        <UserDropdown session={{ user: user }} profile={profile} />
                    </div>
                </header>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto px-3 py-4 sm:p-6 space-y-4 scroll-smooth bg-[#0f0f0f]">
                    {messages.map((msg, index) => (
                        <div key={msg.id || index} className={`flex gap-2 sm:gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in duration-200 group`}>
                            
                            {/* Avatar */}
                            <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs ${msg.role === 'user' ? 'bg-violet-600 text-white' : (msg.role === 'system' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400')}`}>
                                {msg.role === 'user' ? <RiUser3Line /> : (msg.role === 'system' ? <RiCodeBoxLine /> : <RiRobot2Line />)}
                            </div>

                            {/* Bubble */}
                            <div className={`relative min-w-0 max-w-[calc(100%-2.5rem)] sm:max-w-[80%] rounded-2xl p-3 sm:p-4 shadow-md overflow-hidden ${msg.role === 'user'
                                ? 'bg-violet-600 text-white rounded-tr-sm'
                                : (msg.role === 'system'
                                    ? 'bg-blue-500/5 border border-blue-500/20 text-blue-200'
                                    : 'bg-[#1a1a1a] border border-white/5 text-gray-200 rounded-tl-sm')
                                }`}>

                                {msg.role === 'system' && (
                                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-blue-500/10">
                                        <RiCodeBoxLine className="text-blue-400 text-xs" />
                                        <span className="text-[9px] font-bold text-blue-400 uppercase">Context</span>
                                    </div>
                                )}

                                <div className="text-[11px] sm:text-xs leading-relaxed whitespace-pre-wrap break-all overflow-hidden" style={{wordBreak: 'break-all', overflowWrap: 'anywhere'}}>
                                    {msg.content}
                                </div>

                                {/* Copy for assistant */}
                                {msg.role === 'assistant' && (
                                    <button
                                        onClick={() => copyToClipboard(msg.content)}
                                        className="mt-2 pt-2 border-t border-white/5 w-full text-left text-[9px] text-gray-500 hover:text-white transition-colors uppercase tracking-wide"
                                    >
                                        Copy response
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {sending && (
                        <div className="flex gap-2 sm:gap-3">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs"><RiRobot2Line /></div>
                            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl rounded-tl-sm p-3 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 sm:p-4 bg-[#0a0a0a]/95 backdrop-blur-sm border-t border-white/5 safe-area-bottom">
                    <form onSubmit={handleSendMessage} className="relative max-w-3xl mx-auto flex gap-2">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder={sending ? "Generating..." : "Ask AI..."}
                            disabled={sending}
                            className="flex-1 min-w-0 bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-violet-500/50 focus:outline-none placeholder-gray-500 transition-all disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={!inputMessage.trim() || sending}
                            className="flex-shrink-0 w-11 h-11 bg-violet-600 rounded-xl text-white flex items-center justify-center hover:bg-violet-500 disabled:opacity-50 transition-colors"
                        >
                            <RiSendPlane2Fill className="w-5 h-5" />
                        </button>
                    </form>
                    <p className="text-center mt-2 text-[9px] text-gray-600">AI may make mistakes</p>
                </div>

            </main>
        </div>
    );
};

export default ProjectChat;
