# Skunkworks

A distraction-free, cloud-first document editor where humans and AI collaborate in real time.

> Obsidian's simplicity × Google Docs' collaboration × AI agents as first-class participants.

---

## What is Skunkworks?

Skunkworks is a block-based document editor designed for the way knowledge work happens today — humans and AI working together. It combines:

- **Paper-clean writing experience** — Minimal UI, maximum focus
- **Real-time collaboration** — Multiplayer editing with live cursors
- **Native AI integration** — Jam, an AI chat sidebar that collaborates alongside you

---

## Features

### Editor
- Block-based editing with TipTap/ProseMirror
- Markdown shortcuts (`##`, `**bold**`, `-` lists, etc.) with live rendering
- `/` slash commands for headings, lists, code blocks, tables, and more
- Floating selection toolbar for formatting and AI actions
- Distraction-free mode — hide panels with `Cmd+\`
- File tree with folders and hierarchical document navigation
- Inter font throughout for clean, readable typography

### Real-Time Collaboration
- CRDT-based conflict-free sync via Y.js + Hocuspocus
- Live remote cursors with collaborator presence
- Authorship color bars showing who wrote what

### Jam — AI Chat Panel
- Slack-style message thread with user and AI messages
- User avatar (40×40, circular) + name + timestamp per message
- Chat input with auto-growing textarea (1–4 lines) and send on `Enter`
- Messages sent by the logged-in user appear instantly in the thread

### UI & Design System
- Three-panel floating card layout: Directory · Paper · Jam
- Token-based design system (`primitive → semantic → component`)
- Light and dark theme via CSS custom properties
- Framer Motion panel animations

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + TypeScript |
| Routing | React Router v7 |
| Editor | TipTap 2 (ProseMirror) |
| Real-time sync | Y.js + Hocuspocus WebSocket |
| Backend / DB | Convex (serverless) |
| Auth | Convex Auth + Google OAuth |
| Animation | Framer Motion |
| Styling | CSS Modules + design tokens |

---

## Local Development

### Prerequisites

- Node.js 18+
- A [Convex](https://convex.dev) account
- Google OAuth credentials (configured in Convex dashboard)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in values
cp .env.example .env.local

# 3. Start Convex backend
npx convex dev

# 4. Start the Hocuspocus collaboration server (separate terminal)
node hocuspocus-server.mjs

# 5. Start the frontend
npm run dev
```

### Environment Variables (`.env.local`)

```
VITE_CONVEX_URL=          # your Convex deployment URL
VITE_HOCUSPOCUS_URL=      # ws://localhost:1234 for local dev
CONVEX_DEPLOYMENT=        # dev:<your-deployment>
VITE_CONVEX_SITE_URL=     # your Convex site URL
```

> **Note:** If the Hocuspocus server is not running you will see WebSocket connection errors in the console. The editor and AI panel will still function, but real-time collaboration will be unavailable.

### Scripts

```bash
npm run dev        # start Vite dev server
npm run build      # type-check + production build
npm run typecheck  # TypeScript check without building
npm run test       # run Vitest tests
```

---

## Project Structure

```
src/
  app/               # Router, providers (Convex, theme)
  components/
    ai/              # AIPanel, ChatInput, UserMessage, AIMessage
    collaboration/   # AvatarStack, RemoteCursor
    editor/          # Editor, menus (SlashCommandMenu, SelectionToolbar)
    filetree/        # FileTree
    icons/           # SVG icon components
    layout/          # AppShell, LeftPanel, RightPanel, PaperTopBar
    ui/              # Base UI primitives (IconButton, etc.)
  features/
    auth/            # SignInPage
    workspace/       # WorkspacePage
    document/        # DocumentPage
  lib/               # convex client, yjs helpers, utils
  store/             # AppStore (React context)
  styles/
    tokens/          # primitive.css, semantic.css, component.css
convex/              # Convex backend (schema, queries, mutations, auth)
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Cmd/Ctrl + \` | Toggle panels |
| `/` | Slash command menu |
| `Enter` (in chat) | Send message |
| `Shift + Enter` (in chat) | New line in chat input |

---

## Roadmap

### POC (Current)
- [x] Block-based editor with markdown shortcuts
- [x] File tree and folder navigation
- [x] Three-panel layout with animations
- [x] Google OAuth sign-in
- [x] Y.js real-time sync foundation
- [x] Jam AI chat panel with message thread
- [x] Design token system (light + dark)

### MVP (Next)
- [ ] Inline AI invocation (`Cmd+K`)
- [ ] AI authorship color bars on blocks
- [ ] Inline comments and @-mentions
- [ ] Version history snapshots
- [ ] Public URL publishing

---

<p align="center">
  <i>A simple, beautiful place to write — with AI and your team.</i>
</p>
