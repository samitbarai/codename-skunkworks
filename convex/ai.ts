// TODO: Phase 6 — AI proxy action
// Streams responses from Anthropic API back to the client.
// Rate limiting must be added here before this ships (see PLAN.md §13.2).

// import { action } from "./_generated/server";
// import { v } from "convex/values";
// import Anthropic from "@anthropic-ai/sdk";

// const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

// export const invokeAI = action({
//   args: {
//     documentId: v.id("documents"),
//     selectedText: v.string(),
//     instruction: v.string(),
//     systemPrompt: v.optional(v.string()),
//   },
//   handler: async (ctx, { documentId, selectedText, instruction, systemPrompt }) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error("Unauthenticated");
//     // TODO: rate limit check here
//     // TODO: cost logging here
//     const response = await anthropic.messages.create({ ... });
//     return response;
//   },
// });

export {};
