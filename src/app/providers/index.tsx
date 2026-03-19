import { type ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { ConvexAuthProvider } from "./ConvexAuthProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ConvexAuthProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </ConvexAuthProvider>
  );
}
