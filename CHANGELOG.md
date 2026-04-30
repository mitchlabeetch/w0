# v0-clone

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2025-04-30

### Major Changes

- **Repository Restructure**: Merged w0 subdirectory into root with all enhanced features
- **Enhanced Architecture**: Full multi-tenant support with IP-based rate limiting
- **Improved Streaming**: Real-time streaming with `experimental_stream` mode
- **Comprehensive AI Elements**: Full support for all task types with graceful fallback

### Added

- **API Routes**:
  - `/api/chat` - Chat creation with streaming and ownership tracking
  - `/api/chat/delete` - Chat deletion via v0 SDK
  - `/api/chat/fork` - Chat forking/duplication
  - `/api/chat/ownership` - Ownership record creation
  - `/api/chats` - User's chat listing
  - `/api/chats/[chatId]` - Individual chat access and updates
  - `/api/chats/[chatId]/visibility` - Privacy control (public/private/team)
  - `/api/auth/guest` - Guest auto-login
  - `/api/auth/[...nextauth]` - NextAuth v5 handlers

- **Components**:
  - AI Elements: Message, Conversation, Branch, Reasoning, Task, Tool, CodeBlock, etc.
  - Chat: ChatInput, ChatMessages, PreviewPanel with resizable layout
  - Shared: AppHeader, ChatSelector, BottomToolbar, MobileMenu
  - UI: Full shadcn/ui component library (15+ components)

- **Database Schema** (Drizzle ORM):
  - `users` - User accounts with email/password
  - `chats` - Chat ownership with visibility settings
  - `messages` - Chat messages with role support
  - `system_prompts` - Custom system prompts per user
  - `llm_configurations` - LLM provider settings
  - `anonymous_chat_logs` - Rate limiting for anonymous users

- **Authentication**:
  - Anonymous access (3 chats/day rate limit)
  - Guest auto-creation (5 chats/day)
  - Email/password registration (50 chats/day)
  - NextAuth.js v5 with JWT sessions

- **Features**:
  - Resizable split-panel interface
  - Image attachments for prompts
  - Voice input (Web Speech API)
  - Session persistence (sessionStorage)
  - Dark/light theme toggle

### Changed

- Updated README with comprehensive documentation
- Fixed Turbopack root configuration warning
- Improved error handling with ChatSDKError class
- Enhanced message preprocessing (V0_FILE markers cleanup)

## [0.3.4]

### Patch Changes

- Updated dependencies [5e7d77c]
  - v0-sdk@0.16.4

## 0.3.3

### Patch Changes

- Updated dependencies [38142c8]
  - v0-sdk@0.16.3

## 0.3.2

### Patch Changes

- Updated dependencies [da782c5]
  - v0-sdk@0.16.2

## 0.3.1

### Patch Changes

- Updated dependencies [c50eef6]
  - v0-sdk@0.16.1

## 0.3.0

### Minor Changes

- a1f8953: Updated API fields

### Patch Changes

- Updated dependencies [a1f8953]
  - @v0-sdk/react@0.5.0
  - v0-sdk@0.16.0

## 0.2.3

### Patch Changes

- c9a79cd: upgrade to latest next
- c20a71c: upgrade react to fix CVE-2025-55182
- Updated dependencies [c9a79cd]
- Updated dependencies [c20a71c]
  - @v0-sdk/react@0.4.1
  - v0-sdk@0.15.3

## 0.2.2

### Patch Changes

- Updated dependencies [bbb7c2f]
  - v0-sdk@0.15.2

## 0.2.1

### Patch Changes

- Updated dependencies [f6f5f5f]
  - v0-sdk@0.15.1

## 0.2.0

### Minor Changes

- d56f338: update usage, add authorId, add attachments

### Patch Changes

- 06a1262: fix ui streaming
- Updated dependencies [d56f338]
  - @v0-sdk/react@0.4.0
  - v0-sdk@0.15.0

## 0.1.7

### Patch Changes

- Updated dependencies [92db946]
  - v0-sdk@0.14.0

## 0.1.6

### Patch Changes

- Updated dependencies [df2abd4]
  - v0-sdk@0.13.0

## 0.1.5

### Patch Changes

- Updated dependencies [1e39cb3]
  - v0-sdk@0.12.0

## 0.1.4

### Patch Changes

- Updated dependencies [b60ec86]
  - v0-sdk@0.11.2

## 0.1.3

### Patch Changes

- 87e124b: fix unknown task parts
- Updated dependencies [87e124b]
  - @v0-sdk/react@0.3.1

## 0.1.2

### Patch Changes

- a032be1: use safe versions of esbuild/prismjs

## 0.1.1

### Patch Changes

- Updated dependencies [de90417]
  - v0-sdk@0.11.1
