import { useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useApp } from "@/store/AppStore";
import { PaperTopBar } from "./PaperTopBar";
import { LeftPanel } from "./LeftPanel";
import { RightPanel } from "./RightPanel";
import styles from "./AppShell.module.css";

// Framer Motion requires numeric px values — keep in sync with component.css tokens
const PANEL_W = 260;  // --panel-left-width
const RIGHT_W = 444;  // --panel-right-width

// Matches --ease-out / --ease-in-out in component.css
const easeOpen:  [number, number, number, number] = [0.16, 1, 0.3, 1];
const easeClose: [number, number, number, number] = [0.45, 0, 0.55, 1];

// Matches --duration-base (200ms)
const DURATION_OPEN = 0.2;
const DURATION_CLOSE = 0.12; // --duration-fast (120ms)

const slideLeft = {
  initial: { width: 0, opacity: 0 },
  animate: { width: PANEL_W, opacity: 1, transition: { duration: DURATION_OPEN, ease: easeOpen  } },
  exit:    { width: 0, opacity: 0,        transition: { duration: DURATION_CLOSE, ease: easeClose } },
};

const slideRight = {
  initial: { width: 0, opacity: 0 },
  animate: { width: RIGHT_W, opacity: 1, transition: { duration: DURATION_OPEN, ease: easeOpen  } },
  exit:    { width: 0, opacity: 0,        transition: { duration: DURATION_CLOSE, ease: easeClose } },
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const { leftPanelOpen, rightPanelOpen, focusMode, toggleFocus } = useApp();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === "p") {
        e.preventDefault();
        toggleFocus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleFocus]);

  return (
    <div className={`${styles.appShell}${focusMode ? ` ${styles.appShellFocused}` : ""}`}>
      <LayoutGroup>
        <div className={`${styles.appShellBody}${focusMode ? ` ${styles.appShellBodyFocused}` : ""}`}>
          {/* Left card — Directory */}
          <AnimatePresence initial={false}>
            {leftPanelOpen && (
              <motion.div
                key="left"
                className={styles.appShellPanelLeft}
                variants={slideLeft}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <LeftPanel />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Center card — Paper */}
          <motion.div
            layout
            layoutDependency={`${leftPanelOpen}-${rightPanelOpen}-${focusMode}`}
            className={`${styles.appShellPanelCenter}${focusMode ? ` ${styles.appShellPanelCenterFocused}` : ""}`}
            transition={{ layout: { duration: DURATION_OPEN, ease: easeOpen } }}
          >
            <PaperTopBar />
            <div className={styles.appShellPanelCenterContent}>
              {children}
            </div>
          </motion.div>

          {/* Right card — Jam */}
          <AnimatePresence initial={false}>
            {rightPanelOpen && (
              <motion.div
                key="right"
                className={styles.appShellPanelRight}
                variants={slideRight}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <RightPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </div>
  );
}
