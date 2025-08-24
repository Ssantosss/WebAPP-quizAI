# Buddy

Mobile-first quiz scanner built with Next.js using Gemini for OCR and DeepSeek for reasoning.

## Setup

Create a `.env.local` file with the following variables:

```
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-pro
DEEPSEEK_API_KEY=
DEEPSEEK_MODEL=deepseek-reasoner
CONF_THRESHOLD=0.72
MAX_RETRY=2
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Development

```bash
npm install
npm run dev
```

## API

`POST /api/analyze` with `{ imageBase64 }` returns `{ predicted, latencyMs }`.

## Production build

```bash
npm run build
npm start
```

Deploy on [Vercel](https://vercel.com) with default Next.js settings.
