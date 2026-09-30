import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, RotateCcw } from "lucide-react";
import * as intro from "words-in-motion/intro";
import * as loop from "words-in-motion/loop";
import * as outro from "words-in-motion/outro";
import * as interact from "words-in-motion/interact";
import { useFontsReady } from "@/lib/motion";
import { copyText } from "@/lib/clipboard";

type Category = "Intro" | "Loop" | "Outro" | "Interact" | "Scroll";
type Handle = { cancel?: () => void; destroy?: () => void };
type GalleryEffect = {
  name: string;
  category: Category;
  description: string;
  text: string;
  color: string;
  run?: (element: HTMLElement) => Handle;
};

const colors = [
  "var(--tomato)",
  "var(--blue)",
  "var(--lemon)",
  "var(--mint)",
  "var(--violet)",
] as const;
const touch = { radius: 320, pointerArea: "viewport" as const, touch: "follow" as const };

const effects: GalleryEffect[] = [
  {
    name: "directionalReveal",
    category: "Intro",
    description: "An entrance with a mind of its own.",
    text: "Here I am.",
    color: colors[0],
    run: (el) => intro.directionalReveal(el, { duration: 1100 }),
  },
  {
    name: "lampFlicker",
    category: "Intro",
    description: "A warm sign finding its light.",
    text: "Lights on.",
    color: colors[1],
    run: (el) => intro.lampFlicker(el, { duration: 1100 }),
  },
  {
    name: "rise",
    category: "Intro",
    description: "From below the baseline, with feeling.",
    text: "On the rise.",
    color: colors[2],
    run: (el) => intro.rise(el, { duration: 900 }),
  },
  {
    name: "chunkedScramble",
    category: "Intro",
    description: "A small typo storm before the reveal.",
    text: "Wait for it.",
    color: colors[3],
    run: (el) => intro.chunkedScramble(el, { duration: 1400 }),
  },
  {
    name: "stripRealign",
    category: "Intro",
    description: "A puzzle that knows its answer.",
    text: "Find your line.",
    color: colors[4],
    run: (el) => intro.stripRealign(el, { duration: 1200 }),
  },
  {
    name: "pixelResolve",
    category: "Intro",
    description: "Pixels give way to proper type.",
    text: "Into focus.",
    color: colors[0],
    run: (el) => intro.pixelResolve(el, { duration: 1400 }),
  },
  {
    name: "wave",
    category: "Loop",
    description: "A traveling wave that never tires.",
    text: "Keep going.",
    color: colors[1],
    run: (el) => loop.wave(el, { intensity: 1.2 }),
  },
  {
    name: "float",
    category: "Loop",
    description: "A little drift, a little daydream.",
    text: "No gravity.",
    color: colors[2],
    run: (el) => loop.float(el, { intensity: 1.3 }),
  },
  {
    name: "breathe",
    category: "Loop",
    description: "Inhale. Exhale. Stay readable.",
    text: "Take a breath.",
    color: colors[3],
    run: (el) => loop.breathe(el, { intensity: 1.2 }),
  },
  {
    name: "shimmer",
    category: "Loop",
    description: "A quiet light moves across the line.",
    text: "Catch the light.",
    color: colors[4],
    run: (el) => loop.shimmer(el, { intensity: 1.2 }),
  },
  {
    name: "pendulum",
    category: "Loop",
    description: "Letters with a gentle swing.",
    text: "Back and forth.",
    color: colors[0],
    run: (el) => loop.pendulum(el, { intensity: 1.2 }),
  },
  {
    name: "blackHole",
    category: "Outro",
    description: "A spiral with one destination.",
    text: "See you soon.",
    color: colors[1],
    run: (el) => outro.blackHole(el, { duration: 1000, keep: true }),
  },
  {
    name: "paperCut",
    category: "Outro",
    description: "Cut the line; let the pieces leave.",
    text: "Cut to black.",
    color: colors[2],
    run: (el) => outro.paperCut(el, { duration: 1000, keep: true }),
  },
  {
    name: "breakAndFade",
    category: "Outro",
    description: "A fracture in reading order.",
    text: "Break away.",
    color: colors[3],
    run: (el) => outro.breakAndFade(el, { duration: 1000, keep: true }),
  },
  {
    name: "hingeDrop",
    category: "Outro",
    description: "One last pivot before the fall.",
    text: "Let it go.",
    color: colors[4],
    run: (el) => outro.hingeDrop(el, { duration: 1000, keep: true }),
  },
  {
    name: "blurAway",
    category: "Outro",
    description: "A soft exit, slightly out of focus.",
    text: "Fade softly.",
    color: colors[0],
    run: (el) => outro.blurAway(el, { duration: 1000, keep: true }),
  },
  {
    name: "windScatter",
    category: "Outro",
    description: "Letters taking the scenic route.",
    text: "Gone with it.",
    color: colors[1],
    run: (el) => outro.windScatter(el, { duration: 1000, keep: true }),
  },
  {
    name: "pull",
    category: "Interact",
    description: "The cursor has a magnetic side.",
    text: "Come closer.",
    color: colors[2],
    run: (el) => interact.pull(el, touch),
  },
  {
    name: "push",
    category: "Interact",
    description: "Personal space, letter by letter.",
    text: "Make room.",
    color: colors[3],
    run: (el) => interact.push(el, touch),
  },
  {
    name: "obstaclePush",
    category: "Interact",
    description: "A solid pointer meets springy type.",
    text: "Excuse me.",
    color: colors[4],
    run: (el) => interact.obstaclePush(el, touch),
  },
  {
    name: "proximityFade",
    category: "Interact",
    description: "A soft fade near your pointer.",
    text: "Now you see me.",
    color: colors[0],
    run: (el) => interact.proximityFade(el, touch),
  },
  {
    name: "proximityFlip",
    category: "Interact",
    description: "There is another side to every letter.",
    text: "Turn around.",
    color: colors[1],
    run: (el) => interact.proximityFlip(el, touch),
  },
  {
    name: "proximityRotate",
    category: "Interact",
    description: "A little turn when you get close.",
    text: "Look this way.",
    color: colors[2],
    run: (el) => interact.proximityRotate(el, touch),
  },
  {
    name: "proximityShake",
    category: "Interact",
    description: "Nervous type, steady reading.",
    text: "A little nervous.",
    color: colors[3],
    run: (el) => interact.proximityShake(el, touch),
  },
  {
    name: "fontWeight",
    category: "Interact",
    description: "Attention makes a word bolder.",
    text: "Look here.",
    color: colors[4],
    run: (el) => interact.fontWeight(el, { minWeight: 400, maxWeight: 800, focusRadius: 220, ...touch }),
  },
  {
    name: "accentColor",
    category: "Interact",
    description: "Color follows the curious.",
    text: "Follow the color.",
    color: colors[0],
    run: (el) => interact.accentColor(el, { accentColor: "#2F5BFF", ...touch }),
  },
  {
    name: "readingLine",
    category: "Scroll",
    description: "A sentence brightens at reading speed.",
    text: "Follow the words.",
    color: colors[1],
  },
  {
    name: "scatterReassemble",
    category: "Scroll",
    description: "The chaos settles as you scroll.",
    text: "Order from chaos.",
    color: colors[2],
  },
  {
    name: "waveRelay",
    category: "Scroll",
    description: "One letter carries the motion onward.",
    text: "Pass it along.",
    color: colors[3],
  },
];

const filters = ["All", "Intro", "Loop", "Outro", "Interact", "Scroll"] as const;

function GalleryCard({ effect, moreText }: { effect: GalleryEffect; moreText: boolean }) {
  const cardRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const fontsReady = useFontsReady();
  const [replay, setReplay] = useState(0);
  const [copied, setCopied] = useState(false);
  const importCode = `import { ${effect.name} } from "words-in-motion/${effect.category.toLowerCase()}";`;
  const demoText = moreText
    ? `${effect.text} Watch these words stretch, shift, and find their way back into place.`
    : effect.text;
  const demoWeight = effect.name === "fontWeight" ? "font-normal" : "font-extrabold";

  useEffect(() => {
    const card = cardRef.current;
    const text = textRef.current;
    if (!fontsReady || !card || !text || !effect.run) return;

    let handle: Handle | undefined;
    let inView = false;
    const stop = () => {
      if (handle?.destroy) handle.destroy();
      else handle?.cancel?.();
      handle = undefined;
    };
    const setInView = (next: boolean) => {
      if (next === inView) return;
      inView = next;
      stop();
      if (inView) handle = effect.run?.(text);
    };

    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return stop;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting && entry.intersectionRatio > 0)),
      { rootMargin: "-25% 0px -25% 0px", threshold: 0.01 },
    );
    observer.observe(card);
    return () => {
      observer.disconnect();
      stop();
    };
  }, [effect, fontsReady, replay]);

  const copy = async () => {
    if (await copyText(importCode)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } else {
      setCopied(false);
    }
  };

  return (
    <article
      ref={cardRef}
      className="group flex min-w-0 flex-col overflow-hidden rounded-[1.75rem] border border-foreground bg-background transition-transform duration-300 hover:-translate-y-1 hover:shadow-[7px_7px_0_var(--ink)]"
    >
      <div
        className={`relative flex flex-col justify-between overflow-hidden p-6 sm:p-7 ${moreText ? "min-h-[280px]" : "min-h-[210px]"}`}
        style={{ background: effect.color }}
      >
        <span className="chip w-fit bg-white/85">{effect.category}</span>
        {effect.category === "Scroll" ? (
          <div className="mt-7">
            <p className="font-display text-3xl font-extrabold leading-none tracking-tight sm:text-4xl">
              {demoText}
            </p>
            <a
              href="/#scroll-effects"
              className="mt-5 inline-flex items-center gap-1 text-sm font-semibold underline decoration-2 underline-offset-4"
            >
              Watch it on the home page <ArrowUpRight className="size-4" aria-hidden />
            </a>
          </div>
        ) : (
          <div className="mt-5 flex min-h-[112px] items-center">
            <p
              ref={textRef}
              style={effect.category === "Interact" ? { touchAction: "none" } : undefined}
              className={`w-full font-display text-3xl leading-none tracking-tight sm:text-4xl ${demoWeight}`}
            >
              {demoText}
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6 sm:p-7">
        <div>
          <h3 className="font-display text-xl font-extrabold tracking-tight">{effect.name}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {effect.description}
          </p>
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={copy}
            aria-label={`Copy import for ${effect.name}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-foreground px-3 py-2 font-mono text-[0.7rem] transition-colors hover:bg-[var(--lemon)]"
          >
            {copied ? (
              <Check className="size-3.5" aria-hidden />
            ) : (
              <Copy className="size-3.5" aria-hidden />
            )}
            {copied ? "Copied" : "Copy import"}
          </button>
          {(effect.category === "Intro" || effect.category === "Outro") && (
            <button
              type="button"
              onClick={() => setReplay((value) => value + 1)}
              className="inline-flex items-center gap-1.5 rounded-full border border-foreground/30 px-3 py-2 font-mono text-[0.7rem] transition-colors hover:border-foreground hover:bg-[var(--mint)]"
            >
              <RotateCcw className="size-3.5" aria-hidden /> Replay
            </button>
          )}
        </div>
        <code className="break-all font-mono text-[0.65rem] leading-relaxed text-muted-foreground">
          {importCode}
        </code>
      </div>
    </article>
  );
}

export function AnimationGallery() {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const [moreText, setMoreText] = useState(false);
  const shown = active === "All" ? effects : effects.filter((effect) => effect.category === active);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="tablist" aria-label="Filter animations" className="flex flex-wrap gap-2">
        {filters.map((filter, index) => (
          <button
            key={filter}
            type="button"
            role="tab"
            id={`filter-${filter.toLowerCase()}`}
            aria-controls="gallery-panel"
            aria-selected={active === filter}
            tabIndex={active === filter ? 0 : -1}
            onClick={() => setActive(filter)}
            onKeyDown={(event) => {
              if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
              event.preventDefault();
              const next =
                (index + (event.key === "ArrowRight" ? 1 : -1) + filters.length) % filters.length;
              setActive(filters[next] ?? "All");
              event.currentTarget.parentElement
                ?.querySelectorAll<HTMLButtonElement>("[role=tab]")
                [next]?.focus();
            }}
            className="rounded-full border border-foreground px-4 py-2 font-mono text-xs transition-colors hover:bg-[var(--lemon)] aria-selected:bg-foreground aria-selected:text-background"
          >
            {filter}
          </button>
        ))}
        </div>
        <button
          type="button"
          aria-pressed={moreText}
          onClick={() => setMoreText((value) => !value)}
          className="rounded-full border border-foreground px-4 py-2 font-mono text-xs transition-colors hover:bg-[var(--mint)] aria-pressed:bg-[var(--mint)]"
        >
          More text
        </button>
      </div>
      <div
        id="gallery-panel"
        role="tabpanel"
        aria-labelledby={`filter-${active.toLowerCase()}`}
        className="mt-8"
      >
        <p className="mb-6 font-mono text-xs text-muted-foreground">
          Showing {shown.length} {active === "All" ? "effects" : `${active.toLowerCase()} effects`}
        </p>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((effect) => (
            <GalleryCard key={`${effect.name}-${moreText}`} effect={effect} moreText={moreText} />
          ))}
        </div>
      </div>
    </>
  );
}
