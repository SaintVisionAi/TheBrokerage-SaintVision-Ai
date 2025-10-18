# 🚀 Vercel Deployment Guide for SaintBroker AI™

## Project Details
- **Project Name**: the-brokerage-by-saintsal-saintvisionai
- **Project ID**: prj_kAWhcR1DOdHNTUvnwWa4Ngv2QOSu
- **Domain**: saintvisiongroup.com

## 📋 Pre-Deployment Checklist

### 1. GitHub Repository Setup
```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit with message
git commit -m "Deploy SaintBroker AI to production"

# Add your GitHub remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/saintvision-ai.git

# Push to main branch
git push -u origin main
```

### 2. Required Environment Variables in Vercel

Go to your Vercel Project Settings → Environment Variables and add:

#### 🔐 Core Secrets
```
DATABASE_URL=your_neon_postgres_url_here
JWT_SECRET=your_jwt_secret_here
NODE_ENV=production
```

#### 🤖 AI Configuration
```
OPENAI_API_KEY=your_openai_api_key
AZURE_AI_FOUNDRY_KEY=3ujKuvkPRJPF4PcDvK4AcnKupEROeRcb3hkIK0QvUdJRnwfn2ACTJQQJXXKr8kxCFCXVyW5xRdLM
AZURE_AI_FOUNDRY_ENDPOINT=https://sv-cookin-foundry.services.ai.azure.com/
AZURE_SPEECH_KEY=your_azure_speech_key
AZURE_SPEECH_REGION=your_azure_speech_region
```

#### 📞 Communication Services
```
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+19495550720
```

#### 🏢 GoHighLevel CRM
```
GHL_API_KEY=your_ghl_api_key
GHL_LOCATION_ID=NgUphdsMGXpRO3h98XyG
GHL_LOCATION_API_KEY=your_ghl_location_api_key
GHL_PRIVATE_ACCESS_TOKEN=your_ghl_private_token
```

#### 🍳 Cookin API
```
COOKIN_API_KEY=your_cookin_api_key
```

#### 🔗 Public URLs (Optional)
```
VITE_API_URL=https://the-brokerage-by-saintsal-saintvisionai.vercel.app
```

### 3. Database Setup

Since you're using Neon PostgreSQL:
1. Go to https://neon.tech
2. Create a new database or use existing
3. Copy the connection string
4. Add it as DATABASE_URL in Vercel

### 4. Build Configuration

The `vercel.json` is already configured with:
- ✅ Vite framework detection
- ✅ API routes handling
- ✅ Proper rewrites for SPA
- ✅ Serverless functions for backend

### 5. Deployment Steps

#### Option A: Deploy via GitHub (Recommended)
1. Push your code to GitHub
2. Go to https://vercel.com/dashboard
3. Click "Import Project"
4. Select your GitHub repository
5. Choose "the-brokerage-by-saintsal-saintvisionai" project
6. Vercel will auto-detect settings from vercel.json
7. Add environment variables
8. Click "Deploy"

#### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### 6. Post-Deployment

#### Custom Domain Setup
1. Go to Project Settings → Domains
2. Add `saintvisiongroup.com`
3. Update DNS records:
   - A Record: 76.76.21.21
   - CNAME: cname.vercel-dns.com

#### Verify Deployment
- ✅ Login: https://saintvisiongroup.com
- ✅ API Health: https://saintvisiongroup.com/api/test-openai
- ✅ AI Chat: Test SaintBroker AI assistant
- ✅ Webhooks: https://saintvisiongroup.com/api/webhooks/ghl

### 7. Important Notes

⚠️ **Database Migrations**: Run these after deployment if needed:
```bash
npm run db:push --force
```

⚠️ **Session Storage**: For production, consider Redis for sessions instead of in-memory

⚠️ **File Uploads**: Vercel has a 5MB limit for serverless functions

### 8. Monitoring

- Check Vercel Dashboard for:
  - Function logs
  - Error tracking
  - Performance metrics
  - Build logs

### 9. Troubleshooting

If deployment fails:
1. Check build logs in Vercel dashboard
2. Verify all environment variables are set
3. Ensure database connection string is correct
4. Check function size limits (50MB max)

## 🎉 Success!

Once deployed, your SaintBroker AI platform will be live at:
- **Production**: https://saintvisiongroup.com
- **Preview**: https://the-brokerage-by-saintsal-saintvisionai.vercel.app

---

## Support

For issues, contact:
- Email: saints@hacp.ai
- Phone: (949) 755-0720