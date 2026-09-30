import { useRef, useState, type CSSProperties } from "react";
import {
  accentColor,
  fontWeight,
  obstaclePush,
  proximityFade,
  proximityFlip,
  proximityRotate,
  proximityShake,
  pull,
  push,
} from "words-in-motion/interact";
import { InteractText } from "@/components/AnimatedText";
import { LabelChip } from "@/components/CodeChip";

type Block = {
  name: string;
  snippet: string;
  color: string;
  shape: CSSProperties;
  span: string;
  text: string[];
  create: (el: HTMLElement) => { destroy: () => void };
};

const touch = { touch: "follow" as const, pointerArea: "target" as const };

const BLOCKS: Block[] = [
  {
    name: "pull",
    snippet: "pull('.title')",
    color: "var(--tomato)",
    shape: { borderRadius: "48% 52% 61% 39% / 44% 38% 62% 56%" },
    span: "md:col-span-5 md:row-span-2",
    text: ["Come", "a little", "closer"],
    create: (el) => pull(el, { radius: 170, ...touch }),
  },
  {
    name: "push",
    snippet: "push('.title')",
    color: "var(--blue)",
    shape: { borderRadius: "999px" },
    span: "md:col-span-4",
    text: ["Back off,", "letters said"],
    create: (el) => push(el, { radius: 150, ...touch }),
  },
  {
    name: "obstaclePush",
    snippet: "obstaclePush('.title')",
    color: "var(--lemon)",
    shape: { clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)" },
    span: "md:col-span-3 md:row-span-2",
    text: ["Solid", "cursor,", "shoving", "glyphs"],
    create: (el) => obstaclePush(el, { easing: 0.15, ...touch }),
  },
  {
    name: "proximityFade",
    snippet: "proximityFade('.title')",
    color: "var(--mint)",
    shape: { borderRadius: "2.5rem 2.5rem 2.5rem 0.5rem" },
    span: "md:col-span-4",
    text: ["Now you", "see it"],
    create: (el) => proximityFade(el, touch),
  },
  {
    name: "proximityFlip",
    snippet: "proximityFlip('.title')",
    color: "var(--violet)",
    shape: { borderRadius: "999px 999px 1.5rem 1.5rem" },
    span: "md:col-span-5",
    text: ["Every letter", "has a", "back side"],
    create: (el) => proximityFlip(el, touch),
  },
  {
    name: "proximityRotate",
    snippet: "proximityRotate(el, { maxAngle: 90 })",
    color: "var(--tomato)",
    shape: { borderRadius: "1.5rem", transform: "rotate(-3deg)" },
    span: "md:col-span-4",
    text: ["Tilt the", "whole", "sentence"],
    create: (el) => proximityRotate(el, { maxAngle: 90, ...touch }),
  },
  {
    name: "proximityShake",
    snippet: "proximityShake('.title')",
    color: "var(--blue)",
    shape: { borderRadius: "50%" },
    span: "md:col-span-3",
    text: ["Nervous", "type"],
    create: (el) => proximityShake(el, touch),
  },
  {
    name: "fontWeight",
    snippet: "fontWeight(el, { maxWeight: 800 })",
    color: "var(--lemon)",
    shape: { borderRadius: "3rem 0.5rem 3rem 0.5rem" },
    span: "md:col-span-5",
    text: ["Bold where", "you look,", "light elsewhere"],
    create: (el) => fontWeight(el, { maxWeight: 800, ...touch }),
  },
  {
    name: "accentColor",
    snippet: "accentColor(el, { accentColor: '#FF5A3C' })",
    color: "var(--mint)",
    shape: { borderRadius: "1rem 1rem 6rem 6rem" },
    span: "md:col-span-4",
    text: ["Colour", "follows", "the dot"],
    create: (el) => accentColor(el, { accentColor: "#FF5A3C", ...touch }),
  },
];

function PlayBlock({ block }: { block: Block }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [dot, setDot] = useState<{ x: number; y: number } | null>(null);

  return (
    <article
      ref={wrapRef}
      className={`relative flex max-h-[60vh] min-h-[220px] flex-col justify-between overflow-hidden border border-foreground p-6 md:p-8 ${block.span}`}
      style={{ ...block.shape, background: block.color, cursor: dot ? "none" : "auto" }}
      onPointerMove={(e) => {
        const r = wrapRef.current?.getBoundingClientRect();
        if (!r) return;
        setDot({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      onPointerLeave={() => setDot(null)}
    >
      <InteractText
        as="p"
        effects={[block.create]}
        style={{ touchAction: "none" }}
        className="font-display text-2xl leading-[1.05] font-extrabold tracking-tight text-[#0E0E0E] md:text-3xl"
      >
        {block.text.join(" ")}
      </InteractText>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <LabelChip color="rgba(255,255,255,0.9)">{block.name}</LabelChip>
        <code className="font-mono text-[0.65rem] text-[#0E0E0E]/70">{block.snippet}</code>
      </div>

      {dot && (
        <span
          aria-hidden
          className="pointer-events-none absolute z-10 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0E0E0E]"
          style={{ left: dot.x, top: dot.y }}
        />
      )}
    </article>
  );
}

export function CursorPlayground() {
  return (
    <section className="relative px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Cursor playground
        </p>
        <h2 className="mt-4 max-w-[20ch] text-4xl md:text-6xl">
          Move your cursor over the words.
        </h2>
        <p className="mt-4 max-w-[46ch] text-muted-foreground">
          Nine reactive effects, one pointer. They stack on the same text too.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-6 md:auto-rows-[minmax(180px,auto)] md:grid-cols-12">
          {BLOCKS.map((b) => (
            <PlayBlock key={b.name} block={b} />
          ))}
        </div>
      </div>
    </section>
  );
}
