import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Returns the current user's profile.
 * Uses @convex-dev/auth session to resolve the user ID.
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db.get(userId);
  },
});

/**
 * Updates the current user's profile with app-specific fields.
 * Called after sign-in to sync avatarUrl from Google profile image.
 */
export const updateProfile = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    // Sync avatarUrl from the image field (set by Google OAuth)
    if (user.image && !user.avatarUrl) {
      await ctx.db.patch(userId, { avatarUrl: user.image });
    }

    return userId;
  },
});
