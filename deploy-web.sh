#!/bin/bash

# Music Streamer - Web Deployment Script
# This script builds and prepares your app for web deployment

echo "🎵 Music Streamer - Web Deployment Script"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from your project root."
    exit 1
fi

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install

# Build for web
echo "🏗️  Building for web..."
npx expo export:web

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📁 Your web app is ready in the 'dist' folder"
    echo ""
    echo "🚀 Deployment options:"
    echo "1. Upload the 'dist' folder to any web hosting service"
    echo "2. Use Netlify: drag and drop the 'dist' folder"
    echo "3. Use Vercel: connect your repository"
    echo "4. Use GitHub Pages: push 'dist' to gh-pages branch"
    echo ""
    echo "🌐 Your app will be accessible to PC users via web browser"
    echo "💡 Features for PC users:"
    echo "   - Keyboard shortcuts (Ctrl+H, Ctrl+K, Ctrl+L, Ctrl+Space)"
    echo "   - Desktop-optimized layout"
    echo "   - Enhanced mini player"
    echo "   - Responsive design"
    echo ""
    echo "📖 See WEB_DEPLOYMENT_GUIDE.md for detailed instructions"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi