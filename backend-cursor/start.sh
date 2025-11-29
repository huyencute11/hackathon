#!/bin/bash

# Script to start all services with Docker Compose

echo "🚀 Starting Relief Coordination System..."
echo ""

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose not found. Please install Docker Compose."
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "📦 Building and starting all services..."
echo ""

# Build and start services
docker-compose up --build -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check service status
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "✅ Services started!"
echo ""
echo "🌐 Access the application:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:8000"
echo "   API Docs:  http://localhost:8000/docs"
echo "   MySQL:     localhost:3306"
echo ""
echo "📝 View logs: docker-compose logs -f"
echo "🛑 Stop:      docker-compose down"
echo ""

