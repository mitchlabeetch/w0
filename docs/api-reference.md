# API Reference

Complete API documentation for the v0-clone application.

## Table of Contents

- [Authentication](#authentication)
- [Chat Endpoints](#chat-endpoints)
- [Chats Endpoints](#chats-endpoints)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## Authentication

### GET /api/auth/guest

Create a guest user session and redirect to homepage.

### POST /api/auth/[...nextauth]

NextAuth.js handler for sign in, sign out, and session retrieval.

---

## Chat Endpoints

### POST /api/chat

Create a new chat or send a message to an existing chat.

**Request Body:**
- `message` (string, required) - User prompt
- `chatId` (string, optional) - Continue existing chat
- `streaming` (boolean, optional) - Enable streaming (default: true)
- `attachments` (array, optional) - Image attachments with url field

**Response (non-streaming):**
```json
{
  "id": "chat_abc123",
  "demo": "https://preview.v0.dev/...",
  "messages": [...]
}
```

**Response (streaming):**
- Content-Type: text/event-stream
- SSE format with chunk and complete events

### POST /api/chat/delete

Delete a chat via v0 API.

### POST /api/chat/fork

Fork/duplicate a chat with all messages.

### POST /api/chat/ownership

Create ownership record for existing chat.

---

## Chats Endpoints

### GET /api/chats

List all chats owned by authenticated user.

### GET /api/chats/[chatId]

Get details of a specific chat with ownership verification.

### PATCH /api/chats/[chatId]/visibility

Update chat privacy (public/private/team/unlisted).

---

## Error Handling

All errors follow consistent format with code, message, and optional details.

| Code | Status | Description |
|------|--------|-------------|
| rate_limit:chat | 429 | Rate limit exceeded |
| not_found:chat | 404 | Chat not found |
| forbidden:chat | 403 | Access denied |
| unauthorized:auth | 401 | Auth required |

---

## Rate Limiting

| User Type | Limit | Window |
|-----------|-------|--------|
| Anonymous | 3 chats | 24 hours |
| Guest | 5 chats | 24 hours |
| Registered | 50 chats | 24 hours |
