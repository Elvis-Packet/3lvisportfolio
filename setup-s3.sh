#!/bin/bash

# AWS S3 Setup Script
# Creates and configures S3 bucket for static hosting

BUCKET_NAME="elvis-mbugua-portfolio"
REGION="us-east-1"

echo "🔧 Setting up AWS S3 bucket for Elvis Portfolio..."
echo "📍 Region: $REGION"
echo "📦 Bucket: $BUCKET_NAME"
echo ""

# 1. Create S3 Bucket
echo "1️⃣  Creating S3 bucket..."
aws s3 mb s3://$BUCKET_NAME --region $REGION 2>/dev/null || echo "⚠️  Bucket may already exist"

# 2. Enable Public Access Block (Allow public access)
echo "2️⃣  Configuring public access..."
aws s3api put-public-access-block --bucket $BUCKET_NAME \
  --public-access-block-configuration \
  "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# 3. Enable Static Website Hosting
echo "3️⃣  Enabling static website hosting..."
aws s3 website s3://$BUCKET_NAME \
  --index-document index.html \
  --error-document index.html

# 4. Create Bucket Policy
echo "4️⃣  Setting bucket policy for public read..."
cat > bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json
rm bucket-policy.json

# 5. Enable CORS
echo "5️⃣  Configuring CORS..."
cat > cors.json << EOF
{
  "CORSRules": [
    {
      "AllowedMethods": ["GET", "HEAD"],
      "AllowedOrigins": ["*"],
      "AllowedHeaders": ["*"]
    }
  ]
}
EOF

aws s3api put-bucket-cors --bucket $BUCKET_NAME --cors-configuration file://cors.json
rm cors.json

# 6. Enable Versioning (optional but recommended)
echo "6️⃣  Enabling versioning..."
aws s3api put-bucket-versioning --bucket $BUCKET_NAME \
  --versioning-configuration Status=Enabled

echo ""
echo "✅ S3 bucket setup complete!"
echo ""
echo "📊 Bucket Details:"
aws s3api head-bucket --bucket $BUCKET_NAME 2>/dev/null && \
  echo "✅ Bucket exists and is accessible" || echo "❌ Bucket not found"

echo ""
echo "🚀 Next steps:"
echo "  1. Build: npm run build"
echo "  2. Deploy: npm run deploy:s3"
echo "  3. Website URL: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
echo ""
echo "📝 Optional: Set up CloudFront distribution for better performance"
echo "   (See AWS_S3_DEPLOYMENT.md for details)"
