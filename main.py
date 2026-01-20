import os
import json
import re
import time
import httpx
from dataclasses import dataclass
from typing import Optional, List, Any
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

from langchain.agents import create_agent
from langchain.tools import tool, ToolRuntime
from langgraph.checkpoint.memory import InMemorySaver

# Load environment variables
load_dotenv()

# --- Helper Function ---

def extract_json_from_content(content: str, default: dict) -> dict:
    """
    Extract JSON object from mixed text content.
    The model often returns text like: "Some preamble... { JSON } more text"
    This function finds and parses the first valid JSON object.
    """
    if not content:
        return default
    
    # Try to find JSON object in the content
    # Look for patterns like { ... }
    json_pattern = r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}'
    matches = re.findall(json_pattern, content, re.DOTALL)
    
    for match in matches:
        try:
            parsed = json.loads(match)
            if isinstance(parsed, dict):
                return parsed
        except json.JSONDecodeError:
            continue
    
    # If no JSON found, return default with content as main field
    return default

# --- Schemas ---

@dataclass
class Context:
    """Custom runtime context schema."""
    user_id: str

class ChatRequest(BaseModel):
    message: str
    thread_id: str = "default-thread"
    user_id: str = "1"

# --- Tools ---

@tool
def get_weather_for_location(city: str) -> str:
    """Get real weather data for a given city using Open-Meteo API."""
    try:
        # Step 1: Geocode the city name to get lat/lon
        geocode_url = f"https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1"
        geo_response = httpx.get(geocode_url, timeout=10)
        geo_data = geo_response.json()
        
        if not geo_data.get("results"):
            return f"Could not find location: {city}"
        
        location = geo_data["results"][0]
        lat, lon = location["latitude"], location["longitude"]
        city_name = location.get("name", city)
        country = location.get("country", "")
        
        # Step 2: Get weather data
        weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,weathercode,windspeed_10m,relative_humidity_2m"
        weather_response = httpx.get(weather_url, timeout=10)
        weather_data = weather_response.json()
        
        current = weather_data.get("current", {})
        temp = current.get("temperature_2m", "N/A")
        humidity = current.get("relative_humidity_2m", "N/A")
        wind = current.get("windspeed_10m", "N/A")
        weather_code = current.get("weathercode", 0)
        
        # Map weather codes to descriptions
        weather_codes = {
            0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
            45: "Foggy", 48: "Depositing rime fog",
            51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
            61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
            71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
            80: "Slight rain showers", 81: "Moderate showers", 82: "Violent showers",
            95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Severe thunderstorm"
        }
        condition = weather_codes.get(weather_code, "Unknown")
        
        return f"Weather in {city_name}, {country}: {temp}°C, {condition}. Humidity: {humidity}%, Wind: {wind} km/h"
    except Exception as e:
        return f"Weather API error: {str(e)}"

@tool
def get_user_location(runtime: ToolRuntime[Context]) -> str:
    """Retrieve user information based on user ID."""
    user_id = runtime.context.user_id
    return "Florida" if user_id == "1" else "SF"

# --- Agent & Model Setup ---

from langchain_aws import ChatBedrockConverse
from botocore.config import Config

# AWS Bedrock Configuration
retry_config = Config(
    region_name=os.getenv("AWS_REGION_NAME", "us-east-1"),
    retries={
        "max_attempts": 10,
        "mode": "standard",
    },
)

# Using ChatBedrockConverse for better guardrails support
model = ChatBedrockConverse(
    model="us.meta.llama3-2-11b-instruct-v1:0",
    region_name=os.getenv("AWS_REGION_NAME", "us-east-1"),
    config=retry_config,
    temperature=0,
    # AWS Bedrock Guardrails for content safety
    guardrail_config={
        "guardrailIdentifier": os.getenv("BEDROCK_GUARDRAIL_ID", "ldm78u8qeisl"),
        "guardrailVersion": os.getenv("BEDROCK_GUARDRAIL_VERSION", "1"),
    },
)

# Chat Agent - Simple agent without structured output (Llama 3.2 handles it via prompts)
CHAT_SYSTEM_PROMPT = """You are an expert weather forecaster who speaks in puns.

You have access to tools:
- get_user_location: Get the user's location
- get_weather_for_location: Get weather for a city

IMPORTANT: Always respond with ONLY a JSON object in this exact format:
{"punny_response": "Your punny weather message here", "weather_conditions": "Sunny/Cloudy/Rainy/etc or null"}

Do not include any text before or after the JSON."""

checkpointer = InMemorySaver()
chat_agent = create_agent(
    model=model,
    system_prompt=CHAT_SYSTEM_PROMPT,
    tools=[get_user_location, get_weather_for_location],
    context_schema=Context,
    checkpointer=checkpointer
)

# Extraction Agent
EXTRACT_SYSTEM_PROMPT = """You are a data extraction expert.

IMPORTANT: Always respond with ONLY a JSON object in this exact format:
{"entities": [{"name": "entity name", "type": "person/place/tech/concept"}], "summary": "Brief summary of the text"}

Do not include any text before or after the JSON."""

extraction_agent = create_agent(
    model=model,
    system_prompt=EXTRACT_SYSTEM_PROMPT
)

# Analysis Agent  
ANALYZE_SYSTEM_PROMPT = """You are a sentiment analysis expert.

IMPORTANT: Always respond with ONLY a JSON object in this exact format:
{"sentiment": "Positive/Negative/Neutral", "score": 0.85, "reasoning": "Brief explanation"}

Do not include any text before or after the JSON."""

analysis_agent = create_agent(
    model=model,
    system_prompt=ANALYZE_SYSTEM_PROMPT
)

# --- RAG Setup for Resume ---

from langchain_aws import BedrockEmbeddings
from langchain_postgres import PGVector

DATABASE_URL = os.getenv("DATABASE_URL")
COLLECTION_NAME = "sla_vectors"

# Initialize embeddings model
embeddings = BedrockEmbeddings(
    model_id="amazon.titan-embed-text-v2:0",
    region_name=os.getenv("AWS_REGION_NAME", "us-east-1"),
)

# Connect to existing vector store
vector_store = PGVector(
    embeddings=embeddings,
    collection_name=COLLECTION_NAME,
    connection=DATABASE_URL,
)

# RAG System Prompt
RAG_SYSTEM_PROMPT = """You are a helpful assistant answering questions about a company's Service Level Agreement (SLA) document.
Use the following context from the SLA to answer the question accurately.
Be professional, precise, and reference specific terms when applicable.

Context from SLA:
{context}

IMPORTANT: Always respond with ONLY a JSON object in this exact format:
{{"answer": "Your answer here", "sources": ["Brief quote from SLA that supports your answer"]}}

Do not include any text before or after the JSON."""

# --- FastAPI App ---

from fastapi.responses import FileResponse

app = FastAPI(
    title="LangChain Multi-Agent API",
    description="Showcasing high-level LangChain agents with structured outputs and specialized roles.",
    version="1.2.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "status": "online",
        "endpoints": ["/chat", "/extract", "/analyze", "/sladocs", "/sla-document"],
        "tech_stack": ["FastAPI", "LangChain", "AWS Bedrock (Llama 3.2 11B)", "PGVector", "PostgreSQL"]
    }

@app.get("/sla-document")
async def get_sla_document():
    """Serve the SLA PDF for users to verify RAG answers."""
    return FileResponse(
        "cloudnova_sla.pdf",
        media_type="application/pdf",
        filename="CloudNova_SLA.pdf"
    )

@app.post("/chat")
async def chat(request: ChatRequest):
    start_time = time.time()
    config = {"configurable": {"thread_id": request.thread_id}}
    context = Context(user_id=request.user_id)
    
    response = chat_agent.invoke(
        {"messages": [{"role": "user", "content": request.message}]},
        config=config,
        context=context
    )
    
    latency_ms = round((time.time() - start_time) * 1000)
    
    # Extract the last AI message content
    messages = response.get('messages', [])
    for msg in reversed(messages):
        if hasattr(msg, 'type') and msg.type == 'ai' and msg.content:
            default = {"punny_response": msg.content, "weather_conditions": None}
            result = extract_json_from_content(msg.content, default)
            # Ensure required fields exist
            if "punny_response" not in result:
                result["punny_response"] = msg.content
            if "weather_conditions" not in result:
                result["weather_conditions"] = None
            # Add query stats
            result["stats"] = {"latency_ms": latency_ms, "model": "llama-3.2-11b"}
            return result
    
    return {"punny_response": "I couldn't generate a response.", "weather_conditions": None, "stats": {"latency_ms": latency_ms, "model": "llama-3.2-11b"}}

@app.post("/extract")
async def extract(request: ChatRequest):
    start_time = time.time()
    response = extraction_agent.invoke(
        {"messages": [{"role": "user", "content": request.message}]}
    )
    
    latency_ms = round((time.time() - start_time) * 1000)
    
    messages = response.get('messages', [])
    for msg in reversed(messages):
        if hasattr(msg, 'type') and msg.type == 'ai' and msg.content:
            default = {"entities": [], "summary": msg.content}
            result = extract_json_from_content(msg.content, default)
            if "entities" not in result:
                result["entities"] = []
            if "summary" not in result:
                result["summary"] = msg.content
            result["stats"] = {"latency_ms": latency_ms, "model": "llama-3.2-11b"}
            return result
    
    return {"entities": [], "summary": "Could not extract entities.", "stats": {"latency_ms": latency_ms, "model": "llama-3.2-11b"}}

@app.post("/analyze")
async def analyze(request: ChatRequest):
    start_time = time.time()
    response = analysis_agent.invoke(
        {"messages": [{"role": "user", "content": request.message}]}
    )
    
    latency_ms = round((time.time() - start_time) * 1000)
    
    messages = response.get('messages', [])
    for msg in reversed(messages):
        if hasattr(msg, 'type') and msg.type == 'ai' and msg.content:
            default = {"sentiment": "Neutral", "score": 0.5, "reasoning": msg.content}
            result = extract_json_from_content(msg.content, default)
            if "sentiment" not in result:
                result["sentiment"] = "Neutral"
            if "score" not in result:
                result["score"] = 0.5
            if "reasoning" not in result:
                result["reasoning"] = msg.content
            result["stats"] = {"latency_ms": latency_ms, "model": "llama-3.2-11b"}
            return result
    
    return {"sentiment": "Unknown", "score": 0.0, "reasoning": "Could not analyze.", "stats": {"latency_ms": latency_ms, "model": "llama-3.2-11b"}}

@app.post("/sladocs")
async def ask_sladocs(request: ChatRequest):
    """RAG endpoint to ask questions about the SLA document."""
    start_time = time.time()
    
    # 1. Retrieve relevant chunks from vector store
    docs = vector_store.similarity_search(request.message, k=3)
    context = "\n\n".join([doc.page_content for doc in docs])
    
    # 2. Create prompt with context
    prompt = RAG_SYSTEM_PROMPT.format(context=context)
    
    # 3. Query the model
    response = model.invoke([
        {"role": "system", "content": prompt},
        {"role": "user", "content": request.message}
    ])
    
    latency_ms = round((time.time() - start_time) * 1000)
    
    # 4. Parse response
    content = response.content if hasattr(response, 'content') else str(response)
    default = {"answer": content, "sources": []}
    result = extract_json_from_content(content, default)
    
    if "answer" not in result:
        result["answer"] = content
    if "sources" not in result:
        result["sources"] = []
    
    result["stats"] = {"latency_ms": latency_ms, "model": "llama-3.2-11b", "chunks_retrieved": len(docs)}
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
