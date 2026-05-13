# Supplement Review System

An AI-powered nutraceutical formulation analysis and review platform built with **Next.js 16**, **TypeScript**, and **Google Gemini AI**.

## Features

- **Structured Ingredient Extraction** - Automatically parses and structures ingredient data from free-text input
- **Risk Assessment** - Identifies unusual or risky dosages and ingredients with severity ratings
- **Formulation Observations** - Detects synergies, redundancies, gaps, safety concerns, efficacy issues, and stability problems
- **Marketing Claims Review** - Flags potentially problematic or unsubstantiated marketing claims with regulatory references
- **AI Review Summary** - Generates professional-grade review summaries using Gemini 2.5 Flash
- **Semantic Ingredient Search** - Natural language ingredient search powered by Gemini embeddings and cosine similarity
- **Dark/Light Theme** - Full support for both light and dark modes with system preference detection
- **Local Storage** - Analysis history and API keys stored locally in the browser
- **Export Results** - Download analysis results as JSON

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| UI Components | Radix UI + Custom Components |
| Animations | Framer Motion |
| Icons | Lucide React |
| AI/ML | Google Gemini 2.5 Flash + Embedding-2 |
| Validation | Zod |

## Architecture

```
supplement-review-system/
├── app/                          # Next.js App Router
│   ├── api/
│   │   ├── analyze/route.ts      # Formulation analysis API
│   │   ├── search/route.ts       # Semantic search API
│   │   └── validate/route.ts     # Ingredient validation API
│   ├── analyze/page.tsx          # Analysis form page
│   ├── search/page.tsx           # Semantic search page
│   ├── history/page.tsx          # Analysis history page
│   ├── settings/page.tsx         # Settings page
│   ├── layout.tsx                # Root layout with theme provider
│   ├── page.tsx                  # Dashboard
│   ├── loading.tsx               # Loading state
│   └── not-found.tsx             # 404 page
├── components/
│   ├── ui/                       # Reusable UI primitives
│   ├── analyze/                  # Analysis-specific components
│   ├── search/                   # Search-specific components
│   └── layout/                   # Layout components (Sidebar, Header, etc.)
├── hooks/                        # Custom React hooks
├── lib/                          # Utility libraries
│   ├── gemini.ts                 # Gemini API client (REST)
│   ├── vector-store.ts           # In-memory vector store with embeddings
│   ├── utils.ts                  # Utility functions
│   └── constants.ts              # App constants
├── types/                        # TypeScript type definitions
└── public/                       # Static assets
```

## AI/ML Components

1. **Gemini 2.5 Flash** - Powers the formulation analysis with structured JSON output using response schemas
2. **Gemini Embedding-2** - Generates 768-dimensional embeddings for semantic ingredient search
3. **Vector Search** - Cosine similarity matching against a seed database of 35+ supplement ingredients
4. **Structured Output** - Zod-validated JSON responses for reliable data extraction

## Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API Key (free tier available)

### 1. Clone and Install

```bash
cd supplement
npm install
```

### 2. Configure API Key

Get your free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

You can set it in two ways:

**Option A: Via UI (Recommended)**
- Run the app
- Click "Set API Key" in the top-right header
- Paste your key - it's stored in localStorage only

**Option B: Environment Variable (Optional)**
```bash
cp .env.local.example .env.local
# Edit .env.local and add your key
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## Usage

### Analyze a Formulation

1. Navigate to **Analyze** from the sidebar
2. Enter product name and select category
3. Input ingredient list (one per line with dosages)
4. Optionally add marketing claims to review
5. Click **Analyze Formulation**
6. Review structured results across tabs: Ingredients, Observations, Claims, AI Review

### Semantic Search

1. Navigate to **Semantic Search**
2. Type natural language queries like:
   - "ingredients related to sleep support"
   - "natural supplements for cognitive enhancement"
   - "adaptogens for stress management"
3. Results are ranked by semantic similarity using Gemini embeddings

### View History

All analyses are saved to browser localStorage and can be viewed on the **History** page.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analyze` | POST | Full formulation analysis |
| `/api/search` | POST | Semantic ingredient search |
| `/api/validate` | POST | Single ingredient validation |

### Example: Analyze Request

```json
POST /api/analyze
{
  "productName": "SleepWell Pro",
  "category": "Sleep Support",
  "ingredientsText": "Melatonin - 3mg\nMagnesium Glycinate - 400mg\nL-Theanine - 200mg",
  "marketingClaims": "Promotes deep sleep\nNon-habit forming",
  "apiKey": "your_gemini_api_key"
}
```

### Example: Search Request

```json
POST /api/search
{
  "query": "ingredients related to sleep support",
  "apiKey": "your_gemini_api_key",
  "topK": 5
}
```

## Design Decisions

- **No gradients** - Clean, modern flat design with solid colors
- **Component architecture** - Every UI element is a reusable, typed component
- **Client-side API calls** - API keys stay in the browser; no server-side secrets needed
- **In-memory vector store** - Embeddings cached in localStorage for fast repeated searches
- **Framer Motion** - Smooth page transitions and micro-interactions
- **Radix UI primitives** - Accessible, unstyled components as building blocks