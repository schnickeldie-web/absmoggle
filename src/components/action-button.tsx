import type { ButtonHTMLAttributes, ReactNode } from "react";

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
};

const variants = {
  primary:
    "border-cyanx/50 bg-cyanx text-night shadow-neon hover:bg-white hover:text-night",
  secondary:
    "border-white/15 bg-white/8 text-white hover:border-cyanx/50 hover:bg-cyanx/10",
  danger:
    "border-dangerx/50 bg-dangerx/15 text-white hover:bg-dangerx/25",
  ghost: "border-transparent bg-transparent text-white/72 hover:text-white hover:bg-white/8"
};

export function ActionButton({
  children,
  icon,
  variant = "secondary",
  className = "",
  ...props
}: ActionButtonProps) {
  return (
    <button
      className={`focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-extrabold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
