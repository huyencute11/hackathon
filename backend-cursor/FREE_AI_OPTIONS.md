# Free AI API Options for Donation Suggestion

## 🎯 Current Status
Backend đã support:
- ✅ Rule-based suggestions (FREE, no API key needed)
- ✅ Anthropic Claude integration (requires paid API key)

## 🆓 Free AI Options

### Option 1: Keep Rule-based (Recommended for Demo)
**Cost:** $0
**Speed:** ~50ms
**Quality:** Good enough for hackathon

**How it works:**
- Uses priority_score from database
- Returns top 5 items automatically
- Includes reason based on priority level

**No setup needed!** Already working.

---

### Option 2: OpenAI GPT-3.5-turbo
**Cost:** FREE $5 credit (new accounts)
**Speed:** ~1-2 seconds
**Quality:** Very good

#### Setup:
```bash
# 1. Sign up: https://platform.openai.com/signup
# 2. Get API key: https://platform.openai.com/api-keys
# 3. Add to .env:
OPENAI_API_KEY=sk-...
```

#### Code changes needed:
```python
# In main.py, replace anthropic with openai
from openai import OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Change generate_ai_suggestions to use OpenAI:
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": prompt}],
    temperature=0.7
)
```

---

### Option 3: Google Gemini API
**Cost:** FREE (60 req/min)
**Speed:** ~1 second
**Quality:** Good

#### Setup:
```bash
# 1. Get API key: https://ai.google.dev/
# 2. Install: pip install google-generativeai
# 3. Add to .env:
GOOGLE_API_KEY=...
```

---

### Option 4: Groq (Fastest Free!)
**Cost:** FREE (beta)
**Speed:** ~200ms (super fast!)
**Quality:** Good (Llama 3)

#### Setup:
```bash
# 1. Sign up: https://console.groq.com/
# 2. Get API key
# 3. Add to .env:
GROQ_API_KEY=...
```

---

## 📊 Comparison

| Provider | Cost | Speed | Quality | Setup |
|----------|------|-------|---------|-------|
| Rule-based | $0 | 50ms | Good | ✅ Ready |
| OpenAI | $5 free | 1-2s | Very Good | Easy |
| Gemini | $0 | 1s | Good | Easy |
| Groq | $0 | 200ms | Good | Easy |
| Anthropic | $5+ | 2-5s | Excellent | Easy |

## 🎯 Recommendation for Hackathon

**Use Rule-based mode** - Đã hoạt động tốt, không cần setup gì thêm!

Nếu muốn "wow factor" → Add **Groq** (free & fastest)

## 🚀 Quick Test

Current endpoint works without ANY API key:

```bash
curl -X POST http://localhost:8000/api/donations/ai \
  -H "Content-Type: application/json" \
  -d '{"region_id": 1, "item_ids": []}'
```

Already returns smart suggestions based on priority data! 🎉

