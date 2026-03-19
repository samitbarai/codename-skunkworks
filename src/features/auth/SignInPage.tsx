import { useAuthActions } from "@convex-dev/auth/react";
import styles from "./SignInPage.module.css";

export function SignInPage() {
  const { signIn } = useAuthActions();

  return (
    <div className={styles.signInPage}>
      <div className={styles.signInCard}>
        <h1 className={styles.signInTitle}>Skunkworks</h1>
        <p className={styles.signInSubtitle}>
          A simple, beautiful place to write — with AI and your team.
        </p>
        <button
          className={styles.signInGoogleBtn}
          onClick={() => void signIn("google")}
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
