// Button primitive del design system.
// Variantes alineadas a design/DESIGN-SKILL.md:
//   - primary: fill solido (acento), texto inverso, peso 600
//   - secondary: stroke 1px, fill transparente, texto primario
//   - ghost: solo texto + hover sutil

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}

type ButtonAsButton = BaseProps &
  Omit<ComponentProps<"button">, keyof BaseProps> & { href?: undefined };

type ButtonAsLink = BaseProps &
  Omit<ComponentProps<typeof Link>, keyof BaseProps> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<Variant, string> = {
  primary: "bg-ink text-cream hover:opacity-90 active:opacity-80",
  secondary:
    "bg-transparent text-ink border border-border-strong hover:bg-black/[0.04]",
  ghost: "bg-transparent text-ink hover:bg-black/[0.04]",
};

const sizeClasses: Record<Size, string> = {
  md: "px-5 py-3 text-base",
  lg: "px-6 py-3.5 text-lg",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className = "", children } = props;
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if ("href" in props && props.href) {
    const { variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
    void _v;
    void _s;
    void _c;
    void _ch;
    return (
      <Link {...rest} className={classes}>
        {children}
      </Link>
    );
  }

  const {
    variant: _v,
    size: _s,
    className: _c,
    children: _ch,
    ...rest
  } = props as ButtonAsButton;
  void _v;
  void _s;
  void _c;
  void _ch;

  return (
    <button {...rest} className={classes}>
      {children}
    </button>
  );
}
