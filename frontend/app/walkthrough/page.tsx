"use client";

import { motion } from "framer-motion";
import {
    ArrowLeft, Zap, Database, Server, Terminal, Bot, Layout,
    Sparkles, Cloud, GitBranch, Shield, FileText, CheckCircle2, Code
} from "lucide-react";
import Link from "next/link";

const TECH_STACK = [
    { icon: <Layout className="text-blue-400" />, name: "Next.js 15", desc: "React framework with App Router for modern frontend" },
    { icon: <Zap className="text-yellow-400" />, name: "Tailwind CSS v4", desc: "Utility-first CSS for rapid UI development" },
    { icon: <Sparkles className="text-purple-400" />, name: "Framer Motion", desc: "Production-ready animations" },
    { icon: <Terminal className="text-cyan-400" />, name: "FastAPI", desc: "High-performance Python REST API" },
    { icon: <FileText className="text-teal-400" />, name: "Pydantic", desc: "Context engineering & data validation schemas" },
    { icon: <Server className="text-emerald-400" />, name: "AWS Bedrock", desc: "Llama 3.2 11B model for AI inference" },
    { icon: <Bot className="text-orange-400" />, name: "LangChain", desc: "Agent framework with tools and memory" },
    { icon: <Database className="text-pink-400" />, name: "PGVector", desc: "PostgreSQL extension for vector embeddings" },
    { icon: <Shield className="text-red-400" />, name: "AWS Guardrails", desc: "Content safety and PII filtering" },
    { icon: <Cloud className="text-sky-400" />, name: "Docker", desc: "Containerized deployment" },
    { icon: <GitBranch className="text-green-400" />, name: "CI/CD", desc: "GitHub Actions auto-deploy to EC2" },
];

const JOURNEY_STEPS = [
    {
        phase: "Phase 1: Foundation",
        title: "Setting Up the Stack",
        items: [
            "Initialized Next.js 15 with App Router",
            "Set up FastAPI backend with CORS",
            "Configured AWS Bedrock with Llama 3.2 11B",
            "Designed the glassmorphism UI with Tailwind"
        ],
        code: `# FastAPI with CORS middleware
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)`,
        lang: "python"
    },
    {
        phase: "Phase 2: Multi-Agent Architecture",
        title: "Building AI Agents with Pydantic Schemas",
        items: [
            "Defined Pydantic schemas for structured LLM outputs",
            "Created Weather Chat agent with tool calling",
            "Built Entity Extraction agent for NER",
            "Implemented Sentiment Analysis with reasoning"
        ],
        code: `# Pydantic schemas for context engineering
class WeatherData(BaseModel):
    city: str
    conditions: str
    temperature: float

class ChatResponse(BaseModel):
    punny_response: str
    weather_conditions: Optional[WeatherData]

# LangGraph agent with tool binding
chat_agent = create_react_agent(
    model=model.bind_tools([get_weather]),
    tools=[get_weather],
    prompt=CHAT_SYSTEM_PROMPT
)`,
        lang: "python"
    },
    {
        phase: "Phase 3: RAG Integration",
        title: "Document Q&A with Vector Search",
        items: [
            "Set up PostgreSQL with PGVector extension",
            "Created document ingestion with pypdf",
            "Implemented semantic similarity search",
            "Built SLA Document Q&A feature"
        ],
        code: `# Vector store initialization with PGVector
from langchain_postgres import PGVector
from langchain_aws import BedrockEmbeddings

embeddings = BedrockEmbeddings(
    model_id="amazon.titan-embed-text-v2:0",
    region_name="us-east-1"
)

vector_store = PGVector(
    embeddings=embeddings,
    collection_name="sla_vectors",
    connection=DATABASE_URL,
)

# Semantic search for context retrieval
docs = vector_store.similarity_search(query, k=3)
context = "\\n".join([d.page_content for d in docs])`,
        lang: "python"
    },
    {
        phase: "Phase 4: Enterprise Features",
        title: "Production-Ready with Guardrails",
        items: [
            "Added AWS Bedrock Guardrails for content safety",
            "Containerized with Docker Compose",
            "Set up CI/CD with GitHub Actions",
            "Deployed to AWS EC2 with auto-deploy"
        ],
        code: `# AWS Bedrock with Guardrails configuration
from langchain_aws import ChatBedrockConverse

model = ChatBedrockConverse(
    model="us.meta.llama3-2-11b-instruct-v1:0",
    region_name="us-east-1",
    guardrail_config={
        "guardrailIdentifier": os.getenv("BEDROCK_GUARDRAIL_ID"),
        "guardrailVersion": os.getenv("BEDROCK_GUARDRAIL_VERSION"),
    }
)

# GitHub Actions auto-deploy
# .github/workflows/ci.yml
deploy:
  runs-on: ubuntu-latest
  steps:
    - uses: appleboy/ssh-action@v1.0.3
      with:
        host: \${{ secrets.EC2_HOST }}
        script: |
          cd ~/project && docker-compose up -d --build`,
        lang: "yaml"
    }
];

export default function Walkthrough() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px]" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6">
                        <ArrowLeft size={16} /> Back to App
                    </Link>
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                        Project Walkthrough
                    </h1>
                    <p className="text-white/60 text-lg">
                        A technical deep dive into building a production-ready Multi-Agent AI application
                    </p>
                </motion.div>

                {/* Overview */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-16"
                >
                    <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                        <FileText className="text-indigo-400" /> Technical Overview
                    </h2>
                    <div className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-xl">
                        <p className="text-white/80 leading-relaxed mb-4">
                            This project demonstrates enterprise-grade AI engineering patterns:
                        </p>
                        <ul className="space-y-2 text-white/70">
                            <li className="flex items-start gap-2">
                                <CheckCircle2 size={16} className="text-green-400 mt-1 flex-shrink-0" />
                                <span><strong className="text-white">Multi-Agent Architecture</strong> - 4 specialized agents with LangGraph ReAct pattern</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 size={16} className="text-green-400 mt-1 flex-shrink-0" />
                                <span><strong className="text-white">Context Engineering</strong> - Pydantic schemas for structured LLM outputs</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 size={16} className="text-green-400 mt-1 flex-shrink-0" />
                                <span><strong className="text-white">RAG Pipeline</strong> - Vector embeddings with PGVector for semantic search</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 size={16} className="text-green-400 mt-1 flex-shrink-0" />
                                <span><strong className="text-white">AI Safety</strong> - AWS Bedrock Guardrails for content moderation</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 size={16} className="text-green-400 mt-1 flex-shrink-0" />
                                <span><strong className="text-white">DevOps</strong> - Docker containers, CI/CD, cloud deployment</span>
                            </li>
                        </ul>
                    </div>
                </motion.section>

                {/* Tech Stack */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-16"
                >
                    <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                        <Zap className="text-yellow-400" /> Tech Stack
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {TECH_STACK.map((tech, i) => (
                            <motion.div
                                key={tech.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.05 }}
                                className="p-4 bg-white/[0.03] border border-white/10 rounded-xl flex items-center gap-4 hover:bg-white/[0.05] transition-colors"
                            >
                                <div className="p-2 bg-white/5 rounded-lg">{tech.icon}</div>
                                <div>
                                    <h3 className="font-medium text-white">{tech.name}</h3>
                                    <p className="text-sm text-white/50">{tech.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Journey Timeline with Code */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-16"
                >
                    <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                        <Code className="text-green-400" /> Implementation Journey
                    </h2>
                    <div className="space-y-12">
                        {JOURNEY_STEPS.map((step, i) => (
                            <motion.div
                                key={step.phase}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                className="relative pl-8 border-l-2 border-indigo-500/30"
                            >
                                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-indigo-500 border-4 border-[#0a0a0f]" />
                                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{step.phase}</span>
                                <h3 className="text-xl font-semibold mt-1 mb-3">{step.title}</h3>
                                <ul className="space-y-2 mb-4">
                                    {step.items.map((item, j) => (
                                        <li key={j} className="flex items-center gap-2 text-white/70">
                                            <CheckCircle2 size={14} className="text-green-400" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                {/* Code Snippet */}
                                <div className="mt-4 rounded-xl overflow-hidden border border-white/10">
                                    <div className="bg-white/5 px-4 py-2 text-xs text-white/40 font-mono flex items-center gap-2">
                                        <Code size={12} /> {step.lang}
                                    </div>
                                    <pre className="p-4 bg-black/30 text-sm font-mono text-white/80 overflow-x-auto">
                                        <code>{step.code}</code>
                                    </pre>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Architecture */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mb-16"
                >
                    <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                        <Server className="text-emerald-400" /> System Architecture
                    </h2>
                    <div className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-xl font-mono text-sm">
                        <pre className="text-white/80 overflow-x-auto">
                            {`┌─────────────────────────────────────────────────────────┐
│                     AWS EC2 Instance                     │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │   Next.js   │  │   FastAPI    │  │   PostgreSQL    │ │
│  │   Frontend  │──│   Backend    │──│   + PGVector    │ │
│  │   :3000     │  │   :8000      │  │   :5432         │ │
│  └─────────────┘  └──────────────┘  └─────────────────┘ │
│         │                │                              │
│         │                ▼                              │
│         │         ┌──────────────┐                      │
│         │         │ AWS Bedrock  │                      │
│         │         │ Llama 3.2 11B│                      │
│         │         │ + Guardrails │                      │
│         │         └──────────────┘                      │
└─────────────────────────────────────────────────────────┘
              │
              ▼
      ┌──────────────┐
      │GitHub Actions│
      │   CI/CD      │
      └──────────────┘`}
                        </pre>
                    </div>
                </motion.section>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center space-x-4"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-full font-medium transition-colors"
                    >
                        Try the App <Sparkles size={16} />
                    </Link>
                    <a
                        href="https://github.com/zith008/langchain-stack-project"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full font-medium transition-colors"
                    >
                        <GitBranch size={16} /> View Source
                    </a>
                </motion.div>
            </div>
        </div>
    );
}
