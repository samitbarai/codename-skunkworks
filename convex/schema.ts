import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  // Auth tables from @convex-dev/auth (authSessions, authAccounts, etc.)
  ...authTables,

  /**
   * Users — extended from authTables with app-specific fields.
   * Base auth fields: name, email, phone, image, emailVerificationTime,
   * phoneVerificationTime, isAnonymous (all optional, managed by @convex-dev/auth).
   * Custom fields: avatarUrl.
   */
  users: defineTable({
    // @convex-dev/auth managed fields
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    image: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    // App-specific fields
    avatarUrl: v.optional(v.string()),
  })
    .index("email", ["email"])
    .index("phone", ["phone"]),

  /**
   * Workspaces — top-level container for documents.
   */
  workspaces: defineTable({
    name: v.string(),
    ownerId: v.id("users"),
  }),

  /**
   * Workspace membership — controls who can access a workspace.
   * role: "owner" | "editor" | "viewer"
   */
  workspaceMembers: defineTable({
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    role: v.union(v.literal("owner"), v.literal("editor"), v.literal("viewer")),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_user_workspace", ["userId", "workspaceId"]),

  /**
   * Documents — files and folders in the workspace.
   * isFolder: true means this is a folder, not an editable document.
   * parentId: null = root level.
   */
  documents: defineTable({
    title: v.string(),
    workspaceId: v.id("workspaces"),
    parentId: v.optional(v.id("documents")), // folder nesting
    isFolder: v.boolean(),
    systemPrompt: v.optional(v.string()),    // per-doc AI persona
    createdBy: v.id("users"),
    updatedAt: v.number(),                   // Unix timestamp ms
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_parent", ["parentId"]),

  /**
   * Y.js snapshots — latest compacted binary state per document.
   * See PLAN.md §13.3 for the snapshot + update log strategy.
   */
  yjsSnapshots: defineTable({
    documentId: v.id("documents"),
    snapshot: v.bytes(),
    updatedAt: v.number(),
  }).index("by_document", ["documentId"]),

  /**
   * Y.js update log — incremental updates since last snapshot.
   * Compacted hourly into yjsSnapshots by a scheduled Convex action.
   */
  yjsUpdates: defineTable({
    documentId: v.id("documents"),
    update: v.bytes(),
    seq: v.number(), // monotonically increasing per document
  })
    .index("by_document", ["documentId"])
    .index("by_document_seq", ["documentId", "seq"]),

  /**
   * Inline comments — attached to a specific block within a document.
   * parentId: null = top-level comment; set = threaded reply.
   */
  comments: defineTable({
    documentId: v.id("documents"),
    blockId: v.string(),                        // TipTap node ID
    selectedText: v.string(),                   // quoted text at time of comment
    authorId: v.id("users"),
    body: v.string(),
    resolved: v.boolean(),
    parentId: v.optional(v.id("comments")),     // threading
    createdAt: v.number(),
  })
    .index("by_document", ["documentId"])
    .index("by_block", ["documentId", "blockId"]),

  /**
   * Share links — per-document shareable URLs with permission levels.
   */
  shareLinks: defineTable({
    documentId: v.id("documents"),
    token: v.string(),                          // unique random token in URL
    permission: v.union(
      v.literal("view"),
      v.literal("comment"),
      v.literal("edit")
    ),
    createdBy: v.id("users"),
    expiresAt: v.optional(v.number()),
  })
    .index("by_document", ["documentId"])
    .index("by_token", ["token"]),

  /**
   * AI cost log — per-invocation cost tracking (see §13.8: Before AI ships).
   */
  aiCostLog: defineTable({
    userId: v.id("users"),
    documentId: v.id("documents"),
    model: v.string(),
    inputTokens: v.number(),
    outputTokens: v.number(),
    costUsd: v.number(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});
