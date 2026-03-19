import { ConvexAuthProvider as ConvexAuthProviderLib } from "@convex-dev/auth/react";
import { type ReactNode } from "react";
import { convex } from "@/lib/convex";

export function ConvexAuthProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexAuthProviderLib client={convex}>
      {children}
    </ConvexAuthProviderLib>
  );
}
