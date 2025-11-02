# 🎤 ELEVENLABS VOICE AGENT INTEGRATION

## 🎯 GOAL

Add voice agent capabilities to SaintBroker AI using Elevenlabs API.

---

## ✅ WHAT WE HAVE

- ✅ **Elevenlabs API Key:** `sk_24f25382ba3ceeb603b4360c3bb2be5f374424cce4c9690c`
- ✅ **Twilio Integration:** Already set up for phone calls
- ✅ **Azure Speech:** STT/TTS endpoints configured
- ✅ **Chat AI:** SaintBroker AI fully operational

---

## 🚀 IMPLEMENTATION PLAN

### Phase 1: Voice Button on Landing Page

```typescript
// client/src/components/voice/VoiceButton.tsx
import { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

export function VoiceButton() {
  const [isListening, setIsListening] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const startVoiceCall = async () => {
    setIsConnecting(true);
    try {
      const response = await fetch('/api/voice/start-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPhone: null, // Browser-based call
          agentId: 'saintbroker-elevenlabs-agent'
        })
      });

      const { callId, streamUrl } = await response.json();
      // Connect to Elevenlabs stream
      connectToVoiceAgent(streamUrl);
      setIsListening(true);
    } catch (error) {
      console.error('Failed to start voice call:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <button
      onClick={startVoiceCall}
      disabled={isConnecting}
      className="voice-button"
    >
      {isListening ? <MicOff /> : <Mic />}
      {isConnecting ? 'Connecting...' : 'Talk to SaintBroker'}
    </button>
  );
}
```

### Phase 2: Backend Voice Endpoint

```typescript
// server/routes/voice-elevenlabs.ts
import { Router } from 'express';

export const voiceRouter = Router();

voiceRouter.post('/start-call', async (req, res) => {
  try {
    const { userPhone, agentId } = req.body;

    // Initialize Elevenlabs conversation
    const conversation = await fetch('https://api.elevenlabs.io/v1/convai/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        agent_id: agentId || 'default-saintbroker-agent',
        system_prompt: `You are SaintBroker, an expert financial advisor...`,
        first_message: "Hello! I'm SaintBroker. How can I help you with business lending, real estate, or investments today?"
      })
    });

    const data = await conversation.json();

    res.json({
      success: true,
      callId: data.conversation_id,
      streamUrl: data.stream_url
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

voiceRouter.post('/end-call', async (req, res) => {
  const { callId } = req.body;

  // End Elevenlabs conversation
  await fetch(`https://api.elevenlabs.io/v1/convai/conversations/${callId}/end`, {
    method: 'POST',
    headers: {
      'xi-api-key': process.env.ELEVENLABS_API_KEY
    }
  });

  res.json({ success: true });
});
```

### Phase 3: Phone Call Integration

```typescript
// server/routes/voice-elevenlabs.ts (continued)

voiceRouter.post('/phone-call', async (req, res) => {
  const { toPhone } = req.body;

  try {
    // Create Elevenlabs agent call
    const call = await fetch('https://api.elevenlabs.io/v1/convai/phone-calls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        agent_id: process.env.ELEVENLABS_AGENT_ID,
        to_phone_number: toPhone,
        from_phone_number: process.env.TWILIO_PHONE_NUMBER,
        system_prompt: `You are SaintBroker calling to help with their business funding inquiry...`,
        first_message: "Hi! This is SaintBroker from Saint Vision Group calling about your loan inquiry."
      })
    });

    const data = await call.json();

    // Save call to database
    await storage.createCall({
      userId: req.user?.userId,
      callId: data.call_id,
      phone: toPhone,
      status: 'initiated',
      provider: 'elevenlabs'
    });

    res.json({
      success: true,
      callId: data.call_id,
      status: 'initiated'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook to receive call events
voiceRouter.post('/webhook/elevenlabs', async (req, res) => {
  const event = req.body;

  console.log('Elevenlabs event:', event.type, event.call_id);

  // Update call status in database
  await storage.updateCall(event.call_id, {
    status: event.type,
    transcript: event.transcript,
    duration: event.duration,
    metadata: event.metadata
  });

  // Trigger automation based on call outcome
  if (event.type === 'call_ended') {
    const { qualification_score, next_steps } = event.metadata;

    // Update GHL contact with call notes
    await ghlClient.addNote(event.contact_id, {
      body: `Voice call completed

Duration: ${event.duration}s
Qualification: ${qualification_score}/10
Next Steps: ${next_steps}

Full transcript available in CRM.`
    });
  }

  res.json({ received: true });
});
```

### Phase 4: Landing Page Integration

```typescript
// client/src/pages/landing.tsx

import { VoiceButton } from '@/components/voice/VoiceButton';

export default function Landing() {
  return (
    <div>
      {/* Hero section */}
      <section className="hero">
        <h1>Get Funding in 24 Hours</h1>
        <p>Talk to SaintBroker AI now</p>

        <div className="cta-buttons">
          {/* Text Chat */}
          <button onClick={openChat}>
            Chat with SaintBroker
          </button>

          {/* Voice Call */}
          <VoiceButton />
        </div>
      </section>

      {/* Rest of landing page */}
    </div>
  );
}
```

---

## 📋 IMPLEMENTATION STEPS

### Step 1: Create Elevenlabs Agent

1. Go to https://elevenlabs.io/app/conversational-ai
2. Click "Create Agent"
3. Configure:
   - **Name:** SaintBroker AI
   - **Voice:** Choose professional male voice
   - **System Prompt:** (Use our SaintSal prompt from `server/lib/saintvision-ai-core.ts`)
   - **First Message:** "Hello! I'm SaintBroker..."
   - **Knowledge Base:** Upload lending products, rates, requirements
4. Copy **Agent ID** to env variables
5. Configure webhook URL: `https://your-domain.com/api/voice/webhook/elevenlabs`

### Step 2: Add Backend Routes

```bash
# Create voice routes file
touch server/routes/voice-elevenlabs.ts
```

Copy the code from Phase 2 above.

### Step 3: Register Routes in server/routes.ts

```typescript
import { voiceRouter } from './routes/voice-elevenlabs';

// Add in registerRoutes()
app.use('/api/voice', voiceRouter);
```

### Step 4: Create Frontend Components

```bash
# Create voice components
mkdir -p client/src/components/voice
touch client/src/components/voice/VoiceButton.tsx
touch client/src/components/voice/VoiceChat.tsx
```

### Step 5: Add to Landing Page

Import and add `<VoiceButton />` to landing page hero section.

### Step 6: Test

1. Click voice button
2. Speak: "I need a $200k business loan"
3. Verify SaintBroker responds via voice
4. Check call is logged in database
5. Verify transcript saves to GHL

---

## 🎯 FEATURES TO ADD

### Core Voice Features
- ✅ Browser-based voice chat
- ✅ Phone call initiation
- ✅ Real-time transcription
- ✅ Call recording
- ✅ Transcript storage

### Advanced Features
- Voice authentication
- Multi-language support
- Call transfer to human agent
- Voicemail handling
- Follow-up call scheduling
- Voice analytics dashboard

### Integration Features
- GHL call logging
- Automatic note creation
- Lead scoring from voice
- Calendar booking via voice
- Document requests via voice

---

## 💰 COST ESTIMATES

**Elevenlabs Pricing:**
- Voice calls: ~$0.10-0.20 per minute
- 100 calls/month @ 5min avg = $50-100/month
- Much cheaper than hiring staff

**ROI:**
- Handles 24/7 inbound calls
- Qualifies leads automatically
- Books appointments
- Never misses a call
- Consistent quality

---

## 🔧 CONFIGURATION

Add to `.env`:

```env
# Elevenlabs
ELEVENLABS_API_KEY=<your-elevenlabs-api-key>
ELEVENLABS_AGENT_ID=<your-agent-id-from-dashboard>
ELEVENLABS_WEBHOOK_SECRET=<generate-random-string>

# Voice Settings
VOICE_DEFAULT_LANGUAGE=en
VOICE_MAX_DURATION=600
VOICE_ENABLE_RECORDING=true
VOICE_SAVE_TRANSCRIPTS=true
```

---

## 📊 ANALYTICS TO TRACK

- Total calls
- Average duration
- Qualification rate
- Booking rate
- Top questions asked
- Drop-off points
- Sentiment analysis
- Lead quality scores

---

## 🚀 LAUNCH PLAN

1. **Week 1:** Set up Elevenlabs agent + basic integration
2. **Week 2:** Test with internal team
3. **Week 3:** Beta test with 10 leads
4. **Week 4:** Full launch on website

**Timeline:** 4 weeks from now to fully operational voice agent.

---

## 💪 WHY THIS MATTERS

**Current State:**
- Visitors can only chat via text
- Many prefer voice
- Miss calls when unavailable
- Limited lead capture

**With Voice Agent:**
- Capture 3x more leads
- Handle calls 24/7
- Qualify leads instantly
- Book appointments automatically
- Never miss an opportunity

**This is your competitive advantage.**

---

**Ready to implement? Let's add voice to SaintBroker! 🎤**
