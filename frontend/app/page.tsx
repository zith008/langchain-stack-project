"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cloud, Send, User, Bot, Sparkles,
  Terminal, Server, Layout, Zap,
  Tags, BarChart3, MessageSquare, FileText,
  ChevronRight, Github, Info, Database
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  metadata?: any;
  type?: "chat" | "extract" | "analyze" | "resume";
}

const STACK_ITEMS = [
  { icon: <Layout className="text-blue-400" />, name: "Next.js 15", desc: "React Framework (App Router)" },
  { icon: <Zap className="text-yellow-400" />, name: "Tailwind v4", desc: "Modern CSS Styling" },
  { icon: <Sparkles className="text-purple-400" />, name: "Framer Motion", desc: "Smooth UI Animations" },
  { icon: <Terminal className="text-cyan-400" />, name: "FastAPI", desc: "Python REST Backend" },
  { icon: <Server className="text-emerald-400" />, name: "AWS Bedrock", desc: "Llama 3.2 11B (Meta)" },
  { icon: <Bot className="text-orange-400" />, name: "LangChain", desc: "Agent-based Framework" },
  { icon: <Database className="text-pink-400" />, name: "PGVector", desc: "Vector Store (PostgreSQL)" },
  { icon: <Bot className="text-red-400" />, name: "Guardrails", desc: "AWS Content Safety" },
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Welcome! This is a multi-agent playground. Choose an agent below and let's test the stack.",
      type: "chat"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"chat" | "extract" | "analyze" | "resume">("chat");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage, type: mode }]);
    setIsLoading(true);

    try {
      const endpoint = `http://127.0.0.1:8000/${mode}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          thread_id: "demo-session",
          user_id: "1",
        }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: mode === "chat" ? data.punny_response : (mode === "extract" ? data.summary : (mode === "analyze" ? `Analysis: ${data.sentiment} (${(data.score * 100).toFixed(0)}%)` : data.answer)),
          metadata: data,
          type: mode
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Connection error. Is the FastAPI server running?",
          type: mode
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#0a0a0c] text-white overflow-hidden">

      {/* --- Sidebar (Tech Stack Showcase) --- */}
      <aside className="w-full lg:w-80 border-r border-white/5 bg-white/[0.02] p-6 hidden lg:flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Zap size={24} />
          </div>
          <h2 className="text-xl font-bold tracking-tight">TechStack</h2>
        </div>

        <div className="space-y-6 flex-1">
          <p className="text-xs font-semibold text-white/30 uppercase tracking-[0.2em]">Front-to-Back Architecture</p>
          <div className="space-y-4">
            {STACK_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 group cursor-default"
              >
                <div className="p-2 bg-white/5 rounded-xl border border-white/5 group-hover:border-white/20 transition-colors">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{item.name}</h3>
                  <p className="text-[10px] text-white/40">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 space-y-3">
          <a
            href="https://drive.google.com/file/d/1RZR7U0wjsZacj8ApZzYC3bRnTbqX_oUl/view"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full p-3 bg-indigo-600/20 rounded-xl text-xs font-medium hover:bg-indigo-600/30 border border-indigo-500/30 transition-all group"
          >
            <span className="flex items-center gap-2">
              <FileText size={14} className="text-indigo-400" /> View SLA Document
            </span>
            <ChevronRight size={14} className="text-white/20 group-hover:text-white" />
          </a>
          <button className="flex items-center justify-between w-full p-3 bg-white/5 rounded-xl text-xs font-medium hover:bg-white/10 transition-all group">
            <span className="flex items-center gap-2">
              <Github size={14} /> Repository
            </span>
            <ChevronRight size={14} className="text-white/20 group-hover:text-white" />
          </button>
        </div>
      </aside>

      {/* --- Main Chat Interface --- */}
      <main className="flex-1 flex flex-col relative">
        {/* Top Navbar */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 bg-white/[0.01] backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold lg:hidden">WeatherVibe</h1>
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">Production Ready API</span>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
            {[
              { id: "chat", icon: <MessageSquare size={14} />, label: "Weather Chat" },
              { id: "extract", icon: <Tags size={14} />, label: "Extraction" },
              { id: "analyze", icon: <BarChart3 size={14} />, label: "Sentiment" },
              { id: "resume", icon: <FileText size={14} />, label: "Document Q&A" }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setMode(btn.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${mode === btn.id ? "bg-indigo-600 text-white shadow-lg" : "text-white/40 hover:text-white"
                  }`}
              >
                {btn.icon} <span className="hidden sm:inline">{btn.label}</span>
              </button>
            ))}
          </div>
        </header>

        {/* Chat Area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth"
        >
          <AnimatePresence>
            {messages.map((m, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-4 max-w-[90%] lg:max-w-[70%] ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`mt-1 p-2 rounded-xl h-fit border ${m.role === "user" ? "bg-indigo-600 border-indigo-400" : "bg-white/5 border-white/10"
                    }`}>
                    {m.role === "user" ? <User size={18} /> : <Bot size={18} />}
                  </div>

                  <div className="space-y-3">
                    <div className={`p-5 rounded-2xl ${m.role === "user" ? "bg-indigo-600/10 border border-indigo-500/30" : "bg-white/[0.03] border border-white/10"
                      } backdrop-blur-3xl`}>
                      <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold mb-2 block">
                        {m.role === "user" ? "User Query" : `${m.type === "resume" ? "SLA" : m.type?.toUpperCase()} AGENT RESPONSE`}
                      </span>
                      <p className="text-sm leading-relaxed text-white/90 whitespace-pre-wrap">{m.content}</p>
                    </div>

                    {/* Meta Data Visualization */}
                    {m.metadata && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                      >
                        {m.type === "chat" && m.metadata.weather_conditions && (
                          <div className="px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-2">
                            <Cloud size={14} className="text-amber-500" />
                            <span className="text-[10px] font-bold text-amber-500">
                              CONDITION: {typeof m.metadata.weather_conditions === 'object'
                                ? (m.metadata.weather_conditions.conditions || JSON.stringify(m.metadata.weather_conditions))
                                : m.metadata.weather_conditions}
                            </span>
                          </div>
                        )}
                        {m.type === "extract" && m.metadata.entities?.map((e: any, i: number) => (
                          <div key={i} className="px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-between">
                            <span className="text-[10px] font-bold text-blue-400">{e.name}</span>
                            <span className="text-[9px] px-1.5 py-0.5 bg-blue-500/20 rounded uppercase text-blue-300">{e.type}</span>
                          </div>
                        ))}
                        {m.type === "analyze" && (
                          <div className="px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl col-span-full">
                            <span className="text-[10px] font-bold text-emerald-400 block mb-1">REASONING:</span>
                            <p className="text-[10px] text-emerald-200/70 italic leading-snug">{m.metadata.reasoning}</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <div className="flex gap-4">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 h-fit">
                <Sparkles className="animate-spin text-indigo-400" size={18} />
              </div>
              <div className="h-10 w-24 bg-white/5 animate-pulse rounded-2xl border border-white/10"></div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c] to-transparent">
          <form onSubmit={handleSubmit} className="relative group max-w-4xl mx-auto w-full">
            <div className="absolute inset-0 bg-indigo-500/20 blur-2xl group-focus-within:bg-indigo-500/40 transition-all rounded-full"></div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === "chat" ? "Ask about weather..." :
                  mode === "extract" ? "Paste text to extract entities..." :
                    mode === "analyze" ? "Paste text for sentiment analysis..." :
                      "Ask about our SLA, uptime guarantees, or support tiers..."
              }
              className="w-full h-16 bg-white/[0.05] border border-white/10 rounded-2xl px-6 pr-16 focus:outline-none focus:border-indigo-500/50 backdrop-blur-xl transition-all relative z-10 text-sm"
            />
            <button
              disabled={isLoading || !input.trim()}
              className="absolute right-3 top-3 h-10 w-10 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:bg-white/5 rounded-xl transition-all flex items-center justify-center z-20 shadow-xl"
            >
              <Send size={18} className="text-white" />
            </button>
          </form>
          <div className="text-center mt-4">
            <div className="inline-flex items-center gap-2 group cursor-help p-1">
              <Info size={10} className="text-white/20 group-hover:text-white/40 transition-colors" />
              <p className="text-[9px] text-white/20 font-medium tracking-[.3em] uppercase transition-colors group-hover:text-white/40">Powered by LangChain Agents & Structural Outputs</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
