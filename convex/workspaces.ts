import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Returns the current user's first workspace ID, or null if none exists.
 */
export const getMyWorkspace = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const membership = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_user_workspace", (q) => q.eq("userId", userId))
      .first();

    return membership?.workspaceId ?? null;
  },
});

// ─── Mutations ────────────────────────────────────────────────────────────────

/**
 * Idempotent: creates a default workspace + owner membership + seed doc
 * if the user has no workspace yet. Returns the workspaceId.
 */
export const bootstrapWorkspace = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");

    // Check if user already has a workspace
    const existing = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_user_workspace", (q) => q.eq("userId", userId))
      .first();

    if (existing) return existing.workspaceId;

    // Create workspace
    const workspaceId = await ctx.db.insert("workspaces", {
      name: "My Workspace",
      ownerId: userId,
    });

    // Create owner membership
    await ctx.db.insert("workspaceMembers", {
      workspaceId,
      userId,
      role: "owner",
    });

    // Seed a welcome document
    await ctx.db.insert("documents", {
      title: "Welcome to Skunkworks",
      workspaceId,
      isFolder: false,
      createdBy: userId,
      updatedAt: Date.now(),
    });

    return workspaceId;
  },
});
