# Skunkworks

A distraction-free, cloud-first document editor where humans and AI agents collaborate in real time.

> Obsidian's simplicity × Google Docs' collaboration × AI agents as first-class participants.

---

## ✨ What is Skunkworks?

Skunkworks is a block-based document editor designed for the way knowledge work happens today—humans and AI working together. It combines:

- **Paper-clean writing experience** — Minimal UI, maximum focus
- **Real-time collaboration** — Multiplayer editing with live cursors and inline comments
- **Native AI integration** — Agents that collaborate inline, not in sidebars

Whether you're a solo writer seeking focus, a team collaborating on documents, or an AI power user, Skunkworks adapts to your workflow.

---

## 🚀 Features

### Core Editor
- **Block-based editing** — Every element is a manipulable block with unique ID
- **Markdown-native** — Write in markdown with live rendering (no preview pane needed)
- **Slash commands** — Type `/` for quick insertion of headings, lists, code blocks, tables, and more
- **Selection toolbar** — Floating toolbar on text selection for formatting and AI actions
- **Keyboard-first** — Every action accessible via keyboard shortcuts
- **Distraction-free mode** — Hide sidebars with `Cmd+\` for pure focus
- **File tree navigation** — Hierarchical folder structure with tabbed document editing

### Real-Time Collaboration
- **Live co-editing** — CRDT-based conflict resolution with real-time cursors
- **Share by link** — Instant sharing with view/comment/edit permissions
- **Inline comments** — Threaded discussions with @-mentions
- **Presence indicators** — See who's viewing and editing in real time
- **Version history** — Automatic snapshots with diff comparison and restore (Pro)

### AI Agent Integration
- **Inline AI invocation** — Select any block and invoke AI via `Cmd+K` or toolbar
- **Agent as collaborator** — AI edits marked with visual provenance (color trails)
- **System prompts** — Define document-level personas for consistent AI assistance
- **Background tasks** — Fire off AI work and continue writing (Pro)
- **Bring Your Own Model** — Connect your own Claude, GPT, or OpenAI-compatible API (Pro)

### Publishing
- **Public URLs** — One-click publish documents to clean, readable pages (Pro)
- **Custom domains** — Use your own domain for published content (Pro)
- **Documentation sites** — Publish folders as structured documentation (Pro)

---

## 🎯 Use Cases

| Persona | Needs | How Skunkworks Helps |
|---------|-------|---------------------|
| **Solo Thinker** | Focus, speed, markdown | Distraction-free mode, keyboard shortcuts, clean typography |
| **Team Collaborator** | Real-time editing, comments | Live cursors, inline comments, frictionless sharing |
| **AI Power User** | Inline AI, BYOM | Agent collaboration, custom models, background tasks |

---

## 💻 Getting Started

### Web App

1. Visit [app.skunkworks.io](https://app.skunkworks.io) (placeholder)
2. Sign up with email, Google, or GitHub
3. Start with a blank document or choose a template
4. Press `/` to explore block types or just start typing

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + \` | Toggle distraction-free mode |
| `Cmd/Ctrl + K` | Open command palette / AI invocation |
| `/` | Slash commands for block insertion |
| `Cmd/Ctrl + Shift + P` | Quick navigation |
| `@` | Mention collaborators |

---

## 🏗️ Architecture

Skunkworks is built with modern web technologies:

- **Frontend:** React (Next.js) + Tailwind CSS
- **Editor:** TipTap/ProseMirror for block-based editing
- **Real-time sync:** Y.js CRDT with WebSocket transport
- **Backend:** PostgreSQL for metadata, object storage for document state
- **AI:** Server-side LLM proxy with streaming responses

---

## 📋 Roadmap

### MVP (Current)
- [x] Block-based editor with markdown
- [x] Real-time collaboration
- [x] Inline AI invocation
- [x] File tree and organization
- [x] Share by link

### Coming Soon
- [ ] Version history and diffs
- [ ] Bring Your Own Model (BYOM)
- [ ] Public URL publishing
- [ ] Extension API
- [ ] Custom themes

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

---

## 📄 License

[MIT License](LICENSE)

---

## 🙏 Acknowledgments

Built with inspiration from:
- Obsidian — for the love of markdown and local-first
- Notion — for block-based editing done right
- Google Docs — for setting the collaboration standard

---

<p align="center">
  <i>A simple, beautiful place to write — with AI and your team.</i>
</p>
