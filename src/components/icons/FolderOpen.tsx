import type { IconProps } from "./types";

export const FolderOpen = ({ size = 24, color = "currentColor" }: IconProps) => (
  <svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);
