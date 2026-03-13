import type { ReactNode } from 'react';
import { Home, Folder, User, Mail, Sun, Moon, ArrowLeft, Github, Linkedin, Twitter } from 'lucide-react';
import { cn } from '../utils';
import type { ProjectData, Tab } from '../App';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
    children: ReactNode;
    isDay: boolean;
    activeProject: ProjectData | null;
    onClearProject: () => void;
    currentTab: Tab;
    setCurrentTab: (t: Tab) => void;
}

export function Layout({ children, isDay, activeProject, onClearProject, currentTab, setCurrentTab }: LayoutProps) {
    return (
        <div className="relative w-full h-full overflow-hidden">
            {/* 3D Canvas Layer */}
            <div className="absolute inset-0 z-0">
                {children}
            </div>

            {/* Glass Navigation */}
            <nav className="absolute top-0 left-0 w-full glass-nav z-30 px-8 py-4 flex justify-between items-center transition-all">
                <div className="text-xl font-bold tracking-wider flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-space-accent to-purple-400 animate-pulse"></div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">DAN.AI</span>
                </div>
                <div className="hidden md:flex gap-8 text-sm font-medium">
                    <button onClick={() => { setCurrentTab('home'); onClearProject(); }} className={cn("transition-colors flex items-center gap-2", currentTab === 'home' ? "text-space-accent" : "text-white/80 hover:text-white")}><Home size={16} /> Home</button>
                    <button onClick={() => { setCurrentTab('projects'); onClearProject(); }} className={cn("transition-colors flex items-center gap-2", currentTab === 'projects' ? "text-space-accent" : "text-white/80 hover:text-white")}><Folder size={16} /> Projects</button>
                    <button onClick={() => setCurrentTab('about')} className={cn("transition-colors flex items-center gap-2", currentTab === 'about' ? "text-space-accent" : "text-white/80 hover:text-white")}><User size={16} /> About</button>
                    <button onClick={() => setCurrentTab('contact')} className={cn("transition-colors flex items-center gap-2", currentTab === 'contact' ? "text-space-accent" : "text-white/80 hover:text-white")}><Mail size={16} /> Contact</button>
                </div>
            </nav>

            {/* Intro Text when no project is active */}
            <AnimatePresence>
                {!activeProject && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-32 left-8 md:left-12 z-10 max-w-md pointer-events-none"
                    >
                        <h1 className="text-5xl font-black mb-4 tracking-tight">Enter the <br /><span className="text-space-accent">Future</span></h1>
                        <p className="text-white/70 text-lg">Click on any orbiting planet to explore my selected works and technological achievements.</p>

                        {(currentTab === 'projects') && <p className="text-white/70 mt-6 animate-pulse">Select a destination node from the local system cluster.</p>}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Glass Project Details Panel */}
            <AnimatePresence>
                {activeProject && (
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }}
                        className="absolute left-8 top-1/2 -translate-y-1/2 w-80 md:w-96 glass-panel p-8 z-10"
                    >
                        <button
                            onClick={onClearProject}
                            className="mb-8 flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-semibold uppercase tracking-wider"
                        >
                            <ArrowLeft size={16} /> Back to Orbit
                        </button>
                        <div
                            className="h-1 w-16 mb-6 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                            style={{ backgroundColor: activeProject.color }}
                        ></div>
                        <h2 className="text-3xl font-bold mb-4 tracking-tight">{activeProject.name}</h2>
                        <p className="text-white/70 text-base mb-8 leading-relaxed">
                            {activeProject.description}
                        </p>
                        <a
                            href={activeProject.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex justify-center w-full py-4 rounded-xl transition-all font-bold text-[15px] shadow-lg hover:scale-105"
                            style={{
                                backgroundColor: activeProject.color,
                                boxShadow: `0 0 20px ${activeProject.color}40`
                            }}
                        >
                            Explore Node
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* About Modal */}
            <AnimatePresence>
                {currentTab === 'about' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute inset-0 flex items-center justify-center z-20 bg-black/60 backdrop-blur-md"
                        onClick={() => setCurrentTab('home')}
                    >
                        <div className="glass-panel p-10 max-w-2xl m-4 relative border border-white/20" onClick={e => e.stopPropagation()}>
                            <h2 className="text-4xl font-bold mb-6 text-white border-b border-white/10 pb-4">Data Log: Dan Usman</h2>
                            <p className="text-lg text-white/80 mb-6 leading-relaxed">
                                I am an AI Prompt Engineer and Vibe Coder specializing in the intersection of generative models and modern web architecture.
                                My work focuses on building autonomous agents, integrating advanced LLMs into production applications, and designing immersive 3D digital experiences.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono text-space-accent">
                                <div className="bg-white/5 p-4 rounded border border-white/10">» Tech Stack: React, Next.js, 3D WebGL</div>
                                <div className="bg-white/5 p-4 rounded border border-white/10">» AI Tools: ElevenLabs, n8n, OpenAI, Anthropic</div>
                                <div className="bg-white/5 p-4 rounded border border-white/10">» Focus: World-class UX & Agentic Workflows</div>
                                <div className="bg-white/5 p-4 rounded border border-white/10">» Level: Senior Engineer / Architect</div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Contact Modal */}
            <AnimatePresence>
                {currentTab === 'contact' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute inset-0 flex items-center justify-center z-20 bg-black/60 backdrop-blur-md"
                        onClick={() => setCurrentTab('home')}
                    >
                        <div className="glass-panel p-10 max-w-md w-full m-4 relative border border-white/20 text-center" onClick={e => e.stopPropagation()}>
                            <h2 className="text-3xl font-bold mb-6 text-white border-b border-white/10 pb-4">Establish Uplink</h2>
                            <p className="text-white/70 mb-8">Ready to collaborate on the next generation of AI applications? Transmit a message to my secure server.</p>
                            <div className="flex flex-col gap-4">
                                <a href="mailto:dan@example.com" className="bg-space-accent/20 hover:bg-space-accent/40 border border-space-accent text-white py-3 rounded-lg flex items-center justify-center gap-3 transition-colors">
                                    <Mail size={20} /> Initialize Email Sequence
                                </a>
                                <div className="flex justify-center gap-6 mt-6">
                                    <a href="#" className="p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors"><Github size={24} className="text-white/80 hover:text-white" /></a>
                                    <a href="#" className="p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors"><Linkedin size={24} className="text-blue-400 hover:text-blue-300" /></a>
                                    <a href="#" className="p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors"><Twitter size={24} className="text-sky-400 hover:text-sky-300" /></a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Day/Night Indicator */}
            <div className="absolute bottom-8 right-8 glass-panel p-4 z-10 flex items-center gap-4">
                <div className={cn("p-2.5 rounded-full shadow-inner", isDay ? "bg-yellow-400/20 text-yellow-300" : "bg-blue-400/20 text-blue-300")}>
                    {isDay ? <Sun size={24} /> : <Moon size={24} />}
                </div>
                <div className="flex flex-col pr-2">
                    <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-0.5">Time Cycle</span>
                    <span className="text-sm font-bold tracking-wide">{isDay ? 'Solar Protocol' : 'Lunar Protocol'}</span>
                </div>
            </div>
        </div>
    );
}
