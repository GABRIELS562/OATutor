#!/bin/bash
# Deploy script for Online Tutor App
# This script is executed on server1 after code is pushed

set -e

APP_DIR="/opt/online-tutor"
REPO_URL="https://github.com/GABRIELS562/OATutor.git"

echo "=== Online Tutor Deployment ==="
echo "Timestamp: $(date)"

cd $APP_DIR

# Pull latest code
if [ -d ".git" ]; then
    echo "Pulling latest changes..."
    git pull origin main
else
    echo "Cloning repository..."
    git clone $REPO_URL .
fi

# Build and deploy
echo "Building Docker image..."
docker build -t online-tutor:latest .

# Stop and remove old container (if exists)
echo "Stopping old container..."
docker stop online-tutor 2>/dev/null || true
docker rm online-tutor 2>/dev/null || true

# Start new container
echo "Starting new container..."
docker run -d \
    --name online-tutor \
    --restart unless-stopped \
    --network seattle-coffee-app_coffee-network \
    -p 3001:80 \
    --health-cmd="wget --no-verbose --tries=1 --spider http://localhost/health || exit 1" \
    --health-interval=30s \
    --health-timeout=10s \
    --health-retries=3 \
    --label "app=online-tutor" \
    --label "team=devops" \
    online-tutor:latest

# Wait for health check
echo "Waiting for container to be healthy..."
sleep 5

# Check status
if docker ps | grep -q online-tutor; then
    echo "=== Deployment Successful ==="
    docker ps | grep online-tutor
else
    echo "=== Deployment Failed ==="
    docker logs online-tutor
    exit 1
fi

# Cleanup old images
echo "Cleaning up old images..."
docker image prune -f

echo "=== Done ==="
