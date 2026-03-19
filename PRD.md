# Product Requirements Document
## Collaborative AI-Native Document Editor

**Codename:** Skunkworks
**Status:** Draft | **Version:** 0.1 | **Date:** March 19, 2026
**Author:** Samit
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
| **Collaboration without friction** | Real-time cursors, inline comments, @-mentions. Share a link and someone's in. No setup, no invitations flow. |

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
| E4 | Selection toolbar | On text selection, a floating toolbar appears with: bold, italic, code, link, highlight, comment, and "Ask AI" action. | **P0** |
| E5 | Keyboard shortcuts | Full keyboard navigation. Every feature accessible via shortcut. Cmd/Ctrl+K for command palette. Shortcut discoverability via tooltip on hover. | **P0** |
| E6 | Distraction-free mode | Both sidebars hide-able (Cmd+\\). Center-stage writing with generous whitespace. Option to hide everything except the text. | **P0** |
| E7 | File tree / directory | Left sidebar: hierarchical file/folder structure. Create, rename, move, delete files and folders. Open multiple files in tabs. | **P0** |
| E8 | Typography & theming | Clean serif or sans-serif defaults. Light and dark themes. Customizable font, size, line height. The goal: "beautiful as a printed page." | **P1** |

### 5.2 Real-Time Collaboration

| # | Requirement | Details | Priority |
|---|---|---|---|
| C1 | Real-time co-editing | CRDT-based conflict resolution. Live cursors with names/colors for each collaborator. No lag on concurrent edits. | **P0** |
| C2 | Share by link | Generate a shareable link with permission levels: view-only, can-comment, can-edit. No account required to view. | **P0** |
| C3 | Inline comments | Select text → add comment. Threaded replies. @-mention collaborators. Click comment to scroll to referenced text (Google Docs-style). | **P0** |
| C4 | Presence indicators | Show who is currently viewing/editing. Avatar stack in header. Cursor position visible to all. | **P0** |
| C5 | Edit history / versioning | Automatic version snapshots. View history, compare diffs, restore previous versions. Track who changed what and when. | **P1** |

### 5.3 AI Agent Integration

| # | Requirement | Details | Priority |
|---|---|---|---|
| A1 | Inline AI invocation | Select a block (or text within a block) → invoke AI via keyboard shortcut or toolbar. Agent reads context of selected block + surrounding content, produces edits inline. | **P0** |
| A2 | Agent as collaborator | AI edits appear with visual provenance — a subtle color trail (e.g., light purple left-border) distinguishing agent-authored content from human-authored. Hovering shows "Generated by [model name]." | **P0** |
| A3 | System prompt / persona | Users can define a system prompt per document or workspace. The agent carries this context into every invocation (e.g., "You are a technical writer. Use concise, active voice."). | **P0** |
| A4 | Background agent runs | Ability to fire off an AI task on a block and continue writing. Agent works in the background; result appears when ready. User can accept/reject the changes. | **P1** |
| A5 | Bring Your Own Model (BYOM) | Users can plug in their own API key for Claude, GPT, Gemini, or any OpenAI-compatible endpoint. The product provides a default model (free tier) but power users bring their own. | **P1** |
| A6 | Web search capability | Agent can optionally search the web for up-to-date information when composing or editing. Research mode. | **P2** |
| A7 | Cross-block / cross-doc context | Agent can reference other blocks or documents in the workspace. "Summarize the key points from my meeting notes doc and add them here." | **P2** |

### 5.4 Publishing & Sharing

| # | Requirement | Details | Priority |
|---|---|---|---|
| S1 | Publish to public URL | One-click publish a document to a clean, readable public URL (Notion-style). Custom subdomain or slug. SEO-friendly rendering. | **P2** |
| S2 | Blog / portfolio use case | Published pages should be beautiful enough to serve as a personal blog or portfolio. Marketing teams can use it for content. Supports custom themes. | **P2** |
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
- **Right panel (collapsible):** AI agent chat. Comments thread. Document outline / table of contents.

Default state on first open: both sidebars hidden. Just the center writing surface with a minimal top bar (document title, share button, avatar stack).

### Starting Experience

When a user opens the app for the first time, they should see:

1. A clean, blank writing surface with a blinking cursor.
2. A subtle prompt: "Start typing, or press / for options."
3. 2–4 quick-action cards below the prompt: "New document," "Import from Markdown," "Start with AI," "Open recent."

Feature discovery happens progressively — tooltips on first use of slash commands, first collaboration invite, first AI invocation.

### Block Model

Every piece of content is a block. Blocks are the atomic unit for:

- **Editing:** Select, move, duplicate, delete at block level.
- **AI operations:** Invoke AI on a block. Agent edits are scoped to blocks.
- **Collaboration:** Comments attach to blocks. Presence shows which block a collaborator is editing.
- **Versioning:** Block-level change history. Who changed this block and when.
- **Referencing:** Blocks have stable IDs. Can be linked to from other documents or referenced by agents.

Block types supported at MVP: paragraph, heading (H1–H3), bullet list, numbered list, code block, quote, divider, image, callout.

---

## 7. Technical Architecture (High-Level)

*Detailed technical design will be a separate document.*

### Editor Framework

Recommended: **TipTap** (built on ProseMirror) or **BlockNote**. Both provide block-based editing, markdown support, slash commands, and are extensible. TipTap has stronger collaboration support via Hocuspocus (Y.js-based). BlockNote is simpler to start with.

### Real-Time Sync

CRDT-based (**Y.js**) for conflict-free real-time collaboration. Y.js integrates with TipTap via **Hocuspocus** as the sync provider. WebSocket-based transport.

### Backend & Data

- Cloud-first: documents stored server-side with real-time sync.
- Auth: email + social login (Google, GitHub). Magic link for frictionless onboarding.
- Storage: PostgreSQL for metadata + document tree. Y.js document state in object storage (S3-compatible).
- AI integration: server-side proxy to LLM APIs. Manages API keys (BYOM keys encrypted at rest). Streams responses back to client.

### Frontend

- React (Next.js) web application. Mobile-responsive but desktop-first.
- TipTap or BlockNote editor component.
- Tailwind CSS for styling. Custom design system for the paper-like aesthetic.

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
| AI costs spiral with free tier | 🔴 High | Strict rate limits on free tier. Push BYOM early. Use smaller models (Haiku-class) for free tier. Monitor cost/user closely. |
| Crowded market (Notion, Docs, Obsidian, new AI editors) | 🟡 Medium | Differentiate on the intersection: writing quality + collab + AI. None of the incumbents do all three well. Speed of iteration is our moat. |
| User data privacy with AI (sending doc content to LLM APIs) | 🟡 Medium | Clear data policy. Option for users to choose which AI provider processes their data. BYOM means their key, their data policy. SOC 2 compliance on roadmap. |
| Low switching cost from existing tools | 🟡 Medium | Excellent import from Markdown, Notion export, Google Docs. Make the first 5 minutes magical. Publish-to-URL as a unique hook that creates lock-in via public links. |

---

## 11. MVP Scope Summary

### In Scope (MVP)

- Block-based editor with markdown, slash commands, selection toolbar, keyboard shortcuts
- Distraction-free mode with collapsible sidebars
- File tree / directory structure
- Real-time collaboration (CRDT), share-by-link, inline comments, presence
- AI agent: inline invocation, provenance marking, system prompt per doc
- Web app (desktop-first, mobile-responsive)
- Authentication (email, Google, GitHub)

### Out of Scope (v2+)

- Public URL publishing and blog/docs site
- Extension/plugin API and marketplace
- BYOM (Bring Your Own Model) configuration
- Background agent runs
- Web search in AI context
- Cross-document AI context
- Custom themes and wallpaper backgrounds
- Mobile native app
- Offline / local-first fallback

---

## 12. Indicative Timeline

| Phase | Deliverables | Duration |
|---|---|---|
| **Design** | UI/UX design for core editor, collaboration, AI integration. Figma prototypes. Design system. | 2 weeks |
| **Build: Core Editor** | Block editor, markdown, slash commands, keyboard shortcuts, file tree, distraction-free mode. | 3–4 weeks |
| **Build: Collaboration** | Y.js integration, real-time sync, share-by-link, comments, presence. | 2–3 weeks (parallel) |
| **Build: AI Layer** | Inline AI invocation, agent provenance, system prompts, LLM proxy. | 2–3 weeks (parallel) |
| **Polish & QA** | Performance testing, edge cases, onboarding flow, launch video. | 1–2 weeks |
| **Launch** | Public launch with teaser, blog post, community seeding. | 1 week |

**Estimated total: ~6–8 weeks to MVP launch** (with design and engineering running in parallel).

---

## 13. Open Questions

1. **Product name** — codename is "Skunkworks" but the team wants something evocative of paper/writing. To be decided.
2. **Default AI model for free tier** — which model balances quality and cost? Claude Haiku, GPT-4o-mini, Gemini Flash?
3. **Data residency** — do we need to offer region-specific hosting from day one, or can we start with a single region?
4. **Import/export formats** — which formats are MVP (Markdown is assumed)? Notion export, DOCX, HTML?
5. **Mobile experience** — responsive web for MVP, but how soon do we need a dedicated mobile experience? Editing on mobile is complex.
6. **Offline support** — is there demand for offline-first even with cloud-first architecture? CRDT makes this technically feasible but adds complexity.

---

*This PRD is a living document and will be updated as decisions are made and scope evolves.*