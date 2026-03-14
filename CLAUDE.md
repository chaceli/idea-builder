# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

IDEA Builder is an AI-powered creative incubator that transforms ideas into patents, blueprints, or prompt templates. Bilingual support (English/Chinese) with light/dark themes.

**Frontend**: Modular ES Modules app in `js/` + `css/` + `index.html`
**Backend**: Node.js/Express/TypeScript API in `backend/` (optional, for advanced features)

## Commands

### Frontend
```bash
# Serve locally
npx serve .
# Or open directly
open index.html
```

### Backend
```bash
cd backend
npm install
npm run build     # Compile TypeScript
npm start         # Production (requires ts-node)
```

Note: Backend `npm run dev` and `npm test` are not configured in package.json.

### Deployment
Pushes to master branch auto-deploy to GitHub Pages via `.github/workflows/deploy.yml`.

## Frontend Architecture

### Module Structure
```
js/
├── main.js      # App entry point, initializes all modules
├── config.js    # STORAGE_KEYS, AI_PROVIDERS, translations (zh/en)
├── storage.js   # localStorage wrapper with namespaced keys
├── theme.js     # Light/dark mode toggle
├── i18n.js      # Internationalization (I18n.t('key'))
├── projects.js  # Project CRUD operations
├── ai.js        # AI API calls and demo mode fallbacks
└── ui.js        # Modal dialogs and DOM interactions
```

### Key Patterns

**Storage**: All localStorage keys use `idea-builder-` prefix (see `STORAGE_KEYS` in config.js).

**i18n**: Use `I18n.t('key')` for translations. Keys defined in `translations` object in config.js. Some keys use `data-i18n-html` for HTML content.

**AI Providers**: Frontend supports MiniMax and OpenAI via `AI_PROVIDERS` config. User selects provider stored in localStorage.

**Demo Mode**: When no API key configured, `ai.js` returns demo responses from `getDemoPromptResponse()`, `getDemoBlueprintResponse()`, `getDemoPatentResponse()`.

### UI Patterns
- CSS variables for theming in `css/styles.css`
- Modals: create, edit, detail, ai-generation modals
- Project cards with patent type tags (invention/utility/design)

## Backend Architecture

```
backend/src/
├── ai/adapters/     # Multi-provider AI adapters
│   ├── IAdapter.ts  # Interface + SUPPORTED_MODELS list
│   └── index.ts     # AdapterFactory
├── config/          # Environment config
├── controllers/     # Route handlers
├── db/              # Sequelize/MySQL, Redis
├── middleware/      # Auth, rate-limit, security, logging
├── models/          # User, Patent, PatentVersion, Memory, Message, ApiConfig, Schedule
├── routes/          # auth, chat, user, schedule, patent
├── services/        # AIService, PatentService, MemoryService, EmotionService, TTSService
└── utils/           # Utilities
```

### AI Adapter Pattern
- `IAdapter` interface: `chat(prompt, options)` and `validateKey(apiKey)`
- `AdapterFactory` creates adapter based on model ID
- Supported: MiniMax, OpenAI (GPT-4o), Anthropic (Claude), Google (Gemini)

## Environment Variables

Backend requires (see `backend/src/config/index.ts`):
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

See `PATENT_STRUCTURE.md` for full reference:
- **发明专利** (Invention Patent): 20 years protection
- **实用新型** (Utility Model): 10 years protection
- **外观设计** (Design Patent): 15 years protection

Document sections: 技术领域, 背景技术, 发明内容, 权利要求书, 说明书摘要