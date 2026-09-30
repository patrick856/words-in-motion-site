import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

export function CodeChip({
  code,
  label,
  className = "",
  size = "sm",
}: {
  code: string;
  label?: string;
  className?: string;
  size?: "sm" | "lg";
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label ?? code}`}
      className={`group inline-flex items-center gap-3 rounded-full border border-foreground bg-background font-mono transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_0_-4px_var(--lemon)] ${
        size === "lg" ? "px-5 py-3 text-sm md:text-base" : "px-3.5 py-1.5 text-[0.72rem]"
      } ${className}`}
    >
      <span className="truncate">{copied ? "Copied!" : code}</span>
      {copied ? (
        <Check className={size === "lg" ? "size-5" : "size-3.5"} aria-hidden />
      ) : (
        <Copy className={size === "lg" ? "size-5" : "size-3.5"} aria-hidden />
      )}
    </button>
  );
}

export function LabelChip({
  children,
  color = "var(--lemon)",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span className="chip" style={{ background: color }}>
      {children}
    </span>
  );
}
