"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Cloud, Send, User, Bot, Sparkles,
  Terminal, Server, Layout, Zap,
  Tags, BarChart3, MessageSquare, FileText,
  ChevronRight, Github, Info, Database, BookOpen,
  Code, ArrowRight, Cpu, Workflow
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  metadata?: any;
  type?: "chat" | "extract" | "analyze" | "sladocs";
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
  { icon: <Zap className="text-green-400" />, name: "CI/CD", desc: "GitHub Actions → EC2" },
];

// Backend processing info for each mode
const ENDPOINT_INFO: Record<string, {
  endpoint: string;
  method: string;
  agent: string;
  steps: string[];
  pydanticSchema: string;
}> = {
  chat: {
    endpoint: "/chat",
    method: "POST",
    agent: "Weather Chat Agent",
    steps: [
      "Parse user input",
      "LangGraph ReAct agent processes query",
      "Tool call: get_weather() if location detected",
      "LLM generates punny response",
      "Pydantic validates output schema"
    ],
    pydanticSchema: "ChatResponse { punny_response: str, weather_conditions: WeatherData | null }"
  },
  extract: {
    endpoint: "/extract",
    method: "POST",
    agent: "Entity Extraction Agent",
    steps: [
      "Parse user input text",
      "NER prompt sent to LLM",
      "Extract entities (Person, Place, Tech)",
      "Generate summary of entities",
      "Return structured entity list"
    ],
    pydanticSchema: "ExtractionResponse { entities: List[Entity], summary: str }"
  },
  analyze: {
    endpoint: "/analyze",
    method: "POST",
    agent: "Sentiment Analysis Agent",
    steps: [
      "Parse user input text",
      "Sentiment analysis prompt to LLM",
      "Classify: Positive/Negative/Neutral",
      "Calculate confidence score",
      "Generate reasoning explanation"
    ],
    pydanticSchema: "SentimentResponse { sentiment: str, score: float, reasoning: str }"
  },
  sladocs: {
    endpoint: "/sladocs",
    method: "POST",
    agent: "RAG Document Agent",
    steps: [
      "Convert query to vector embedding",
      "Similarity search in PGVector (k=3)",
      "Retrieve relevant document chunks",
      "Inject context into LLM prompt",
      "Generate grounded answer with sources"
    ],
    pydanticSchema: "RAGResponse { answer: str, sources: List[str] }"
  }
};

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
  const [mode, setMode] = useState<"chat" | "extract" | "analyze" | "sladocs">("chat");
  const [showBackend, setShowBackend] = useState(true);
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const endpoint = `${apiUrl}/${mode}`;
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

  const currentEndpoint = ENDPOINT_INFO[mode];

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#0a0a0c] text-white overflow-hidden">

      {/* --- Glassmorphism Left Sidebar --- */}
      <aside className="hidden lg:flex flex-col w-72 flex-shrink-0 bg-white/[0.02] backdrop-blur-xl border-r border-white/5 p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2.5 bg-gradient-to-br from-indigo-500/30 to-purple-600/30 rounded-xl border border-indigo-500/30">
            <Sparkles size={22} className="text-indigo-400" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight">Cloudnova</span>
            <div className="text-[8px] uppercase tracking-[.25em] text-white/30">Multi-Agent Hub</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-[.25em] text-white/30">Front-to-Back Architecture</span>
          </div>
          <div className="space-y-2">
            {STACK_ITEMS.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="group flex items-center gap-3 p-2.5 hover:bg-white/[0.03] rounded-xl transition-colors duration-200 cursor-default"
              >
                <div className="p-2 bg-white/5 rounded-lg">{item.icon}</div>
                <div>
                  <div className="text-sm font-medium text-white/90">{item.name}</div>
                  <div className="text-[10px] text-white/30">{item.desc}</div>
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
          <Link
            href="/walkthrough"
            className="flex items-center justify-between w-full p-3 bg-emerald-600/20 rounded-xl text-xs font-medium hover:bg-emerald-600/30 border border-emerald-500/30 transition-all group"
          >
            <span className="flex items-center gap-2">
              <BookOpen size={14} className="text-emerald-400" /> Project Walkthrough
            </span>
            <ChevronRight size={14} className="text-white/20 group-hover:text-white" />
          </Link>
          <a
            href="https://github.com/zith008/langchain-stack-project"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full p-3 bg-white/5 rounded-xl text-xs font-medium hover:bg-white/10 transition-all group"
          >
            <span className="flex items-center gap-2">
              <Github size={14} /> Repository
            </span>
            <ChevronRight size={14} className="text-white/20 group-hover:text-white" />
          </a>
        </div>
      </aside>

      {/* --- Main Chat Interface --- */}
      <main className="flex-1 flex flex-col relative">
        {/* Top Navbar */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 bg-white/[0.01] backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold lg:hidden">Cloudnova</h1>
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">Production Ready API</span>
            </div>
            {/* Endpoint Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/30">
              <Code size={12} className="text-amber-400" />
              <span className="text-[10px] font-mono font-bold text-amber-400">{currentEndpoint.method} {currentEndpoint.endpoint}</span>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
            {[
              { id: "chat", icon: <MessageSquare size={14} />, label: "Weather Chat" },
              { id: "extract", icon: <Tags size={14} />, label: "Extraction" },
              { id: "analyze", icon: <BarChart3 size={14} />, label: "Sentiment" },
              { id: "sladocs", icon: <FileText size={14} />, label: "Document Q&A" }
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

          {/* Toggle Backend View */}
          <button
            onClick={() => setShowBackend(!showBackend)}
            className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${showBackend ? "bg-purple-600/20 text-purple-400 border border-purple-500/30" : "bg-white/5 text-white/40"}`}
          >
            <Cpu size={14} /> Under the Hood
          </button>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Area */}
          <div ref={scrollRef} className={`flex-1 overflow-y-auto p-6 space-y-6 ${showBackend ? 'lg:w-2/3' : 'w-full'}`}>
            <AnimatePresence mode="popLayout">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  layout
                  className="flex gap-4"
                >
                  <div className={`p-2 rounded-xl ${m.role === "user" ? "bg-indigo-600/20 border border-indigo-500/30" : "bg-white/5 border border-white/10"} h-fit`}>
                    {m.role === "user" ? <User size={18} className="text-indigo-400" /> : <Bot size={18} className="text-white/60" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* Role Label with Endpoint */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[9px] uppercase tracking-[.3em] text-white/30 font-bold">
                        {m.role === "user" ? "You" : currentEndpoint.agent}
                      </span>
                      {m.role === "assistant" && m.type && (
                        <span className="text-[8px] font-mono px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded border border-amber-500/20">
                          {ENDPOINT_INFO[m.type].endpoint}
                        </span>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className={`p-5 rounded-2xl ${m.role === "user" ? "bg-indigo-600/10 border border-indigo-500/30" : "bg-white/[0.03] border border-white/10"
                        } backdrop-blur-3xl`}>
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
                <div className="space-y-2">
                  <div className="h-4 w-48 bg-white/5 animate-pulse rounded-lg"></div>
                  <div className="h-10 w-64 bg-white/5 animate-pulse rounded-2xl border border-white/10"></div>
                </div>
              </div>
            )}
          </div>

          {/* Under the Hood Panel */}
          {showBackend && (
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:block w-1/3 border-l border-white/5 bg-white/[0.01] p-6 overflow-y-auto"
            >
              <div className="mb-6">
                <h3 className="text-sm font-bold flex items-center gap-2 mb-1">
                  <Cpu size={16} className="text-purple-400" /> Under the Hood
                </h3>
                <p className="text-[10px] text-white/40">What happens when you send a message</p>
              </div>

              {/* Current Endpoint Info */}
              <div className="mb-6 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Terminal size={14} className="text-amber-400" />
                  <span className="text-xs font-bold text-amber-400">Active Endpoint</span>
                </div>
                <code className="text-sm font-mono text-white/80 block mb-2">
                  {currentEndpoint.method} /api{currentEndpoint.endpoint}
                </code>
                <span className="text-[10px] text-white/50">Agent: {currentEndpoint.agent}</span>
              </div>

              {/* Processing Steps */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Workflow size={14} className="text-indigo-400" />
                  <span className="text-xs font-bold text-white">Processing Pipeline</span>
                </div>
                <div className="space-y-2">
                  {currentEndpoint.steps.map((step, i) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                        <span className="text-[9px] font-bold text-indigo-400">{i + 1}</span>
                      </div>
                      <span className="text-xs text-white/70 leading-relaxed">{step}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Pydantic Schema */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Code size={14} className="text-teal-400" />
                  <span className="text-xs font-bold text-white">Pydantic Output Schema</span>
                </div>
                <div className="p-3 bg-black/30 rounded-lg border border-white/5">
                  <code className="text-[10px] font-mono text-teal-300 break-all">
                    {currentEndpoint.pydanticSchema}
                  </code>
                </div>
              </div>

              {/* Tech Stack Used */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Server size={14} className="text-emerald-400" />
                  <span className="text-xs font-bold text-white">Stack in Action</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["FastAPI", "LangChain", "AWS Bedrock", "Pydantic", mode === "sladocs" ? "PGVector" : "Guardrails"].map(tech => (
                    <span key={tech} className="text-[9px] px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-white/60">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.aside>
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
              <p className="text-[9px] text-white/20 font-medium tracking-[.3em] uppercase transition-colors group-hover:text-white/40">Powered by LangChain Agents & Pydantic Schemas</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
