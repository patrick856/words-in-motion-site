import { Link } from "@tanstack/react-router";
import { breathe, float, pendulum, shimmer, wave } from "words-in-motion/loop";
import { LoopText } from "@/components/AnimatedText";
import { GITHUB_URL, NPM_URL } from "@/lib/links";

const LINKS = [
  { label: "Docs", to: "/docs" as const },
  { label: "Getting Started", to: "/getting-started" as const },
  { label: "Animations", to: "/animations" as const },
  { label: "Changelog", to: "/changelog" as const },
];

const TAGLINES = [
  { effect: float, text: "Zero dependencies.", color: "var(--lemon)" },
  { effect: breathe, text: "Tree-shakeable.", color: "var(--mint)" },
  { effect: shimmer, text: "Accessible by default.", color: "var(--blue)" },
  { effect: pendulum, text: "Ridiculously small.", color: "var(--tomato)" },
];

export function Footer() {
  return (
    <footer className="mt-24 bg-[#0E0E0E] px-5 py-20 text-white md:px-10 md:py-28">
      <div className="mx-auto max-w-[1400px]">
        <LoopText
          as="p"
          effect={wave as never}
          options={{ duration: 2600, intensity: 1.2, by: "chars" }}
          className="font-display text-[clamp(2rem,10vw,8rem)] leading-none font-extrabold tracking-[-0.05em]"
        >
          words-in-motion
        </LoopText>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TAGLINES.map((t) => (
            <LoopText
              key={t.text}
              as="p"
              effect={t.effect as never}
              options={{ intensity: 1, by: "chars" }}
              className="font-display text-xl font-extrabold tracking-tight md:text-2xl"
              // eslint-disable-next-line react/forbid-dom-props
            >
              {t.text}
            </LoopText>
          ))}
        </div>

        <nav className="mt-20 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="underline decoration-2 underline-offset-4 transition-colors hover:text-[var(--lemon)]"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-2 underline-offset-4 transition-colors hover:text-[var(--mint)]"
          >
            GitHub
          </a>
          <a
            href={NPM_URL}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-2 underline-offset-4 transition-colors hover:text-[var(--tomato)]"
          >
            npm
          </a>
        </nav>

        <p className="mt-10 font-mono text-xs text-white/60">
          © 2026 Patrick Marcus, MIT licensed
        </p>
      </div>
    </footer>
  );
}
