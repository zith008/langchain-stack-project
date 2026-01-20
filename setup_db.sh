#!/bin/bash

echo "🔍 Checking for existing PostgreSQL on port 5432..."

# Check if something is using port 5432
if lsof -Pi :5432 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Port 5432 is already in use!"
    echo "   This might be a local PostgreSQL installation."
    echo ""
    echo "📋 Options:"
    echo "   1. Stop the local PostgreSQL service:"
    echo "      brew services stop postgresql  # if installed via Homebrew"
    echo "      OR"
    echo "      sudo systemctl stop postgresql  # on Linux"
    echo ""
    echo "   2. Use a different port for Docker (update docker-compose.yml)"
    echo ""
    read -p "Do you want to continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "🧹 Cleaning up old containers and volumes..."
docker-compose down -v

echo ""
echo "🚀 Starting PostgreSQL with pgvector..."
docker-compose up -d

echo ""
echo "⏳ Waiting for database to be ready..."
sleep 5

echo ""
echo "🔍 Checking container status..."
docker-compose ps

echo ""
echo "📋 Viewing logs..."
docker-compose logs --tail=20 postgres

echo ""
echo "✅ Setup complete! Try running your Python script now."
echo "   If you see errors, check the logs with: docker-compose logs postgres"
