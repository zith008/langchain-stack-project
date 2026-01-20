# 🤖 Multi-Agent AI Hub

A production-ready AI application showcasing multi-agent architecture with RAG (Retrieval Augmented Generation), AWS Bedrock, and enterprise-grade guardrails.

![Tech Stack](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![AWS](https://img.shields.io/badge/AWS_Bedrock-FF9900?style=flat&logo=amazonaws&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat&logo=nextdotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)

## 🎯 Features

| Agent | Description |
|-------|-------------|
| **Weather Chat** | Punny weather forecaster with tool usage |
| **Entity Extraction** | Extracts entities (person, place, tech) from text |
| **Sentiment Analysis** | Returns sentiment score and reasoning |
| **Document Q&A** | RAG-powered SLA document assistant |

## 🏗️ Tech Stack

### Backend
- **FastAPI** - High-performance Python REST API
- **LangChain** - Agent framework with tools
- **AWS Bedrock** - Llama 3.2 11B model
- **AWS Guardrails** - Content safety & PII filtering
- **PGVector** - Vector store on PostgreSQL 16

### Frontend
- **Next.js 15** - React framework with App Router
- **Tailwind CSS v4** - Modern styling
- **Framer Motion** - Smooth animations

### Infrastructure
- **Docker Compose** - PGVector PostgreSQL container
- **GitHub Actions** - CI/CD pipeline

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- Docker
- AWS Account with Bedrock access

### 1. Clone and Setup
```bash
git clone https://github.com/YOUR_USERNAME/multi-agent-hub.git
cd multi-agent-hub

# Backend
pip install -r requirements.txt

# Frontend
cd frontend && npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Add your AWS credentials and Guardrail ID
```

### 3. Start Services
```bash
# Start PostgreSQL with PGVector
docker-compose up -d

# Ingest SLA document
python ingest_resume.py

# Start backend
python main.py

# Start frontend (new terminal)
cd frontend && npm run dev
```

### 4. Open App
Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── main.py              # FastAPI backend with agents
├── ingest_resume.py     # PDF ingestion for RAG
├── docker-compose.yml   # PGVector PostgreSQL
├── requirements.txt     # Python dependencies
├── frontend/
│   ├── app/page.tsx     # Next.js main page
│   └── ...
└── .github/
    └── workflows/       # CI/CD pipelines
```

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS credentials |
| `AWS_SECRET_ACCESS_KEY` | AWS credentials |
| `AWS_REGION_NAME` | AWS region (us-east-1) |
| `BEDROCK_GUARDRAIL_ID` | Guardrail identifier |
| `DATABASE_URL` | PostgreSQL connection string |

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/chat` | POST | Weather chat agent |
| `/extract` | POST | Entity extraction |
| `/analyze` | POST | Sentiment analysis |
| `/resume` | POST | SLA document Q&A (RAG) |
| `/sla-document` | GET | Download source PDF |

## 🛡️ AWS Bedrock Guardrails

This project uses AWS Bedrock Guardrails for:
- Content filtering (hate, insults, violence)
- PII detection and masking
- Topic restrictions

## 📄 License

MIT License - feel free to use for your own projects!

---

Built with ❤️ showcasing enterprise AI architecture
# Auto-deployed via GitHub Actions
