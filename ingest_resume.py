"""
Resume Ingestion Script for RAG

This script:
1. Loads the resume PDF
2. Splits it into chunks
3. Embeds chunks using AWS Bedrock Titan
4. Stores vectors in PGVector (PostgreSQL)

Run this once to set up the vector store:
    python ingest_resume.py
"""

import os
from dotenv import load_dotenv
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_aws import BedrockEmbeddings
from langchain_postgres import PGVector

load_dotenv()

# Configuration
PDF_PATH = "cloudnova_sla.pdf"
COLLECTION_NAME = "sla_vectors"
DATABASE_URL = os.getenv("DATABASE_URL")

def load_pdf(path: str) -> str:
    """Load PDF and extract text."""
    reader = PdfReader(path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text

def chunk_text(text: str) -> list[str]:
    """Split text into chunks for embedding."""
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100,
        separators=["\n\n", "\n", ". ", " ", ""]
    )
    return splitter.split_text(text)

def create_embeddings():
    """Create Bedrock embeddings model."""
    return BedrockEmbeddings(
        model_id="amazon.titan-embed-text-v2:0",
        region_name=os.getenv("AWS_REGION_NAME", "us-east-1"),
        credentials_profile_name=None,  # Use env vars
    )

def main():
    print("🚀 Starting resume ingestion...")
    
    # 1. Load PDF
    print(f"📄 Loading {PDF_PATH}...")
    resume_text = load_pdf(PDF_PATH)
    print(f"   Extracted {len(resume_text)} characters")
    
    # 2. Chunk the text
    print("✂️  Splitting into chunks...")
    chunks = chunk_text(resume_text)
    print(f"   Created {len(chunks)} chunks")
    
    # 3. Create embeddings model
    print("🔗 Connecting to AWS Bedrock for embeddings...")
    embeddings = create_embeddings()
    
    # 4. Store in PGVector
    print(f"💾 Storing vectors in PostgreSQL ({COLLECTION_NAME})...")
    
    vector_store = PGVector.from_texts(
        texts=chunks,
        embedding=embeddings,
        collection_name=COLLECTION_NAME,
        connection=DATABASE_URL,
        pre_delete_collection=True,  # Clear old data
    )
    
    print("✅ Resume successfully embedded and stored!")
    print(f"   Collection: {COLLECTION_NAME}")
    print(f"   Chunks stored: {len(chunks)}")
    
    # Quick test
    print("\n🧪 Testing retrieval...")
    results = vector_store.similarity_search("What experience does this person have?", k=2)
    for i, doc in enumerate(results):
        print(f"   Result {i+1}: {doc.page_content[:100]}...")

if __name__ == "__main__":
    main()
