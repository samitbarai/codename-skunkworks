// Convex Auth config — tells the Convex deployment which JWT issuer to trust.
// @convex-dev/auth issues its own tokens from the Convex site URL.

export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL,
      applicationID: "convex",
    },
  ],
};
