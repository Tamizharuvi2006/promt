import React, { useState } from 'react';
import { RiCodeBoxLine, RiServerLine, RiFileTextLine, RiPaletteLine, RiMagicLine, RiStackLine, RiArrowRightLine, RiDraftLine } from 'react-icons/ri';

const ProjectWizard = ({ isOpen, onClose, onCreateProject, error }) => {
    // Internal State for Wizard
    const [wizardStep, setWizardStep] = useState(1); // 1: Name, 2: Description, 3: Tech Stack, 4: Review
    const [newProjectName, setNewProjectName] = useState('');
    const [userDescription, setUserDescription] = useState(''); // Manual user description
    const [newProjectDesc, setNewProjectDesc] = useState(''); // Final blueprint

    // Tech Stack State
    const [selectedFrontend, setSelectedFrontend] = useState('React + Vite');
    const [selectedBackend, setSelectedBackend] = useState('Supabase');
    const [selectedPromptFormat, setSelectedPromptFormat] = useState('JSON');
    const [selectedThemes, setSelectedThemes] = useState(['AI_CHOICE']);
    const [customThemes, setCustomThemes] = useState([]);

    const presets = ['Modern Dark', 'Light Clean', 'Cyberpunk', 'Corporate'];
    const allThemeOptions = [...presets, ...customThemes];

    const resetWizard = () => {
        setWizardStep(1);
        setNewProjectName('');
        setUserDescription('');
        setNewProjectDesc('');
        setSelectedFrontend('React + Vite');
        setSelectedBackend('Supabase');
        setSelectedPromptFormat('JSON');
        setSelectedThemes(['AI_CHOICE']);
        setCustomThemes([]);
        onClose();
    };

    const handleWizardNext = (e) => {
        e.preventDefault();
        if (wizardStep === 1 && newProjectName.trim()) {
            setWizardStep(2);
        } else if (wizardStep === 2 && userDescription.trim()) {
            // After Description, go to Tech Stack or Skip?
            // User requested "after description show it and created".
            // We will still keep Tech Stack but maybe pre-fill or allow confirming.
            // Let's go to Step 3 (Tech Stack) to allow customization, 
            // OR if user wants speed, we could generate now. 
            // Let's stick to standard flow: Name -> Desc -> Tech -> Review.
            setWizardStep(3);
        } else if (wizardStep === 3) {
            const themeText = selectedThemes.map(t => t === 'AI_CHOICE' ? 'AI Choice' : t).join(', ');
            const blueprint = `APP BLUEPRINT: ${newProjectName.toUpperCase()}
=============================================

1. PROJECT DESCRIPTION
----------------------
${userDescription}

2. TECHNOLOGY STACK
-------------------
• Frontend:  ${selectedFrontend}
• Backend:   ${selectedBackend}

3. PROMPT CONFIGURATION
-----------------------
• Format:    ${selectedPromptFormat}

4. DESIGN & THEMING
-------------------
• Palette:   ${themeText}
`;
            setNewProjectDesc(blueprint);
            setWizardStep(4);
        }
    };

    const toggleTheme = (theme) => {
        setSelectedThemes(prev => {
            if (prev.includes(theme)) {
                return prev.filter(t => t !== theme);
            } else {
                if (prev.length >= 4) return prev;
                return [...prev, theme];
            }
        });
    };

    const handleCustomThemeSubmit = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = e.target.value.trim();
            if (value) {
                if (!customThemes.includes(value)) {
                    setCustomThemes([...customThemes, value]);
                }
                setSelectedThemes(prev => {
                    if (prev.length < 4 && !prev.includes(value)) {
                        return [...prev, value];
                    }
                    return prev;
                });
                e.target.value = '';
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreateProject({
            name: newProjectName,
            description: newProjectDesc
        }, resetWizard);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={resetWizard}></div>
            <div className="relative w-full max-w-lg bg-[#0f0f0f] border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden">

                {/* Step 1: Name */}
                {wizardStep === 1 && (
                    <form onSubmit={handleWizardNext} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <h2 className="text-2xl font-bold text-white mb-2">New Project</h2>
                        <p className="text-gray-400 text-sm mb-6">Let's start with a name for your masterpiece.</p>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-mono text-gray-500 mb-1.5 uppercase">Project Name</label>
                                <input
                                    type="text"
                                    autoFocus
                                    required
                                    value={newProjectName}
                                    onChange={e => setNewProjectName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-violet-500 focus:outline-none"
                                    placeholder="e.g. Super SaaS Platform"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={resetWizard} className="flex-1 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 py-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2">
                                    Next Step <RiArrowRightLine />
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {/* Step 2: Description (New Step) */}
                {wizardStep === 2 && (
                    <form onSubmit={handleWizardNext} className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-2xl font-bold text-white mb-2">Describe Your Idea</h2>
                        <p className="text-gray-400 text-sm mb-6">Tell us what you want to build. Be specific!</p>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-mono text-gray-500 mb-1.5 uppercase">Project Prompt / Description</label>
                                <textarea
                                    autoFocus
                                    required
                                    value={userDescription}
                                    onChange={e => setUserDescription(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-violet-500 focus:outline-none min-h-[150px] resize-none leading-relaxed"
                                    placeholder="I want to build a CRM for..."
                                />
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setWizardStep(1)} className="flex-1 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Back</button>
                                <button type="submit" className="flex-1 py-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2">
                                    Next Step <RiArrowRightLine />
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {/* Step 3: Tech Stack Selection */}
                {wizardStep === 3 && (
                    <form onSubmit={handleWizardNext} className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-2xl font-bold text-white mb-2">Configure Stack</h2>
                        <p className="text-gray-400 text-sm mb-6">Choose your tech stack.</p>

                        <div className="space-y-5 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">

                            {/* Frontend */}
                            <div>
                                <label className="block text-xs font-mono text-violet-400 mb-2 uppercase flex items-center gap-2">
                                    <RiCodeBoxLine /> Frontend Framework
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['React + Vite', 'Next.js', 'Angular', 'Vue.js', 'HTML/CSS/JS', 'Flutter', 'React Native'].map(opt => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setSelectedFrontend(opt)}
                                            className={`p-3 rounded-lg text-sm font-medium border text-left transition-all ${selectedFrontend === opt
                                                ? 'bg-violet-600/20 border-violet-500 text-white'
                                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                                }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Backend */}
                            <div>
                                <label className="block text-xs font-mono text-fuchsia-400 mb-2 uppercase flex items-center gap-2">
                                    <RiServerLine /> Backend / DB (Optional)
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['Supabase', 'Firebase', 'Node.js', 'Python', 'Django', 'None'].map(opt => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setSelectedBackend(opt)}
                                            className={`p-3 rounded-lg text-sm font-medium border text-left transition-all ${selectedBackend === opt
                                                ? 'bg-fuchsia-600/20 border-fuchsia-500 text-white'
                                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                                }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Prompt Format */}
                            <div>
                                <label className="block text-xs font-mono text-blue-400 mb-2 uppercase flex items-center gap-2">
                                    <RiFileTextLine /> Prompt Output Format
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Text', 'XML', 'JSON'].map(opt => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setSelectedPromptFormat(opt)}
                                            className={`p-3 rounded-lg text-sm font-medium border relative overflow-hidden transition-all ${selectedPromptFormat === opt
                                                ? 'bg-blue-600/20 border-blue-500 text-white'
                                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                                }`}
                                        >
                                            <span className="relative z-10">{opt}</span>
                                            {opt === 'JSON' && (
                                                <span className="absolute top-0 right-0 bg-amber-500 text-black text-[8px] font-bold px-1 rounded-bl">POPULAR</span>
                                            )}
                                            {opt === 'XML' && (
                                                <span className="absolute top-0 right-0 bg-emerald-500 text-black text-[8px] font-bold px-1 rounded-bl">RULES</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Theme */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs font-mono text-emerald-400 uppercase flex items-center gap-2">
                                        <RiPaletteLine /> Color Theme
                                    </label>
                                    <span className="text-[10px] text-gray-500">{selectedThemes.length}/4 Selected</span>
                                </div>

                                <div className="flex gap-3 flex-wrap">
                                    {allThemeOptions.map(opt => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => toggleTheme(opt)}
                                            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all flex items-center gap-2 ${selectedThemes.includes(opt)
                                                ? 'bg-white text-black border-white'
                                                : 'bg-transparent border-white/20 text-gray-400 hover:border-white/50'
                                                }`}
                                            title={opt}
                                        >
                                            {opt}
                                            {customThemes.includes(opt) && (
                                                <span
                                                    className="w-2 h-2 rounded-full border border-black/20"
                                                    style={{ backgroundColor: opt.startsWith('#') || ['red', 'blue', 'green'].some(c => opt.toLowerCase().includes(c)) ? opt : '#ffffff' }}
                                                ></span>
                                            )}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => toggleTheme('AI_CHOICE')}
                                        className={`px-4 py-2 rounded-full text-xs font-bold border flex items-center gap-1 transition-all ${selectedThemes.includes('AI_CHOICE')
                                            ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 border-transparent text-white'
                                            : 'bg-transparent border-white/20 text-gray-400 hover:border-white/50'
                                            }`}
                                    >
                                        <RiMagicLine /> AI Pick
                                    </button>
                                </div>

                                <div className="mt-3 relative group">
                                    <input
                                        type="text"
                                        onKeyDown={handleCustomThemeSubmit}
                                        placeholder="Type color & press ENTER (e.g. #ff0000 or Midnight Blue)"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-violet-500 focus:outline-none placeholder-gray-600 transition-colors focus:bg-white/10"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 pointer-events-none group-focus-within:text-violet-400">
                                        PRESS ENTER ↵
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="flex gap-3 mt-6 pt-4 border-t border-white/5">
                            <button type="button" onClick={() => setWizardStep(2)} className="flex-1 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Back</button>
                            <button type="submit" className="flex-1 py-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2">
                                Generate Blueprint <RiArrowRightLine />
                            </button>
                        </div>
                    </form>
                )}

                {/* Step 4: Review Blueprint */}
                {wizardStep === 4 && (
                    <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-2xl font-bold text-white mb-2">Review Blueprint</h2>
                        <p className="text-gray-400 text-sm mb-6">Here is your custom AI blueprint based on your choices.</p>

                        <div className="bg-[#1a1a1a] rounded-lg p-4 border border-white/5 mb-4 max-h-[300px] overflow-y-auto">
                            <label className="block text-xs font-mono text-violet-400 mb-2 uppercase flex items-center gap-2">
                                <RiStackLine /> Generated Config
                            </label>
                            <textarea
                                value={newProjectDesc}
                                onChange={e => setNewProjectDesc(e.target.value)}
                                className="w-full bg-transparent border-0 text-gray-300 text-xs font-mono focus:ring-0 resize-none h-full min-h-[250px] leading-relaxed tracking-wide"
                                placeholder="Project details..."
                            />
                        </div>

                        {error && <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded">{error}</div>}

                        <div className="flex gap-3">
                            <button type="button" onClick={() => setWizardStep(3)} className="flex-1 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Back</button>
                            <button type="submit" className="flex-1 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 text-white font-bold shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2 transition-all">
                                Launch Project
                            </button>
                        </div>
                    </form>
                )}

            </div>
        </div>
    );
};

export default ProjectWizard;
