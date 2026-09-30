import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Blobs } from "@/components/Blobs";
import { copyText } from "@/lib/clipboard";

export type PageSection = { id: string; label: string };

const pages = [
  { to: "/getting-started" as const, label: "How to use" },
  { to: "/docs" as const, label: "Reference" },
  { to: "/animations" as const, label: "Animations" },
  { to: "/changelog" as const, label: "Changelog" },
];

export function ContentPage({
  kicker,
  title,
  intro,
  sections,
  children,
}: {
  kicker: string;
  title: string;
  intro: string;
  sections: PageSection[];
  children: ReactNode;
}) {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-foreground/10 px-5 pt-36 pb-20 md:px-10 md:pt-44 md:pb-28">
        <Blobs />
        <div className="relative mx-auto max-w-[1200px]">
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            {kicker}
          </p>
          <h1 className="mt-4 max-w-[13ch] text-5xl leading-[0.98] sm:text-6xl md:text-8xl">
            {title}
          </h1>
          <p className="mt-7 max-w-[58ch] text-lg leading-relaxed text-muted-foreground md:text-xl">
            {intro}
          </p>
          <nav aria-label="Site pages" className="mt-9 flex flex-wrap gap-2">
            {pages.map((page, index) => (
              <Link
                key={page.to}
                to={page.to}
                activeProps={{ "aria-current": "page" }}
                className="chip transition-transform duration-300 hover:-translate-y-0.5 aria-[current=page]:border-foreground"
                style={{
                  background: ["var(--lemon)", "var(--mint)", "var(--violet)", "var(--tomato)"][
                    index
                  ],
                }}
              >
                {page.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-16 md:px-10 md:py-24 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-16">
        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <label
            htmlFor="page-contents"
            className="mb-3 block font-mono text-xs tracking-widest text-muted-foreground uppercase"
          >
            On this page
          </label>
          <select
            id="page-contents"
            className="w-full rounded-xl border border-foreground bg-background px-4 py-3 font-mono text-sm lg:hidden"
            defaultValue=""
            onChange={(event) => document.getElementById(event.target.value)?.scrollIntoView()}
          >
            <option value="" disabled>
              Jump to a section
            </option>
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.label}
              </option>
            ))}
          </select>
          <nav aria-label="On this page" className="hidden border-l border-foreground/15 lg:block">
            {sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block border-l-2 border-transparent py-2 pl-4 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                <span
                  className="mr-2 font-mono text-xs"
                  style={{
                    color: [
                      "var(--tomato)",
                      "var(--blue)",
                      "var(--violet)",
                      "var(--mint)",
                      "var(--tomato)",
                    ][index % 5],
                  }}
                >
                  ●
                </span>
                {section.label}
              </a>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 space-y-20">{children}</div>
      </div>
    </main>
  );
}

export function ContentSection({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 border-t border-foreground/15 pt-7 first:border-t-0 first:pt-0"
    >
      <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">{eyebrow}</p>
      <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">{title}</h2>
      <div className="mt-6 space-y-5 text-[0.98rem] leading-[1.75] text-foreground/80">
        {children}
      </div>
    </section>
  );
}

export function Callout({
  color = "var(--lemon)",
  children,
}: {
  color?: string;
  children: ReactNode;
}) {
  return (
    <div
      className="rounded-2xl border border-foreground/15 border-l-[6px] bg-[#fafaf8] px-5 py-4 text-sm leading-relaxed"
      style={{ borderLeftColor: color }}
    >
      {children}
    </div>
  );
}

const tokenPattern =
  /(\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:import|from|const|let|await|return|function|export|default|if|useEffect|useRef|type|new)\b|\b\d+(?:\.\d+)?\b)/g;

function colorize(code: string) {
  return code.split(tokenPattern).map((part, index) => {
    let color = "text-[#f6f3ea]";
    if (part.startsWith("//")) color = "text-[#9ca3a2]";
    else if (/^["'`]/.test(part)) color = "text-[#b9ebcd]";
    else if (/^\d/.test(part)) color = "text-[#f5d98b]";
    else if (
      /^(import|from|const|let|await|return|function|export|default|if|useEffect|useRef|type|new)$/.test(
        part,
      )
    )
      color = "text-[#c3b5ff]";
    return (
      <span key={index} className={color}>
        {part}
      </span>
    );
  });
}

export function CodeBlock({ code, language = "ts" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (await copyText(code)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } else {
      setCopied(false);
    }
  };

  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-foreground bg-[#111211] text-white">
      <div className="flex items-center justify-between border-b border-white/15 px-4 py-2.5 font-mono text-xs text-white/55">
        <span>{language}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-white transition-colors hover:bg-white/10"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="size-3.5" aria-hidden />
          ) : (
            <Copy className="size-3.5" aria-hidden />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto px-5 py-5 font-mono text-[0.76rem] leading-6 sm:text-sm">
        <code>{colorize(code)}</code>
      </pre>
    </div>
  );
}

export function EffectTable({
  rows,
}: {
  rows: { name: string; description: string; options: string }[];
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-foreground/20">
      <table className="w-full min-w-[580px] border-collapse text-left text-sm">
        <thead className="bg-[#f6f5f1] font-mono text-xs uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3 font-medium">Effect</th>
            <th className="px-4 py-3 font-medium">What it does</th>
            <th className="px-4 py-3 font-medium">Key options</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-t border-foreground/10 align-top">
              <td className="px-4 py-3 font-mono text-xs font-semibold text-foreground">
                {row.name}
              </td>
              <td className="px-4 py-3">{row.description}</td>
              <td className="px-4 py-3 font-mono text-xs">{row.options}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
