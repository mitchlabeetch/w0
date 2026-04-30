# Components Reference

Documentation for v0-clone UI components.

## AI Elements

Components for rendering AI-generated content.

### Message

Renders individual chat messages.

```tsx
import { Message } from '@/components/ai-elements/message'

<Message from="user">Hello!</Message>
<Message from="assistant">
  <MessageRenderer content={content} />
</Message>
```

### Conversation

Container for chat message history with auto-scroll.

```tsx
import { Conversation, ConversationContent } from '@/components/ai-elements/conversation'

<Conversation>
  <ConversationContent>
    {messages.map((msg, i) => (
      <Message key={i} from={msg.role}>
        {msg.content}
      </Message>
    ))}
  </ConversationContent>
</Conversation>
```

### Reasoning

Collapsible section showing AI thought process.

```tsx
import { Reasoning, ReasoningTrigger, ReasoningContent } from '@/components/ai-elements/reasoning'

<Reasoning defaultOpen={false} duration={5}>
  <ReasoningTrigger title="Thinking" />
  <ReasoningContent>
    AI thought process content...
  </ReasoningContent>
</Reasoning>
```

### Task

Collapsible section for task status updates.

```tsx
import { Task, TaskTrigger, TaskContent, TaskItem, TaskItemFile } from '@/components/ai-elements/task'

<Task defaultOpen={true}>
  <TaskTrigger title="Building App" />
  <TaskContent>
    <TaskItem>Creating component structure...</TaskItem>
    <TaskItemFile>app/page.tsx</TaskItemFile>
  </TaskContent>
</Task>
```

### CodeBlock

Syntax-highlighted code with copy functionality.

```tsx
import { CodeBlock, CodeBlockCopyButton } from '@/components/ai-elements/code-block'

<CodeBlock code={codeString} language="typescript" showLineNumbers>
  <CodeBlockCopyButton />
</CodeBlock>
```

### WebPreview

iframe-based preview panel for generated code.

```tsx
import { WebPreview, WebPreviewNavigation, WebPreviewBody, WebPreviewUrl } from '@/components/ai-elements/web-preview'

<WebPreview defaultUrl={demoUrl}>
  <WebPreviewNavigation>
    <WebPreviewUrl readOnly value={demoUrl} />
  </WebPreviewNavigation>
  <WebPreviewBody src={demoUrl} />
</WebPreview>
```

### PromptInput

Chat input with image attachments and voice input.

```tsx
import { PromptInput, PromptInputTextarea, PromptInputSubmit, PromptInputImageButton, PromptInputMicButton } from '@/components/ai-elements/prompt-input'

<PromptInput onSubmit={handleSubmit}>
  <PromptInputTextarea 
    onChange={(e) => setMessage(e.target.value)}
    value={message}
    placeholder="What would you like to build?"
  />
  <PromptInputToolbar>
    <PromptInputTools>
      <PromptInputImageButton onImageSelect={handleImageSelect} />
    </PromptInputTools>
    <PromptInputTools>
      <PromptInputMicButton onTranscript={handleTranscript} />
      <PromptInputSubmit />
    </PromptInputTools>
  </PromptInputToolbar>
</PromptInput>
```

---

## Chat Components

### ChatMessages

Displays chat history with streaming support.

```tsx
import { ChatMessages } from '@/components/chat/chat-messages'

<ChatMessages
  chatHistory={chatHistory}
  isLoading={isLoading}
  currentChat={currentChat}
  onStreamingComplete={handleComplete}
  onChatData={handleData}
/>
```

### ChatInput

Input component with session persistence.

```tsx
import { ChatInput } from '@/components/chat/chat-input'

<ChatInput
  message={message}
  setMessage={setMessage}
  onSubmit={handleSubmit}
  isLoading={isLoading}
  showSuggestions={false}
/>
```

### PreviewPanel

Side panel showing live preview.

```tsx
import { PreviewPanel } from '@/components/chat/preview-panel'

<PreviewPanel
  currentChat={currentChat}
  isFullscreen={isFullscreen}
  setIsFullscreen={setIsFullscreen}
  refreshKey={refreshKey}
  setRefreshKey={setRefreshKey}
/>
```

---

## Shared Components

### AppHeader

Navigation header with user menu and chat selector.

```tsx
import { AppHeader } from '@/components/shared/app-header'

<AppHeader className="custom-class" />
```

### ResizableLayout

Split-panel layout with draggable divider.

```tsx
import { ResizableLayout } from '@/components/shared/resizable-layout'

<ResizableLayout
  leftPanel={<ChatPanel />}
  rightPanel={<PreviewPanel />}
  defaultLeftWidth={50}
  minLeftWidth={30}
  maxLeftWidth={70}
/>
```

### BottomToolbar

Mobile navigation for chat/preview switching.

```tsx
import { BottomToolbar } from '@/components/shared/bottom-toolbar'

<BottomToolbar
  activePanel="chat"
  onPanelChange={setActivePanel}
  hasPreview={!!currentChat}
/>
```

### ChatSelector

Dropdown for selecting between user's chats.

```tsx
import { ChatSelector } from '@/components/shared/chat-selector'

<ChatSelector />
```

### ChatMenu

Context menu for chat actions (delete, duplicate, visibility).

```tsx
import { ChatMenu } from '@/components/shared/chat-menu'

<ChatMenu chatId={chatId} />
```

### MobileMenu

Slide-out menu for mobile navigation.

```tsx
import { MobileMenu } from '@/components/shared/mobile-menu'

<MobileMenu onInfoDialogOpen={() => setShowInfo(true)} />
```

---

## UI Components

Full shadcn/ui component library:

- `Button` - Button with variants (default, destructive, outline, ghost, link)
- `Input` - Text input field
- `Textarea` - Multi-line text input
- `Dialog` - Modal dialog
- `DropdownMenu` - Dropdown menu with triggers and items
- `Select` - Select dropdown with options
- `Tooltip` - Tooltip overlay
- `Avatar` - User avatar with image and fallback
- `Badge` - Label badge
- `Collapsible` - Collapsible content section
- `ScrollArea` - Scrollable area
- `Carousel` - Image/content carousel
- `HoverCard` - Hover-triggered card
