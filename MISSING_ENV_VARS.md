# 🚨 CRITICAL: MISSING ENVIRONMENT VARIABLES

**Analysis Complete:** I searched the ENTIRE codebase for every `process.env.*` and `import.meta.env.*` usage.

**Status:** Your COMPLETE_VERCEL_ENV_VARS.txt is ALMOST complete, but missing some CRITICAL variables.

---

## ⚠️ ABSOLUTELY CRITICAL (MUST ADD NOW)

These are used in the code and REQUIRED for proper operation:

### 1. Security & Encryption
```env
ENCRYPTION_KEY=saintvision_encryption_2025_must_be_32_chars_or_64_hex
DATABASE_API_KEY=saintvision_db_api_2025_secure_key
```

**Why Critical:**
- `ENCRYPTION_KEY`: Used in `server/lib/encryption.ts` to encrypt sensitive user data
- `DATABASE_API_KEY`: Used in `server/routes/database-query.ts` to protect database endpoint

### 2. Frontend & API URLs
```env
FRONTEND_URL=https://saintvision-ai-brokerage-capotime-bax7hcm1z.vercel.app
API_URL=https://saintvision-ai-brokerage-capotime-bax7hcm1z.vercel.app
VITE_API_URL=https://saintvision-ai-brokerage-capotime-bax7hcm1z.vercel.app
```

**Why Critical:**
- `FRONTEND_URL`: Used for email verification links in `server/routes/email-verification.ts`
- `API_URL`: Used in monitoring system health checks
- `VITE_API_URL`: Used in `api/index.ts` to determine API base URL

---

## 📋 IMPORTANT FOR FULL FUNCTIONALITY

These enable specific features (GHL forms, intake, email):

### 3. GHL Pipeline & Calendar IDs
```env
GHL_REAL_ESTATE_BROKER_PIPELINE_ID=<get-from-ghl-dashboard>
GHL_INVESTMENT_PIPELINE_ID=<get-from-ghl-dashboard>
GHL_JR_CALENDAR_ID=<get-from-ghl-dashboard>
```

**Where Used:**
- `server/routes/intake-api-routes.ts` - Real estate and investment intake forms
- Lines 35, 133, 257, 275

**To Get These:**
1. Go to your GHL dashboard
2. Settings → Pipelines → Copy Pipeline IDs
3. Settings → Calendars → Copy Calendar ID

### 4. Email/SMTP (For Notifications)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=ryan@saintvisiongroup.com
SMTP_PASS=<your-gmail-app-password>
```

**Where Used:**
- `server/routes/intake-api-routes.ts` - Email notifications for leads

**To Get Gmail App Password:**
1. Go to https://myaccount.google.com/apppasswords
2. Create "SaintVision App"
3. Copy 16-character password

### 5. Client-Side GHL Form IDs (Frontend)
```env
VITE_GHL_PREQUAL_FORM_ID=gPGc1pTZGRvxybqPpDRL
VITE_GHL_APPLICATION_FORM_ID=0zcz0ZlG2eEddg94wcbq
VITE_GHL_DOCUMENT_FORM_ID=yLjMJMuW3mM08ju9GkWY
VITE_GHL_INVESTMENT_FORM_ID=1pivHofKUp5uTa9ws1TG
VITE_GHL_REALESTATE_FORM_ID=M2jNYXh8wl8FYhxOap9N
VITE_GHL_SVT_FORM_ID=svt_form_id
VITE_GHL_MORTGAGE_FORM_ID=mortgage_form_id
```

**Where Used:**
- `client/src/config/ghl-forms.ts` - Frontend form rendering

---

## 🔔 OPTIONAL (Monitoring & Alerts)

These have defaults but can be customized:

```env
ALERT_PHONE=+19499972097
ALERT_EMAIL=ryan@cookinknowledge.com
SLACK_WEBHOOK=<your-slack-webhook-url>
PAGERDUTY_KEY=<your-pagerduty-key>
```

**Where Used:**
- `server/lib/production/monitoring-system.ts` - System health alerts
- These have fallback defaults, so not critical

---

## 🎤 FUTURE (Voice Agent)

Not needed NOW, but for when you add voice:

```env
ELEVENLABS_AGENT_ID=<create-in-elevenlabs-dashboard>
ELEVENLABS_WEBHOOK_SECRET=saintvision_elevenlabs_2025
```

**Skip for now** - You already have `ELEVENLABS_API_KEY` which is enough to start.

---

## ✅ WHAT YOU ALREADY HAVE (VERIFIED COMPLETE)

Your COMPLETE_VERCEL_ENV_VARS.txt includes:

✅ NODE_ENV=production
✅ AGENT_EMAIL, AGENT_PHONE_NUMBER
✅ JWT_SECRET, INTERNAL_API_KEY
✅ OPENAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY, GEMINI_API_LIVE_KEY
✅ AZURE_AI_FOUNDRY_KEY, AZURE_AI_FOUNDRY_ENDPOINT
✅ All AZURE_DEPLOYMENT_* variables
✅ All Azure services (Speech, Vision, Document Intelligence, Language, Translator, Content Safety, Search)
✅ DATABASE_URL and all PostgreSQL variants
✅ MONGODB_URI
✅ COSMOS_DB_ENDPOINT, COSMOS_DB_KEY
✅ GHL_API_KEY, GHL_LOCATION_ID, GHL_LOCATION_KEY, GHL_PRIVATE_TOKEN, GHL_WEBHOOK_SECRET, GHL_WELCOME_WORKFLOW_ID
✅ GOHIGHLEVEL_API_KEY
✅ TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
✅ ELEVENLABS_API_KEY
✅ GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CLOUD_*
✅ UPSTASH_VECTOR_REST_URL, UPSTASH_VECTOR_REST_TOKEN
✅ NEXT_PUBLIC_STACK_*, STACK_SECRET_SERVER_KEY (Stack Auth)
✅ GITHUB_ACCESS_TOKEN

**That's 80+ environment variables - YOU'RE 95% THERE!**

---

## 🎯 ACTION PLAN: ADD THE MISSING ONES

### Step 1: Generate Security Keys (30 seconds)

Run these to generate secure keys:

```bash
# Generate ENCRYPTION_KEY (64-character hex)
node -e "console.log('ENCRYPTION_KEY=' + require('crypto').randomBytes(32).toString('hex'))"

# Generate DATABASE_API_KEY
node -e "console.log('DATABASE_API_KEY=saintvision_db_api_' + require('crypto').randomBytes(16).toString('hex'))"
```

### Step 2: Add to Vercel (2 methods)

#### METHOD A: Use Vercel Dashboard (EASIEST for bulk)

1. Open Vercel dashboard:
   ```bash
   open https://vercel.com/saint-vision-ai-cookin-knowledge/saintvision-ai-brokerage-capotime/settings/environment-variables
   ```

2. Click "Add New" → "Environment Variable"

3. Copy/paste from COMPLETE_VERCEL_ENV_VARS.txt

4. Add the MISSING ones from above

#### METHOD B: Use Vercel CLI (For individual vars)

```bash
# Add critical ones
vercel env add ENCRYPTION_KEY
# Paste the generated value when prompted

vercel env add DATABASE_API_KEY
# Paste the generated value when prompted

vercel env add FRONTEND_URL
# Enter: https://saintvision-ai-brokerage-capotime-bax7hcm1z.vercel.app

vercel env add API_URL
# Enter: https://saintvision-ai-brokerage-capotime-bax7hcm1z.vercel.app

vercel env add VITE_API_URL
# Enter: https://saintvision-ai-brokerage-capotime-bax7hcm1z.vercel.app
```

---

## 🚀 AFTER ADDING ENV VARS

Vercel will automatically redeploy (2-3 minutes).

**Then test:**

```bash
# Test SaintBroker AI
curl -X POST https://saintvision-ai-brokerage-capotime-bax7hcm1z.vercel.app/api/saint-broker/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "I need a $250k business loan"}'
```

**Expected:** AI response from SaintBroker with Azure GPT-5 or fallback chain.

---

## 📝 SUMMARY

**YOU HAVE:** 80+ env vars ✅
**YOU NEED:** 5 critical + 12 optional = 17 more
**PRIORITY:** Add the 5 critical ones NOW
**OPTIONAL:** Add the rest when you use those features

**LET'S ADD THEM AND LAUNCH! 🔥**
