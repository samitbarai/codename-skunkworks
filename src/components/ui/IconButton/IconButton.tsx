import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import styles from "./IconButton.module.css";

type IconButtonSize = "xxs" | "xs" | "sm" | "md";
type IconButtonVariant = "ghost" | "destructive";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon element to render */
  children: ReactNode;
  /** Button dimensions: "xxs"=18px, "xs"=22px, "sm"=24px (default), "md"=28px */
  size?: IconButtonSize;
  /** Visual style: "ghost" (default) or "destructive" (red on hover) */
  variant?: IconButtonVariant;
  /** Toggle / pressed state — applies primary text color */
  active?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { children, size = "sm", variant = "ghost", active = false, className, ...rest },
    ref,
  ) {
    const cls = [
      styles.iconButton,
      styles[size],
      styles[variant],
      active && styles.active,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button ref={ref} className={cls} {...rest}>
        {children}
      </button>
    );
  },
);
