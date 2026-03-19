import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get the latest Y.js snapshot for a document.
 * Called by Hocuspocus onLoadDocument via HTTP endpoint.
 */
export const getSnapshot = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }) => {
    const snapshot = await ctx.db
      .query("yjsSnapshots")
      .withIndex("by_document", (q) => q.eq("documentId", documentId))
      .first();

    // Also get any incremental updates since last snapshot
    const updates = await ctx.db
      .query("yjsUpdates")
      .withIndex("by_document", (q) => q.eq("documentId", documentId))
      .collect();

    return {
      snapshot: snapshot?.snapshot ?? null,
      updates: updates.map((u) => u.update),
    };
  },
});

/**
 * Save a full Y.js snapshot (replaces the previous one).
 * Called by Hocuspocus onStoreDocument via HTTP endpoint.
 * After saving the snapshot, clears incremental updates.
 */
export const saveSnapshot = mutation({
  args: {
    documentId: v.id("documents"),
    snapshot: v.bytes(),
  },
  handler: async (ctx, { documentId, snapshot }) => {
    // Upsert snapshot
    const existing = await ctx.db
      .query("yjsSnapshots")
      .withIndex("by_document", (q) => q.eq("documentId", documentId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        snapshot,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("yjsSnapshots", {
        documentId,
        snapshot,
        updatedAt: Date.now(),
      });
    }

    // Clear incremental updates (they're now compacted into the snapshot)
    const updates = await ctx.db
      .query("yjsUpdates")
      .withIndex("by_document", (q) => q.eq("documentId", documentId))
      .collect();

    for (const update of updates) {
      await ctx.db.delete(update._id);
    }
  },
});

/**
 * Append an incremental Y.js update for a document.
 * Used for real-time persistence between full snapshots.
 */
export const saveUpdate = mutation({
  args: {
    documentId: v.id("documents"),
    update: v.bytes(),
  },
  handler: async (ctx, { documentId, update }) => {
    // Get next sequence number
    const latest = await ctx.db
      .query("yjsUpdates")
      .withIndex("by_document_seq", (q) => q.eq("documentId", documentId))
      .order("desc")
      .first();

    const seq = (latest?.seq ?? 0) + 1;

    await ctx.db.insert("yjsUpdates", {
      documentId,
      update,
      seq,
    });
  },
});
