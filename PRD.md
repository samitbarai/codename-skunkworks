# Product Requirements Document
## Collaborative AI-Native Document Editor

**Codename:** Skunkworks
**Status:** Draft | **Version:** 0.4 | **Date:** March 19, 2026
**Team:** Shekhar, Anirudh, Harsh, Arnab, Samit

> *A distraction-free, cloud-first writing surface where humans and AI agents collaborate in real time.*

---

## 1. Executive Summary

Knowledge workers today are forced to choose between tools that are good for writing (Obsidian, iA Writer), good for collaboration (Google Docs, Notion), or good for AI assistance (ChatGPT, Claude). No single product unifies all three into a seamless experience.

This product is a cloud-first, block-based document editor that brings together a paper-clean writing surface, real-time multi-user collaboration, and deep AI agent integration. The core bet is that the document editor is the natural home for AI-assisted knowledge work — not chat windows, not sidebars, but inline, block-level collaboration between humans and AI.

**One-liner:** Obsidian's simplicity × Google Docs' collaboration × AI agents as first-class participants.

---

## 2. Problem Statement

### Who we're building for

Knowledge workers — engineers, PMs, writers, marketers, founders — who spend significant time writing, thinking, and collaborating on documents. They're frustrated by:

- **Obsidian** is powerful but local-only and single-player. Collaboration is an afterthought.
- **Google Docs** is collaborative but bloated, cluttered, and has zero AI-native capabilities.
- **Notion** is flexible but slow, over-structured, and treats AI as a bolt-on feature.
- **AI chat tools** (ChatGPT, Claude) produce text in isolation — the output still needs to be copy-pasted into a real document.

### Core insight

Writing is increasingly a human + AI activity. The editor itself should treat AI agents as collaborators, not external tools. A block-based architecture makes this natural: any block can be authored, edited, or reviewed by either a human or an agent, with full provenance.

---

## 3. Product Vision

The product should feel like a blank sheet of paper when you open it. No toolbars, no sidebar clutter, no distractions. Just a clean center-stage writing surface. Then, when you need power, everything is a keystroke away: collaborators appear, AI agents assist inline, a file tree slides in, and comments thread alongside your text.

### Design Principles

| Principle | What it means in practice |
|---|---|
| **Paper-first** | Default state is a white, distraction-free canvas. Both sidebars hidden. Serif or clean sans-serif typography. Generous whitespace. |
| **Progressive disclosure** | Features reveal themselves contextually — slash commands, selection toolbars, keyboard shortcuts. Never a cluttered toolbar. |
| **AI as collaborator** | Agents operate on the same block primitives as humans. Their edits show provenance (color trails). They can be invoked on any selected block. |
| **Keyboard-native** | Every action reachable via keyboard. Slash commands for block types. Cmd+K for AI. Every feature has a shortcut. |
| **Collaboration without friction** | Real-time cursors, unified chat panel, @-mentions. Share a link and someone's in. No setup, no invitations flow. |

---

## 4. User Personas

### The Solo Thinker

Writers, researchers, developers who currently use Obsidian/iA Writer/Typora. They want **markdown support, distraction-free mode, file/folder organization,** and the option to call in an AI agent when they're stuck. They care about speed, keyboard shortcuts, and not being forced into a complex UI.

### The Team Collaborator

PMs, marketers, ops teams currently on Google Docs/Notion. They need **real-time co-editing, comments, @-mentions, and share-by-link.** They want the simplicity of a doc without the bloat of a full workspace tool.

### The AI Power User

Early adopters who already use Claude/ChatGPT daily. They want **inline AI that understands context, can edit specific blocks, and runs in the background.** Bring-your-own-model (BYOM) is a differentiator for this persona.

---

## 5. Feature Requirements

Requirements are organized by priority:
- **P0** = Must-have for MVP launch
- **P1** = Needed within 4 weeks of launch
- **P2** = Planned for v2

### 5.1 Core Editor

| # | Requirement | Details | Priority |
|---|---|---|---|
| E1 | Block-based editing | Every content unit is a block with a unique ID. Blocks are the primitive for all operations: editing, AI, comments, versioning. | **P0** |
| E2 | Markdown authoring | Inline markdown syntax (headings, bold, italic, code, links, lists). Rendered in real time — no separate preview pane. Edit mode shows markdown syntax with live rendering. | **P0** |
| E3 | Slash commands | Type `/` to insert block types: headings (H1–H3), bullet list, numbered list, code block, quote, divider, image, callout, table, AI prompt block. | **P0** |
| E4 | Selection toolbar | On text selection, a floating toolbar appears with: bold, italic, code, link, highlight, "Send to chat" (quotes the selection into the chat panel), and "Ask AI" (invokes inline AI edit). | **P0** |
| E5 | Keyboard shortcuts | Full keyboard navigation. Every feature accessible via shortcut. Cmd/Ctrl+K for command palette. Shortcut discoverability via tooltip on hover. | **P0** |
| E6 | Distraction-free mode | Both sidebars hide-able (Cmd+\\). Center-stage writing with generous whitespace. Option to hide everything except the text. | **P0** |
| E7 | File tree / directory | Left sidebar: hierarchical file/folder structure. Create, rename, move, delete files and folders. Open multiple files in tabs. | **P0** |
| E8 | Typography & theming | Clean serif or sans-serif defaults. Light and dark themes. Customizable font, size, line height. The goal: "beautiful as a printed page." | **P1** |

### 5.2 Real-Time Collaboration

| # | Requirement | Details | Priority |
|---|---|---|---|
| C1 | Real-time co-editing | CRDT-based conflict resolution. Live cursors with names/colors for each collaborator. No lag on concurrent edits. When a user selects a block/text, it is soft-locked to prevent conflicting edits (same behavior as Google Docs). | **P0** |
| C2 | Share by link | Copy a shareable link to invite collaborators. Two access levels: view-only and can-edit. View-only users can read the document but cannot edit or participate in chat. No account required to view. | **P0** |
| C3 | Chat-based commenting | There is no separate commenting system. All commenting happens via the right-side chat panel. Users select text → quote it into the chat → add their message or @-mention a collaborator. This unifies human-to-human and human-to-AI interaction into one thread per document. Click a quoted reference in chat to scroll to the source text in the document. | **P0** |
| C4 | Presence indicators | Show who is currently viewing/editing. Avatar stack in header. Cursor position visible to all. Show which block a collaborator is currently working on. | **P0** |
| C5 | Edit history / versioning | Automatic version snapshots. View history, compare diffs, restore previous versions. Track who changed what and when. | **P2** |
| C6 | Authorship color bars | Every block displays a thin vertical color bar on its left edge indicating who authored or last edited it. Each collaborator (human or AI) gets a unique color. At a glance, a reader can see which parts were written by whom. Hovering the bar shows the author name/model and timestamp. Colors are consistent per user across the document. AI agents get a distinct color to differentiate from human collaborators. This is a visual hook for the product — the color trail creates a distinct, recognizable aesthetic. | **P0** |
| C7 | Text reference in chat panel | Select any chunk of text in the document → send it as a quoted reference to the right-side chat panel (for AI or collaborators). The selected text appears as an embedded blockquote in the chat thread, preserving context. Users can add an instruction alongside the quote (e.g., "rewrite this paragraph in active voice" or "@Harsh can you review this section?"). The quoted text in the chat panel is a live link — clicking it scrolls the document to the referenced passage and highlights it. Works for both AI invocation and human collaboration. | **P0** |

### 5.3 AI Agent Integration

> **v0 decision:** The AI model is **hard-coded to Claude (Sonnet)** using team-managed API credits. No model selection UI, no BYOM, no custom system prompts for v0. The goal is to prove the core experience: humans and one AI agent collaborating in the same document. Model flexibility comes later.

| # | Requirement | Details | Priority |
|---|---|---|---|
| A1 | Inline AI invocation | Select text or a block → invoke AI via keyboard shortcut or selection toolbar ("Ask AI"). Agent reads context of the selected content + surrounding blocks, produces edits. The AI is treated as just another user in the collaboration system — same primitives, same presence model. | **P0** |
| A2 | Inline diff & accept/reject | AI edits appear as an **inline diff** (Cursor-style) — the original text and proposed changes are shown vertically with clear visual distinction. The user can accept or reject the changes. Until accepted, the changes are not written to the document and are invisible to other collaborators. This is the core interaction pattern for AI editing. | **P0** |
| A3 | AI edit queueing | When multiple users invoke AI edits on the same document concurrently, edit requests are queued. Only one AI edit can be written to the document at a time. Each user sees their own diff independently, but actual document writes are serialized. Combined with the soft-lock on selected text (C1), this prevents merge conflicts. | **P0** |
| A4 | Agent as collaborator | AI edits are treated as first-class contributions with full provenance. The AI agent appears as a named participant (e.g., "Claude") in the chat panel and presence indicators. Its contributions are marked with the AI authorship color bar (C6). | **P0** |
| A5 | System prompt / persona | Users can define a system prompt per document or workspace. The agent carries this context into every invocation (e.g., "You are a technical writer. Use concise, active voice."). Document owner controls the prompt; all collaborators share it. | **P1** |
| A6 | Bring Your Own Model (BYOM) | Users can plug in their own API key for Claude, GPT, Gemini, or any OpenAI-compatible endpoint. Model is scoped per document — the document owner (or any editor) sets the model, and all collaborators in that document use it. | **P1** |
| A7 | Background agent runs | Ability to fire off an AI task on a block and continue writing. Agent works in the background; result appears when ready. User can accept/reject the changes. | **P2** |
| A8 | Web search capability | Agent can optionally search the web for up-to-date information when composing or editing. Research mode. | **P2** |
| A9 | Cross-block / cross-doc context | Agent can reference other blocks or documents in the workspace. "Summarize the key points from my meeting notes doc and add them here." | **P2** |

### 5.4 Publishing & Sharing

| # | Requirement | Details | Priority |
|---|---|---|---|
| S1 | Publish to public URL | One-click publish a document to a clean, readable public URL. Basic implementation: a simple public link that renders the document in read-only mode. No custom domains or SEO optimization for v0. | **P1** |
| S2 | Blog / portfolio use case | Published pages should be beautiful enough to serve as a personal blog or portfolio. Marketing teams can use it for content. Supports custom themes and custom domains. | **P2** |
| S3 | Documentation site | Publish a folder as a documentation site with sidebar navigation. Useful for internal wikis or public API docs. | **P2** |

### 5.5 Extensions & Plugins

| # | Requirement | Details | Priority |
|---|---|---|---|
| X1 | Extension API | Plugin system for custom block types, themes, slash commands, and integrations. Community-driven ecosystem (Obsidian-inspired). | **P2** |
| X2 | Custom themes & wallpapers | Users can install or create custom themes. Include a set of curated background/wallpaper options for the writing surface (Creative Commons licensed). | **P2** |

---

## 6. Information Architecture

### App Layout

The application uses a three-panel layout, with both side panels collapsible:

- **Left panel (collapsible):** File tree / directory. Workspace navigation. Search.
- **Center stage:** The document. Block-based editor. This is the hero — maximum whitespace, minimal chrome.
- **Right panel (collapsible):** Unified chat + AI panel. This panel has two views, switchable via tabs or an icon toggle: (1) **Chat** — the main thread where text references, AI responses, and @-mentions appear. Users select text in the editor and send it as a quoted reference here — for AI instructions ("rewrite this") or collaborator messages ("@Harsh review this"). (2) **Document settings (ℹ️ icon)** — shows and allows editing of the document's AI model configuration and custom instructions (system prompt). The document owner or any editor can change these. This keeps all document-level AI configuration in context, not buried in a global settings page.

Default state on first open: both sidebars hidden. Just the center writing surface with a minimal top bar (document title, share button, avatar stack).

### Starting Experience

The landing page **is** the product. When a user visits for the first time:

1. They immediately get a clean, blank writing surface with a blinking cursor. No login required.
2. AI is available out of the box — they can start writing and invoke the AI agent immediately.
3. Their work is stored in the browser's local storage until they log in.
4. Login (email, Google, GitHub) is prompted only when the user wants to **save to cloud** or **share/collaborate** — "To save and collaborate, sign in."
5. This means the first-time experience is zero-friction: open the URL, start writing with AI, feel the magic, *then* decide to sign up.

Feature discovery happens progressively — tooltips on first use of slash commands, first collaboration invite, first AI invocation.

### Block Model

Every piece of content is a block. Blocks are the atomic unit for:

- **Editing:** Select, move, duplicate, delete at block level.
- **AI operations:** Invoke AI on a block. Agent edits are scoped to blocks.
- **Collaboration:** Comments attach to blocks. Presence shows which block a collaborator is editing.
- **Authorship:** Each block tracks its author (human or AI). A color-coded vertical bar on the left edge provides at-a-glance attribution — each collaborator and the AI agent gets a unique color.
- **Referencing:** Blocks have stable IDs. Can be linked to from other documents, referenced by agents, or quoted into the chat panel as context for AI or collaborator conversations.
- **Versioning:** *(P2)* Block-level change history. Who changed this block and when.

Block types supported at MVP: paragraph, heading (H1–H3), bullet list, numbered list, code block, quote, divider, image, callout.

---

## 7. Technical Architecture (High-Level)

*Detailed technical design will be a separate document.*

### Editor Framework

**TipTap** (built on ProseMirror) is the recommended editor framework. It provides block-based editing, markdown support, slash commands, collaboration (via Y.js), and is extensible. TipTap also offers built-in support for comments, AI toolkit, and custom components.

> ⚠️ **Cost note:** TipTap's cloud/collaboration pricing scales aggressively (~$150 at 5,000 documents). For v0, we use the open-source TipTap core + self-managed Y.js sync. The paid TipTap Cloud features are not needed at this stage. Evaluate if costs become a concern at scale.

### Real-Time Sync

CRDT-based (**Y.js**) for conflict-free real-time collaboration. Y.js integrates with TipTap via **Hocuspocus** as the sync provider. WebSocket-based transport.

### Backend & Data

For the POC/MVP, we prioritize speed-to-launch and minimal infrastructure overhead. **Convex** is the recommended backend platform — it provides real-time reactive queries, built-in auth, file storage, and serverless functions out of the box, eliminating the need to stitch together a database, WebSocket server, and API layer separately.

- **Convex** handles: real-time data sync, document metadata & file tree, user auth (integrates with Clerk/Auth0 for social login + magic links), file storage for assets/images, and serverless functions for AI proxy logic.
- **Y.js** still manages the CRDT document state for the editor (Convex handles the persistence layer for Y.js document snapshots).
- **AI integration:** Convex actions (serverless functions) proxy requests to the Anthropic API. v0 uses a **team-managed Anthropic API key** with Claude Sonnet (and optionally Opus) hard-coded — no user-facing model selection. The team will provision ~$100 in API credits for initial usage. BYOM key management is deferred to P1.
- **Migration path:** If the product outgrows Convex (scale, cost, or customization needs), the architecture can migrate to a self-hosted stack (PostgreSQL + custom WebSocket server + S3) without rewriting the frontend or editor layer.

### Frontend

- React SPA (Vite) — no server-side rendering needed. Desktop-first, mobile-responsive.
- TipTap editor component (open-source core).
- **Base UI** (Radix-based component library) for UI primitives. Tailwind CSS for styling.
- Convex React client for real-time data binding (file tree, chat, presence, AI responses).

---

## 8. Go-To-Market Strategy

Inspired by the viral launch patterns discussed (FreeWrite, Notion's early growth), the GTM is built around simplicity, visual appeal, and community.

### Positioning

**Tagline:** "A simple, beautiful place to write — with AI and your team."

Key messaging pillars:

- **Free and clean.** No subscriptions for core writing. No clutter. Just write.
- **AI-native, not AI-bolted.** Your AI collaborator lives in the document, not in a sidebar chat.
- **Collaboration without the bloat.** Real-time co-editing without becoming a project management tool.

### Launch Plan

1. **Teaser video (Week −2):** 30–60 second screen recording showing the clean writing experience. No voiceover, just ambient music and typing. Minimal, aspirational. Post on X/Twitter.
2. **Introduction blog post (Week −1):** Published on the product itself (dogfooding the publish feature). "We built the editor we wished existed." Story-driven, not feature-driven.
3. **Public launch (Day 0):** Free sign-up. Shareable link to a sample collaborative document so people can try it instantly. Post on Hacker News, Product Hunt, X/Twitter.
4. **Community seeding (Week +1):** Target writing communities, Obsidian forums, indie hacker groups, dev communities. Invite writers/bloggers to publish on the platform.

### Pricing (Tentative)

| Tier | Includes | Price |
|---|---|---|
| **Free** | Unlimited docs, basic collaboration (up to 3 editors), limited AI credits/month, publish to public URL. | $0 |
| **Pro** | Unlimited collaborators, BYOM support, version history, priority AI, custom domains for published pages. | $8–12/user/month |
| **Team** | Workspace admin, SSO, shared templates, team-wide AI personas, analytics. | $15–20/user/month |

---

## 9. Success Metrics

### Leading Indicators

| Metric | Target (Month 1) | Target (Month 3) |
|---|---|---|
| Sign-ups | 1,000 | 10,000 |
| Documents created | 5,000 | 50,000 |
| Docs with 2+ collaborators | 15% of all docs | 30% of all docs |
| AI invocations per active user/week | 3 | 8 |
| D7 retention | 25% | 40% |

### Lagging Indicators

- Monthly Active Users (MAU) and Weekly Active Users (WAU)
- Free-to-Pro conversion rate (target: 5–10% by month 6)
- Net Promoter Score (NPS) > 50
- Published pages created (a viral loop indicator)

---

## 10. Risks & Mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| Editor performance at scale (large docs, many collaborators) | 🔴 High | Benchmark early with 50+ page docs and 10+ concurrent editors. Use Y.js sub-documents if needed. Lazy-load blocks outside viewport. |
| TipTap licensing costs at scale | 🟡 Medium | Use open-source TipTap core for v0. Monitor document count. Evaluate alternatives (BlockNote, ProseMirror direct) if pricing becomes prohibitive. |
| Crowded market (Notion, Docs, Obsidian, new AI editors) | 🟡 Medium | Differentiate on the intersection: writing quality + collab + AI. None of the incumbents do all three well. Speed of iteration is our moat. |
| Y.js + Convex integration complexity | 🟡 Medium | Needs a spike. If Convex can't cleanly persist Y.js state, may need a lightweight Hocuspocus server alongside. Harsh to evaluate early. |
| AI edit conflicts with concurrent users | 🟡 Medium | Queueing + soft-lock design (A3, C1) should handle this. But real-world testing with 3+ simultaneous AI invocations is critical before launch. |
| Scope creep (team adding features mid-sprint) | 🟡 Medium | PRD is the contract. Section 5 priority tables are the reference. No feature additions without team agreement. Shekhar's role: ruthlessly cut scope. |
| "Big company mentality" slowing down a skunkworks project | 🟡 Medium | This is a pilot, not a product launch. Optimize for learning speed, not production readiness. Throwaway code is acceptable. |

---

## 11. MVP Scope Summary

> **Guiding principle:** The v0 must produce a first-time "wow" moment. That wow = opening a link, seeing multiple humans and one AI agent collaborating in real time on a beautiful writing surface. Everything else is secondary.

### In Scope (v0)

- Block-based editor with markdown, slash commands, selection toolbar, keyboard shortcuts
- Distraction-free mode with collapsible sidebars
- File tree / directory structure (left panel)
- Real-time collaboration (CRDT via Y.js), share-by-link (view/edit access), presence indicators
- Unified chat panel (right panel) — all comments, @-mentions, and AI interactions happen here
- Text-reference-to-chat (select text → quote into chat for AI or collaborator context)
- Authorship color bars — per-user unique colors (including AI agent)
- AI agent: hard-coded **Claude Sonnet** via team-managed API key. No model selection UI.
- Inline diff for AI edits (Cursor-style accept/reject) with edit queueing
- Soft-locking on selected text to prevent conflicting edits
- Basic publish (make document public via link)
- No-login-required first experience (local storage until sign-in for save/collab)
- Authentication (email, Google, GitHub) — prompted only when saving or collaborating
- Web app (desktop-first)

### Out of Scope (P1 — next sprint after v0)

- BYOM (Bring Your Own Model) with user API keys
- Custom system prompts / AI persona per document
- Basic publish enhancements (custom slugs, SEO)
- Typography & theming options
- Email/Chrome notifications for @-mentions

### Out of Scope (P2 — v2+)

- Version history and document restore
- Blog / portfolio / documentation site publishing
- Extension/plugin API and marketplace
- Background agent runs
- Web search in AI context
- Cross-document AI context
- Custom themes and wallpaper backgrounds
- Mobile native app
- Offline / local-first fallback

---

## 12. Timeline

**v0 target: ~5–6 working days** for a demoable version that proves the core thesis (humans + AI collaborating in one document with a beautiful writing surface).

This is aggressive and intentionally so. The goal is not a shippable product — it's a proof-of-concept that demonstrates the "wow" and validates the approach before investing further.

---

## 13. Open Questions

1. **Product name** — codename is "Skunkworks" but the team wants something evocative of paper/writing. To be decided.
2. ~~**Default AI model for free tier**~~ — **Resolved:** Claude Sonnet, hard-coded, team-managed API key for v0.
3. **TipTap licensing at scale** — open-source core is free, but TipTap Cloud pricing gets expensive at scale (~$150 at 5K docs). Need to evaluate if/when this becomes a blocker.
4. **Y.js + Convex integration** — need to spike on whether Convex can cleanly persist Y.js document state, or if a lightweight Hocuspocus server is needed alongside Convex for editor sync.
5. **Authorship tracking in Y.js** — Y.js handles real-time sync and conflict resolution but doesn't natively store per-block authorship metadata. Need to design the DB schema for tracking which blocks are human-authored vs AI-authored.
6. **AI edit streaming UX** — when the AI produces a large edit, streaming the diff inline could be visually noisy. Need to explore alternatives (e.g., generate in background, show complete diff when ready, animation/transition when accepted).
7. **Import/export formats** — which formats are MVP (Markdown is assumed)? Notion export, DOCX, HTML?
8. **Mobile experience** — responsive web for v0, but editing on mobile is inherently complex. How minimal can the mobile experience be?

---

*This PRD is a living document and will be updated as decisions are made and scope evolves.*