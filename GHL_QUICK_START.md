# GHL Integration Quick Start Guide

Get the GoHighLevel integration up and running in 5 steps!

---

## ⚡ Quick Start (5-10 minutes)

### Step 1: Gather GHL Credentials

From your GHL account, get:
1. **API Key** - Settings → Integrations → API → Create New Key
2. **Location ID** - Settings → Location Info
3. **Location Key** - Settings → API Credentials
4. **Webhook Secret** (optional) - For automation

### Step 2: Configure Environment Variables

```bash
# Copy example to actual .env
cp .env.example .env

# Edit .env with your GHL credentials:
GHL_API_KEY=your_key_here
GHL_LOCATION_ID=your_location_here
GHL_LOCATION_KEY=your_key_here
GHL_PRIVATE_TOKEN=your_token_here

# Add Vision API (choose one):
GEMINI_API_KEY=your_gemini_key
# OR
AZURE_VISION_KEY=your_azure_key
AZURE_VISION_ENDPOINT=your_azure_endpoint
```

### Step 3: Set Up GHL Form IDs

1. Go to **GHL Form Builder**
2. Create or select a form
3. Copy the **Form ID**
4. Add to `.env`:
   ```bash
   REACT_APP_GHL_PREQUAL_FORM_ID=your_form_id
   ```

### Step 4: Map Form Fields

In `client/src/config/ghl-forms.ts`:

1. Find your form type (PRE_QUAL, FULL_APPLICATION, etc.)
2. Look at `fieldMappings` object
3. Match each field to your GHL custom field names:
   ```typescript
   firstName: {
     fieldName: 'firstName',
     ghlFieldName: 'first_name',  // ← Update this
     required: true,
     type: 'text',
   },
   ```

To find GHL field names:
- Go to Form Builder
- Click field settings
- Look for "Field Name" or "Custom Field"
- Copy exact name

### Step 5: Test It!

1. Start the app:
   ```bash
   npm run dev
   ```

2. Navigate to Client Hub (`/client-hub`)

3. Click "Start New Application"

4. Fill out the Pre-Qual form

5. Submit and check:
   - ✅ Form validation works
   - ✅ Success message appears
   - ✅ Go to GHL → Check if contact was created
   - ✅ Return to Client Hub → Check if app appears in Applications tab

---

## 🎯 What You Can Do Now

### ✅ Users Can:
- [ ] Submit pre-qualification forms
- [ ] Track application status
- [ ] See portfolio and investments
- [ ] Preview documents with AI analysis
- [ ] Chat with SaintBroker AI

### ✅ You Can:
- [ ] See all leads in GHL
- [ ] Automate welcome emails/SMS
- [ ] Track funding applications
- [ ] Manage client relationships
- [ ] Export data and reports

---

## 📋 Common Setup Issues & Fixes

### Form won't submit
**Problem:** "Form ID not configured"

**Solution:**
1. Check `.env` has `REACT_APP_GHL_PREQUAL_FORM_ID` set
2. Verify Form ID is correct in GHL
3. Look at browser console for exact error
4. Try `/api/ghl-forms/validate` to test validation

### No applications showing
**Problem:** "Applications tab is empty"

**Solution:**
1. Create an opportunity in GHL first
2. Make sure API key has correct permissions
3. Check backend logs: `npm run dev` shows any errors
4. Verify GHL_API_KEY and GHL_LOCATION_ID are correct

### Document preview not working
**Problem:** "Analysis button doesn't work"

**Solution:**
1. Set GEMINI_API_KEY or AZURE_VISION_KEY
2. Make sure API key has correct permissions
3. Try uploading a clearer document
4. Check backend logs for vision API errors

### Data not refreshing
**Problem:** "Portfolio/applications not updating"

**Solution:**
1. React Query caches for 5 minutes - wait or refresh page
2. Go to GHL and manually update an opportunity status
3. Return to Client Hub and refresh
4. Check network tab to see API calls

---

## 🔑 Important Files

| File | Purpose |
|------|---------|
| `.env` | Your secrets and credentials |
| `client/src/config/ghl-forms.ts` | Form definitions and field mappings |
| `client/src/pages/client-hub.tsx` | Main dashboard |
| `server/routes/ghl-data.ts` | API endpoints for fetching data |
| `server/routes/ghl-forms.ts` | Form submission endpoints |
| `server/routes/vision.ts` | Document analysis endpoints |

---

## 🚀 Next Steps

1. **Connect More Forms**
   - Add REACT_APP_GHL_FULL_APPLICATION_FORM_ID to `.env`
   - Update field mappings in `ghl-forms.ts`
   - Forms automatically appear in Client Hub

2. **Set Up Workflows**
   - Create automation in GHL
   - Add GHL_WELCOME_WORKFLOW_ID to `.env`
   - Forms will trigger welcome emails/SMS

3. **Customize Appearance**
   - Edit `client/src/pages/client-hub.tsx`
   - Modify colors, text, sections
   - Add company branding

4. **Add More Features**
   - Document signing
   - Payment collection
   - Email/SMS communication
   - Advanced analytics

---

## 📊 Expected Workflow

```
User submits pre-qual form
    ↓
Data validates
    ↓
Form submits to GHL
    ↓
Contact created in GHL
    ↓
Opportunity created
    ↓
Welcome email/SMS sent (if workflow enabled)
    ↓
User sees application in Client Hub
    ↓
You see lead in GHL
    ↓
Follow up in GHL
    ↓
Move through pipeline
    ↓
Funding & tracking
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] `.env` file is created with all keys
- [ ] GHL Form IDs are set in `.env`
- [ ] Field mappings updated in `ghl-forms.ts`
- [ ] Pre-Qual form submits successfully
- [ ] Contact appears in GHL within 1 minute
- [ ] Opportunity appears in GHL
- [ ] Application shows in Client Hub
- [ ] Vision API works (if enabled)
- [ ] Portfolio loads (if you have opportunities in GHL)
- [ ] SaintBroker AI responds to messages

---

## 🆘 Getting Help

1. **Check the logs:**
   ```bash
   npm run dev  # Shows backend errors
   # Check browser console (F12) for frontend errors
   ```

2. **Test endpoints directly:**
   ```bash
   # Test form validation
   curl -X POST http://localhost:5000/api/ghl-forms/validate \
     -H "Content-Type: application/json" \
     -d '{"formType":"pre-qual","formData":{"firstName":"John"}}'
   ```

3. **Verify GHL connection:**
   - Go to Client Hub
   - Open browser Network tab
   - Try to load dashboard
   - Look for `/api/ghl/opportunities` request
   - Check response for errors

4. **Review full documentation:**
   - See `GHL_INTEGRATION_GUIDE.md` for detailed info
   - See `GHL_IMPLEMENTATION_SUMMARY.md` for architecture

---

## 🎓 Common Field Mappings

### Standard GHL Fields
```javascript
// These usually match out of the box
first_name        ← firstName
last_name         ← lastName
email              ← email
phone              ← phone
business_name     ← businessName
loan_amount       ← loanAmount
```

### Custom Field Examples
```javascript
// You might have different names in GHL:
loan_purpose      ← loanPurpose
credit_score      ← creditScore (or credit_range)
years_in_business ← yearsInBusiness
annual_revenue    ← annualRevenue
collateral_type   ← collateralType
```

**To find exact names:**
1. Go to Form Builder
2. Click on a field
3. Look for "Field Name" in settings
4. Copy exact spelling and case

---

## 🔄 Form Submission Flow

1. User fills form → Local validation
2. Click submit → Field mapping (local → GHL names)
3. Send to `/api/ghl-forms/submit` → Backend validation
4. Call GHL API → Create contact + opportunity
5. Return success → Show confirmation screen
6. React Query refetch → Update Client Hub
7. User sees application in Applications tab

---

## 💡 Pro Tips

1. **Test with Postman**
   - Create requests for each endpoint
   - Easier to debug API issues
   - Can test without frontend

2. **Use GHL's Test Mode**
   - Create test forms
   - Don't affect real data
   - Safe for development

3. **Monitor GHL Logs**
   - GHL has webhooks/logs
   - Can see what your API calls do
   - Useful for debugging

4. **Keep Backups**
   - Back up your `.env` file
   - Keep old form IDs documented
   - Archive field mappings

---

## 📚 Documentation Files

- **GHL_INTEGRATION_GUIDE.md** - Comprehensive documentation
- **GHL_IMPLEMENTATION_SUMMARY.md** - What was built
- **GHL_QUICK_START.md** - This file!
- **.env.example** - Environment variables template

---

**You're all set!** 🎉

If you get stuck, refer to:
1. This quick start guide
2. The detailed integration guide
3. Your GHL account settings
4. Browser/server console logs

Happy building! 🚀
