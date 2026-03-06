#!/bin/bash

# Cleanup script for AWS S3 deployment
# Removes unnecessary development files to keep repo clean

echo "🧹 Cleaning up unnecessary files for S3 deployment..."

# Remove Python script (already used)
if [ -f "generate_cv_pdf.py" ]; then
    rm -f generate_cv_pdf.py
    echo "✅ Removed generate_cv_pdf.py"
fi

# Remove Python virtual environment
if [ -d ".venv" ]; then
    rm -rf .venv
    echo "✅ Removed .venv directory"
fi

# Remove node_modules (should be reinstalled with npm ci)
if [ -d "node_modules" ]; then
    rm -rf node_modules
    echo "✅ Removed node_modules (reinstall with: npm ci)"
fi

# Keep everything else - they're needed for development

echo ""
echo "📦 Build the project:"
echo "  npm run build"
echo ""
echo "🚀 Deploy to AWS S3:"
echo "  npm run deploy:s3"
echo ""
echo "📋 Or manually deploy:"
echo "  aws s3 sync dist/ s3://elvis-mbugua-portfolio --delete --region us-east-1"
