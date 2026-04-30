# v0-clone

> **⚠️ Developer Preview**: This SDK is currently in beta and is subject to change. Use in production at your own risk.

<p align="center">
    <img src="./screenshot.png" alt="v0 Clone Screenshot" width="800" />
</p>

<p align="center">
    A full-featured v0.dev clone built with Next.js, AI Elements, and the v0 SDK.
    Generate and preview React components with AI-powered streaming responses.
</p>

<p align="center">
  <a href="#features">Features</a> ·
  <a href="#architecture">Architecture</a> ·
  <a href="#setup">Setup</a> ·
  <a href="#api-reference">API Reference</a> ·
  <a href="#deployment">Deployment</a> ·
  <a href="#configuration">Configuration</a>
</p>
<br/>

## Overview

v0-clone is a production-ready clone of [v0.dev](https://v0.dev) that demonstrates how to build AI-powered UI generation applications. It provides real-time streaming responses with live code preview, multi-tenant support, and secure user authentication.

### Key Capabilities

- **AI-Powered Code Generation**: Generate React components and applications using natural language
- **Real-time Streaming**: See AI responses as they're generated
- **Live Preview**: Split-screen interface with code editor and live preview
- **Multi-User Support**: Secure multi-tenant architecture with rate limiting
- **API-Agnostic Design**: Easily switch between v0 API and custom backends

---

## Features

### Core Features

| Feature | Description |
|---------|-------------|
| **Streaming Responses** | Real-time AI response streaming with `experimental_stream` mode |
| **Live Preview** | Split-panel interface with resizable code/preview panes |
| **Image Attachments** | Upload images to guide AI code generation |
| **Voice Input** | Speech-to-text for hands-free prompting |
| **Chat History** | Persistent conversation history with ownership tracking |
| **Branch Navigation** | Browse alternative AI responses and branches |

### AI Elements Support

The app renders complex AI responses using modular components:

- **Reasoning** (`task-thinking-v1`): AI reasoning and thought processes with collapsible sections
- **Web Search** (`task-search-web-v1`): Search results with citations and summaries
- **Code Search** (`task-search-repo-v1`): Repository search with file path navigation
- **Diagnostics** (`task-diagnostics-v1`): Code analysis and issue detection
- **File Operations** (`task-read-file-v1`): File reading with syntax highlighting
- **Coding Tasks** (`task-coding-v1`): Code generation with file structure display
- **Design Inspiration** (`task-generate-design-inspiration-v1`): Design mood board generation
- **Graceful Fallback**: User-friendly display for unknown task types

### Authentication & User Management

| User Type | Rate Limit | Persistence | Features |
|-----------|-----------|-------------|----------|
| **Anonymous** | 3 chats/day | Session only | Rate-limited by IP |
| **Guest** | 5 chats/day | Auto-created account | Persistent during session |
| **Registered** | 50 chats/day | Permanent account | Full access across devices |

### API Features

- **Ownership Mapping**: Track user ↔ chat relationships
- **Privacy Controls**: Public, private, team, team-edit, unlisted
- **Chat Forking**: Duplicate chats with all history
- **Rate Limiting**: Per-user and per-IP limits
- **Error Handling**: Structured error responses with codes

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Pages    │  │ Components  │  │     AI Elements         │  │
│  │  /         │  │  ChatInput  │  │  Message, Reasoning,     │  │
│  │  /chats    │  │ ChatMessages│  │  Task, CodeBlock, etc.   │  │
│  │  /login    │  │ PreviewPanel│  │                         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                     Contexts & Hooks                              │
│  ┌─────────────────┐  ┌────────────────┐  ┌────────────────┐   │
│  │ StreamingContext│  │ useChat Hook   │  │ SWR Provider   │   │
│  │  (handoff/      │  │  (chat state) │  │  (data fetch)  │   │
│  │   stream)       │  │                │  │               │   │
│  └─────────────────┘  └────────────────┘  └────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │ API Routes
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API Routes (Next.js)                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │   /api/chat  │  │  /api/chats  │  │   /api/auth/*         │  │
│  │  POST: send  │  │  GET: list   │  │  Guest/Login/NextAuth  │  │
│  │  messages    │  │  user chats  │  │                       │  │
│  └──────────────┘  └──────────────┘  └────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                    Middleware Layer                               │
│  - Authentication verification                                   │
│  - Guest user detection (guest-*.@example.com)                 │
│  - Protected route redirection                                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    v0 SDK Client                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  createClient({ baseUrl: process.env.V0_API_URL })        │  │
│  │                                                           │  │
│  │  v0.chats.create({ message, responseMode })               │  │
│  │  v0.chats.sendMessage({ chatId, message })                │  │
│  │  v0.chats.getById({ chatId })                             │  │
│  │  v0.chats.fork({ chatId })                                │  │
│  │  v0.chats.update({ chatId, privacy })                     │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP/REST
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    v0 API / External Backend                     │
│         (or custom API via V0_API_URL environment variable)     │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼ (for authenticated users)
┌─────────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────┐  │
│  │     users       │  │     chats       │  │ messages       │  │
│  │  id (UUID)      │  │  id (v0 ID)     │  │  id (UUID)     │  │
│  │  email          │  │  user_id (FK)   │  │  chat_id (FK)  │  │
│  │  password (hash)│  │  title          │  │  role          │  │
│  │  created_at     │  │  parent_chat_id │  │  content       │  │
│  └─────────────────┘  │  visibility     │  │  created_at    │  │
│                       │  created_at     │  └────────────────┘  │
│  ┌─────────────────┐  │  updated_at     │                       │
│  │anonymous_chat_  │  └─────────────────┘  ┌────────────────┐  │
│  │logs             │                        │system_prompts │  │
│  │  id (UUID)      │  ┌─────────────────┐  │  id (UUID)     │  │
│  │  ip_address     │  │ llm_configura-  │  │  user_id (FK)  │  │
│  │  v0_chat_id     │  │ tions           │  │  name          │  │
│  │  created_at     │  │  id (UUID)      │  │  content       │  │
│  └─────────────────┘  │  user_id (FK)   │  │  created_at    │  │
│                        │  provider_name │  └────────────────┘  │
│                        │  active_model   │                       │
│                        │  api_key_encr..│                       │
│                        └─────────────────┘                       │
└─────────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App
├── SessionProvider (NextAuth)
├── SWRProvider (Data Fetching)
└── StreamingProvider (Real-time Updates)
    └── RootLayout
        ├── AppHeader
        │   ├── ChatSelector (authenticated users)
        │   ├── UserNav (Dropdown with sign-out)
        │   └── MobileMenu (mobile only)
        │
        └── Pages
            ├── Home (/)
            │   ├── PromptInput (textarea + toolbar)
            │   │   ├── PromptInputImagePreview
            │   │   ├── PromptInputTextarea
            │   │   └── PromptInputToolbar
            │   │       ├── PromptInputImageButton
            │   │       ├── PromptInputMicButton
            │   │       └── PromptInputSubmit
            │   ├── Suggestions (suggestion chips)
            │   └── [ChatInterface] (after first message)
            │       ├── ResizableLayout
            │       │   ├── ChatMessages
            │       │   │   ├── Conversation
            │       │   │   │   └── Message[]
            │       │   │   └── ChatInput
            │       │   └── PreviewPanel
            │       │       └── WebPreview iframe
            │       └── BottomToolbar (mobile)
            │
            ├── Chats (/chats)
            │   └── ChatsClient (chat list grid)
            │
            ├── ChatDetail (/chats/[chatId])
            │   └── ChatDetailClient
            │       ├── ChatMessages (with history)
            │       ├── ChatInput (with suggestions)
            │       ├── PreviewPanel
            │       └── useChat hook
            │
            ├── Login (/login)
            │   └── AuthForm (signin)
            │
            └── Register (/register)
                └── AuthForm (signup)
```

### Data Flow

#### 1. Anonymous User Chat Creation

```
User → / (homepage) → enters prompt → POST /api/chat
                                         │
                                         ▼
                               Rate limit check (by IP)
                                         │
                                         ▼
                               v0.chats.create()
                                         │
                                         ▼
                               createAnonymousChatLog()
                                         │
                                         ▼
                               Return { id, demo, messages }
                                         │
                                         ▼
                               Display in ChatInterface
```

#### 2. Authenticated User Chat

```
User → /login → credentials → NextAuth session → JWT token
                                                  │
                                                  ▼
User → / → enters prompt → POST /api/chat (with session)
                                  │
                                  ▼
                        Rate limit check (by userId)
                                  │
                                  ▼
                        v0.chats.create() / v0.chats.sendMessage()
                                  │
                                  ▼
                        createChatOwnership() → save to DB
                                  │
                                  ▼
                        Return stream → StreamingMessage component
```

#### 3. Streaming Response Flow

```
Request: POST /api/chat { message, streaming: true }
                │
                ▼
v0.chats.create({ responseMode: 'experimental_stream' })
                │
                ▼
ReadableStream<Uint8Array>
                │
                ▼
Response with headers:
  Content-Type: text/event-stream
  Cache-Control: no-cache
  Connection: keep-alive
                │
                ▼
StreamingMessage (client component)
  │ onChunk → hide external loader
  │ onComplete → update demo URL
  │ onChatData → create ownership
  ▼
Rendered content with AI Elements
```

---

## Setup

### Prerequisites

- **Node.js** 18.0+ (or 20.0+ recommended)
- **pnpm** 8.0+ (or npm/yarn)
- **PostgreSQL** 14.0+ (local or cloud)
- **v0 API Key** ([get from v0.app](https://v0.app/chat/settings/keys))

### Environment Variables

Create a `.env` file in the project root:

```bash
# Required
AUTH_SECRET=your-auth-secret-here
POSTGRES_URL=postgresql://user:password@localhost:5432/v0_clone
V0_API_KEY=your_v0_api_key_here

# Optional - Custom API endpoint
V0_API_URL=https://your-custom-api.com/v1

# Development (auto-set if missing)
NODE_ENV=development
```

#### Generating AUTH_SECRET

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### Database Connection Examples

```bash
# Local PostgreSQL
POSTGRES_URL=postgresql://postgres:password@localhost:5432/v0_clone

# Docker PostgreSQL
POSTGRES_URL=postgresql://postgres:password@localhost:5432/postgres

# Neon (Cloud PostgreSQL)
POSTGRES_URL=postgresql://user:password@ep-xxx-xxx-123456.us-east-2.aws.neon.tech/v0_clone?sslmode=require

# Supabase
POSTGRES_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
```

### Installation

```bash
# Clone or navigate to the project
cd v0-clone

# Install dependencies
pnpm install

# Generate database schema (creates migrations)
pnpm db:generate

# Apply migrations to database
pnpm db:migrate

# Start development server
pnpm dev
```

### Database Commands

```bash
pnpm db:generate   # Generate migration files from schema changes
pnpm db:migrate    # Apply pending migrations
pnpm db:push       # Push schema changes directly (dev only)
pnpm db:studio     # Open Drizzle Studio for inspection
```

---

## API Reference

### Authentication Endpoints

#### `GET /api/auth/guest`
Auto-create a guest user session.

**Response:** Redirect to homepage with guest session cookie

#### `POST /api/auth/[...nextauth]`
NextAuth.js handler for all authentication flows.

**Methods:** `GET` (session), `POST` (signin/signout)

---

### Chat Endpoints

#### `POST /api/chat`
Create a new chat or send a message to an existing chat.

**Request Body:**
```json
{
  "message": "Build a landing page with hero section",
  "chatId": "optional-existing-chat-id",
  "streaming": true,
  "attachments": [{ "url": "data:image/..." }]
}
```

**Response (non-streaming):**
```json
{
  "id": "chat_abc123",
  "demo": "https://preview.v0.dev/...",
  "messages": [...]
}
```

**Response (streaming):**
```
Content-Type: text/event-stream
[data] {"type":"chunk","content":"..."}
[data] {"type":"chunk","content":"..."}
[data] {"type":"complete","content":{...}}
```

#### `POST /api/chat/delete`
Delete a chat and its ownership record.

**Request Body:**
```json
{ "chatId": "chat_abc123" }
```

**Response:**
```json
{ "success": true }
```

#### `POST /api/chat/fork`
Duplicate a chat with all its messages.

**Request Body:**
```json
{ "chatId": "chat_abc123" }
```

**Response:**
```json
{
  "id": "new_chat_def456",
  "object": "chat",
  "...": "full chat object"
}
```

#### `POST /api/chat/ownership`
Create ownership record for an existing chat.

**Request Body:**
```json
{ "chatId": "chat_abc123" }
```

---

### Chats Endpoints

#### `GET /api/chats`
List all chats owned by the authenticated user.

**Response:**
```json
{
  "object": "list",
  "data": [
    {
      "id": "chat_abc123",
      "name": "Landing Page Project",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T11:45:00Z"
    }
  ]
}
```

#### `GET /api/chats/[chatId]`
Get details of a specific chat.

**Response:**
```json
{
  "id": "chat_abc123",
  "name": "Landing Page Project",
  "demo": "https://preview.v0.dev/...",
  "messages": [...],
  "latestVersion": {
    "demoUrl": "https://preview.v0.dev/..."
  }
}
```

#### `PATCH /api/chats/[chatId]/visibility`
Update chat privacy settings.

**Request Body:**
```json
{ "privacy": "public" }
```

**Privacy Options:**
- `private` - Only owner can access
- `public` - Anyone can view
- `team` - Team members can view
- `team-edit` - Team members can edit
- `unlisted` - Only with direct link

---

## Configuration

### Custom API Backend

Use `V0_API_URL` to point to a custom v0-compatible API:

```bash
V0_API_URL=http://localhost:3001/v1
```

The SDK client automatically uses the custom base URL:

```typescript
const v0 = createClient(
  process.env.V0_API_URL ? { baseUrl: process.env.V0_API_URL } : {}
)
```

### Rate Limiting

Configured in `lib/entitlements.ts`:

```typescript
export const entitlementsByUserType: Record<UserType, Entitlements> = {
  guest: { maxMessagesPerDay: 5 },
  regular: { maxMessagesPerDay: 50 },
}

export const anonymousEntitlements: Entitlements = {
  maxMessagesPerDay: 3,
}
```

### Middleware Configuration

Edit `middleware.ts` to customize route protection:

```typescript
// Protected routes requiring authentication
if (['/chats', '/projects'].some((path) => pathname.startsWith(path))) {
  return NextResponse.redirect(new URL('/login', request.url))
}

// Routes accessible without authentication
if (pathname === '/') return NextResponse.next()
```

---

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fv0-sdk%2Ftree%2Fmain%2Fexamples%2Fv0-clone&env=V0_API_KEY,AUTH_SECRET&envDescription=Get+your+v0+API+key&envLink=https%3A%2F%2Fv0.app%2Fchat%2Fsettings%2Fkeys&products=%255B%257B%2522type%2522%253A%2522integration%2522%252C%2522protocol%2522%253A%2522storage%2522%252C%2522productSlug%2522%253A%2522neon%2522%252C%2522integrationSlug%2522%253A%2522neon%2522%257D%255D&project-name=v0-clone&repository-name=v0-clone&demo-title=v0+Clone&demo-description=A+full-featured+v0+clone+built+with+Next.js%2C+AI+Elements%2C+and+the+v0+SDK&demo-url=https%3A%2F%2Fclone-demo.v0-sdk.dev)

### Manual Deployment

1. **Build the application:**
   ```bash
   pnpm build
   ```

2. **Set environment variables:**
   ```bash
   vercel env add AUTH_SECRET
   vercel env add POSTGRES_URL
   vercel env add V0_API_KEY
   ```

3. **Deploy:**
   ```bash
   vercel deploy
   ```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "start"]
```

---

## Project Structure

```
v0-clone/
├── app/
│   ├── (auth)/                 # Auth routes (login/register)
│   │   ├── actions.ts          # Server actions
│   │   ├── auth.config.ts      # NextAuth config
│   │   ├── auth.ts             # Auth exports
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── api/                    # API routes
│   │   ├── auth/               # Authentication APIs
│   │   ├── chat/               # Chat APIs
│   │   └── chats/              # Chat management APIs
│   ├── chats/                  # Chat pages
│   │   ├── page.tsx           # Chat list
│   │   └── [chatId]/page.tsx   # Individual chat
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Homepage
│   └── globals.css             # Global styles
│
├── components/
│   ├── ai-elements/            # AI Elements components
│   │   ├── actions.tsx
│   │   ├── branch.tsx
│   │   ├── code-block.tsx
│   │   ├── conversation.tsx
│   │   ├── image.tsx
│   │   ├── inline-citation.tsx
│   │   ├── loader.tsx
│   │   ├── message.tsx
│   │   ├── prompt-input.tsx
│   │   ├── reasoning.tsx
│   │   ├── response.tsx
│   │   ├── source.tsx
│   │   ├── suggestion.tsx
│   │   ├── task.tsx
│   │   ├── tool.tsx
│   │   └── web-preview.tsx
│   ├── chat/                   # Chat UI components
│   │   ├── chat-input.tsx
│   │   ├── chat-messages.tsx
│   │   └── preview-panel.tsx
│   ├── chats/                   # Chats page components
│   │   ├── chat-detail-client.tsx
│   │   └── chats-client.tsx
│   ├── shared/                  # Shared UI components
│   │   ├── app-header.tsx
│   │   ├── bottom-toolbar.tsx
│   │   ├── chat-menu.tsx
│   │   ├── chat-selector.tsx
│   │   ├── mobile-menu.tsx
│   │   └── resizable-layout.tsx
│   ├── ui/                      # shadcn/ui components
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   └── ...
│   ├── auth-form.tsx
│   ├── env-setup.tsx
│   ├── home/home-client.tsx
│   ├── message-renderer.tsx
│   ├── providers/
│   │   ├── session-provider.tsx
│   │   └── swr-provider.tsx
│   ├── shared-components.tsx
│   └── user-nav.tsx
│
├── contexts/
│   └── streaming-context.tsx   # Streaming state management
│
├── hooks/
│   └── use-chat.ts             # Chat state hook
│
├── lib/
│   ├── client-utils.ts         # Client-side utilities
│   ├── constants.ts           # App constants
│   ├── db/
│   │   ├── connection.ts     # Drizzle DB connection
│   │   ├── migrate.ts        # Migration runner
│   │   ├── queries.ts        # Database queries
│   │   ├── schema.ts         # Drizzle schema
│   │   └── utils.ts          # DB utilities
│   ├── entitlements.ts       # Rate limiting config
│   ├── env-check.ts          # Environment validation
│   ├── errors.ts             # Custom error classes
│   └── utils.ts              # General utilities
│
├── types/
│   └── global.d.ts           # Global type declarations
│
├── middleware.ts             # Next.js middleware
├── next.config.ts           # Next.js config
├── drizzle.config.ts         # Drizzle config
├── tsconfig.json            # TypeScript config
└── package.json
```

---

## Security

### Password Security
- Passwords hashed with bcrypt (cost factor 10)
- No plain-text password storage
- Secure session cookies

### Session Security
- JWT-based sessions with NextAuth.js v5
- HTTP-only cookies in production
- Guest detection via email pattern

### Database Security
- Parameterized queries via Drizzle ORM
- User data isolation via ownership mapping
- Cascade deletes for user cleanup

### API Security
- IP-based rate limiting for anonymous users
- User-based rate limiting for authenticated
- Ownership verification on all chat access

---

## Contributing

This is a demonstration project. For improvements:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## Resources

- [v0 SDK Documentation](https://v0-sdk.dev)
- [v0 Platform API](https://v0.dev/docs/api/platform)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [Vercel Deployment](https://vercel.com/docs)

---

## License

Copyright 2025 Vercel, Inc.

Licensed under the Apache License, Version 2.0.
