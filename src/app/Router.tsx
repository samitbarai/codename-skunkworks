import { Component, type ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useConvexAuth } from "convex/react";
import { WorkspaceProvider } from "@/store/WorkspaceProvider";
import { AppStoreProvider } from "@/store/AppStore";
import { WorkspacePage } from "@/features/workspace/WorkspacePage";
import { DocumentPage } from "@/features/document/DocumentPage";
import { SignInPage } from "@/features/auth/SignInPage";

// ─── Error Boundary ──────────────────────────────────────────────────────────

interface ErrorBoundaryState {
  error: Error | null;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h1>Something went wrong</h1>
          <p style={{ color: "var(--color-text-secondary)" }}>
            {this.state.error.message}
          </p>
          <button
            type="button"
            onClick={() => {
              this.setState({ error: null });
              window.location.href = "/";
            }}
            style={{ marginTop: "1rem", cursor: "pointer" }}
          >
            Go home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Route guards ────────────────────────────────────────────────────────────

/** Redirect to /sign-in if not authenticated */
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  if (isLoading) return null; // or a spinner
  if (!isAuthenticated) return <Navigate to="/sign-in" replace />;
  return (
    <WorkspaceProvider>
      <AppStoreProvider>{children}</AppStoreProvider>
    </WorkspaceProvider>
  );
}

/** Redirect to / if already authenticated */
function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export function AppRouter() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <WorkspacePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sign-in"
            element={
              <PublicRoute>
                <SignInPage />
              </PublicRoute>
            }
          />
          <Route
            path="/doc/:documentId"
            element={
              <ProtectedRoute>
                <DocumentPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
