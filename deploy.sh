#!/bin/bash

echo "🚀 Deploying SaintBroker AI to GitHub..."

# Remove any git locks if they exist
rm -f .git/index.lock

# Configure git
git config --global user.email "saints@hacp.ai"
git config --global user.name "Saint Vision Group"

# Add all files
echo "📦 Adding all files..."
git add -A

# Commit changes
echo "✍️ Committing changes..."
git commit -m "Deploy SaintBroker AI - Complete platform with Vercel configuration" || echo "No changes to commit"

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push -u origin main

echo "✅ Deployment complete!"
echo "Your code is now on GitHub at: https://github.com/SaintVisionAi/TheBrokerage-SaintVision-Ai"
echo ""
echo "Next steps:"
echo "1. Go to https://vercel.com"
echo "2. Import your GitHub repo"
echo "3. Deploy to production!"