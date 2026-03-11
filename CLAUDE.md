# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

IDEA Builder is an AI-powered creative idea generator that helps transform ideas into actionable project plans (including patent documents). The project has two main components:

- **Frontend**: Single-page application in `index.html` (HTML5 + CSS3 + Vanilla JavaScript)
- **Backend**: Node.js/Express/TypeScript API in `backend/` directory

## Commands

### Frontend
```bash
# Open directly in browser or serve locally
open index.html
# Or use any static server
npx serve .
```

### Backend
```bash
cd backend
npm install          # Install dependencies
npm run dev          # Development (uses nodemon + ts-node)
npm run build        # Build TypeScript
npm start            # Production
npm test             # Run tests (currently not configured)
```

### Deployment
- Frontend is deployed to GitHub Pages via `.github/workflows/deploy.yml`
- Pushes to master branch trigger automatic deployment

## Architecture

### Frontend (index.html)
Single-file application with embedded CSS and JavaScript:
- CSS Variables for theming (light/dark mode support)
- localStorage for data persistence
- Responsive design (Flexbox + Grid)
- Internationalization (English/Chinese)

### Backend Structure

```
backend/src/
├── ai/adapters/       # AI provider adapters (MiniMax, OpenAI, Claude, Gemini)
│   ├── IAdapter.ts    # Interface and supported models list
│   └── index.ts       # AdapterFactory for creating adapters
├── config/            # Environment configuration
├── controllers/       # Route handlers
├── db/                # Database connections (Sequelize/MySQL, Redis)
├── middleware/        # Express middleware (auth, rate-limit, security)
├── models/            # Sequelize models (User, Patent, Memory, etc.)
├── routes/            # Express routes
└── services/          # Business logic (AIService, PatentService, etc.)
```

### AI Provider Pattern

The backend uses an adapter pattern for multi-provider AI support:
- `IAdapter` interface defines `chat()` and `validateKey()` methods
- `AdapterFactory` creates appropriate adapter based on model ID
- Supported providers: MiniMax, OpenAI (GPT-4o), Anthropic (Claude), Google (Gemini)
- Model selection via `modelId` parameter in requests

### Key Services

- **AIService**: Orchestrates AI calls with memory context, emotion analysis, and TTS
- **PatentService**: Patent document generation and management
- **MemoryService**: Conversation history and semantic memory retrieval
- **EmotionService**: Sentiment analysis of responses
- **TTSService**: Text-to-speech synthesis

### Database Models

- `User` - User accounts
- `Patent` / `PatentVersion` - Patent documents with versioning
- `Memory` / `Message` - Conversation memory
- `ApiConfig` - User API key configurations
- `Schedule` - Scheduled tasks

## Environment Variables

Backend requires these environment variables (see `backend/src/config/index.ts`):
```
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ai_companion
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-secret-key
AI_API_KEY=
AI_BASE_URL=https://api.minimaxi.com/v1
AI_MODEL=MiniMax-M2.5
```

## Patent Document Structure

See `PATENT_STRUCTURE.md` for the complete patent document format:
- Chinese patent types: 发明专利 (20 years), 实用新型 (10 years), 外观设计 (15 years)
- Document structure: 技术领域, 背景技术, 发明内容, 权利要求书, 说明书摘要