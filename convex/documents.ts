import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { GenericMutationCtx, GenericQueryCtx } from "convex/server";
import type { DataModel, Id } from "./_generated/dataModel";

type Ctx = GenericMutationCtx<DataModel> | GenericQueryCtx<DataModel>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getCurrentUser(ctx: Ctx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Unauthenticated");
  const user = await ctx.db.get(userId);
  if (!user) throw new Error("User not found");
  return user;
}

async function getDocumentOrThrow(ctx: Ctx, documentId: Id<"documents">) {
  const doc = await ctx.db.get(documentId);
  if (!doc) throw new Error("Not found");
  return doc;
}

async function assertWorkspaceMember(ctx: Ctx, workspaceId: Id<"workspaces">) {
  const user = await getCurrentUser(ctx);

  const membership = await ctx.db
    .query("workspaceMembers")
    .withIndex("by_user_workspace", (q) =>
      q.eq("userId", user._id).eq("workspaceId", workspaceId)
    )
    .first();
  if (!membership) throw new Error("Forbidden");

  return { user, membership };
}

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Returns the full file tree for a workspace (documents + folders).
 */
export const listDocuments = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, { workspaceId }) => {
    await assertWorkspaceMember(ctx, workspaceId);
    return await ctx.db
      .query("documents")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
      .collect();
  },
});

/**
 * Returns a single document by ID.
 */
export const getDocument = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }) => {
    const doc = await getDocumentOrThrow(ctx, documentId);
    await assertWorkspaceMember(ctx, doc.workspaceId);
    return doc;
  },
});

// ─── Mutations ────────────────────────────────────────────────────────────────

export const createDocument = mutation({
  args: {
    title: v.string(),
    workspaceId: v.id("workspaces"),
    parentId: v.optional(v.id("documents")),
    isFolder: v.boolean(),
  },
  handler: async (ctx, { title, workspaceId, parentId, isFolder }) => {
    const { user } = await assertWorkspaceMember(ctx, workspaceId);
    return await ctx.db.insert("documents", {
      title,
      workspaceId,
      parentId,
      isFolder,
      createdBy: user._id,
      updatedAt: Date.now(),
    });
  },
});

export const renameDocument = mutation({
  args: { documentId: v.id("documents"), title: v.string() },
  handler: async (ctx, { documentId, title }) => {
    const doc = await getDocumentOrThrow(ctx, documentId);
    await assertWorkspaceMember(ctx, doc.workspaceId);
    await ctx.db.patch(documentId, { title, updatedAt: Date.now() });
  },
});

export const deleteDocument = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }) => {
    const doc = await getDocumentOrThrow(ctx, documentId);
    const { membership } = await assertWorkspaceMember(ctx, doc.workspaceId);
    if (membership.role === "viewer") throw new Error("Insufficient permissions");

    // Recursively delete children (folders and docs nested inside)
    const children = await ctx.db
      .query("documents")
      .withIndex("by_parent", (q) => q.eq("parentId", documentId))
      .collect();
    for (const child of children) {
      // Recurse into sub-folders
      if (child.isFolder) {
        const grandchildren = await ctx.db
          .query("documents")
          .withIndex("by_parent", (q) => q.eq("parentId", child._id))
          .collect();
        for (const gc of grandchildren) {
          await ctx.db.delete(gc._id);
        }
      }
      await ctx.db.delete(child._id);
    }

    await ctx.db.delete(documentId);
  },
});

export const moveDocument = mutation({
  args: {
    documentId: v.id("documents"),
    parentId: v.optional(v.id("documents")),
  },
  handler: async (ctx, { documentId, parentId }) => {
    const doc = await getDocumentOrThrow(ctx, documentId);
    const { membership } = await assertWorkspaceMember(ctx, doc.workspaceId);
    if (membership.role === "viewer") throw new Error("Insufficient permissions");

    // Cannot move a doc into itself
    if (parentId && parentId === documentId) {
      throw new Error("Cannot move a document into itself");
    }

    // If parentId is set, validate it's a folder in the same workspace
    if (parentId) {
      const target = await getDocumentOrThrow(ctx, parentId);
      if (!target.isFolder) throw new Error("Target is not a folder");
      if (target.workspaceId !== doc.workspaceId) throw new Error("Cannot move across workspaces");

      // Prevent moving a folder into its own descendant
      if (doc.isFolder) {
        let current: typeof target | null = target;
        while (current?.parentId) {
          if (current.parentId === documentId) {
            throw new Error("Cannot move a folder into its own descendant");
          }
          current = await ctx.db.get(current.parentId);
        }
      }
    }

    await ctx.db.patch(documentId, { parentId, updatedAt: Date.now() });
  },
});

export const updateSystemPrompt = mutation({
  args: { documentId: v.id("documents"), systemPrompt: v.string() },
  handler: async (ctx, { documentId, systemPrompt }) => {
    const doc = await getDocumentOrThrow(ctx, documentId);
    const { membership } = await assertWorkspaceMember(ctx, doc.workspaceId);
    if (membership.role === "viewer") throw new Error("Insufficient permissions");
    await ctx.db.patch(documentId, { systemPrompt, updatedAt: Date.now() });
  },
});
