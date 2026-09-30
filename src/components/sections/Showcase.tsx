import { useEffect, useRef } from "react";
import {
  chunkedScramble,
  directionalReveal,
  lampFlicker,
  pixelResolve,
  rise,
  stripRealign,
} from "words-in-motion/intro";
import {
  blackHole,
  blurAway,
  breakAndFade,
  hingeDrop,
  paperCut,
  windScatter,
} from "words-in-motion/outro";
import { createScrollTrigger } from "words-in-motion/scroll";
import { CodeChip, LabelChip } from "@/components/CodeChip";
import { useFontsReady } from "@/lib/motion";

type Handle = { finished: Promise<void>; cancel: () => void };
type Fx = (target: HTMLElement, options?: Record<string, unknown>) => Handle;

type Pair = {
  intro: string;
  outro: string;
  introFn: Fx;
  outroFn: Fx;
  color: string;
  side: "left" | "right";
  text: string;
};

const PAIRS: Pair[] = [
  {
    intro: "directionalReveal",
    outro: "blackHole",
    introFn: directionalReveal as Fx,
    outroFn: blackHole as Fx,
    color: "var(--tomato)",
    side: "left",
    text: "Arrive with intent. Leave through a hole in the page.",
  },
  {
    intro: "lampFlicker",
    outro: "paperCut",
    introFn: lampFlicker as Fx,
    outroFn: paperCut as Fx,
    color: "var(--blue)",
    side: "right",
    text: "Flicker on like an old sign above a good bar.",
  },
  {
    intro: "rise",
    outro: "breakAndFade",
    introFn: rise as Fx,
    outroFn: breakAndFade as Fx,
    color: "var(--lemon)",
    side: "left",
    text: "Rise quietly. Break apart when nobody is watching.",
  },
  {
    intro: "chunkedScramble",
    outro: "hingeDrop",
    introFn: chunkedScramble as Fx,
    outroFn: hingeDrop as Fx,
    color: "var(--mint)",
    side: "right",
    text: "Scrambled first, legible second. That is the whole trick.",
  },
  {
    intro: "stripRealign",
    outro: "blurAway",
    introFn: stripRealign as Fx,
    outroFn: blurAway as Fx,
    color: "var(--violet)",
    side: "left",
    text: "Slide the strips back into line, then blur out of focus.",
  },
  {
    intro: "pixelResolve",
    outro: "windScatter",
    introFn: pixelResolve as Fx,
    outroFn: windScatter as Fx,
    color: "var(--tomato)",
    side: "right",
    text: "Resolve pixel by pixel. Blow away on the next gust.",
  },
];

type State = "idle" | "introPlaying" | "shown" | "outroPlaying" | "hidden";

function ShowcaseBlock({ pair }: { pair: Pair }) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const fontsReady = useFontsReady();

  useEffect(() => {
    const el = textRef.current;
    if (!fontsReady || !el) return;

    let state: State = "idle";
    let active: Handle | null = null;
    let disposed = false;

    const playIntro = (): Handle => {
      active?.cancel();
      state = "introPlaying";
      const handle = pair.introFn(el, { duration: 1200 });
      active = handle;
      handle.finished
        .then(() => {
          if (!disposed && active === handle) state = "shown";
        })
        .catch(() => {});
      return handle;
    };

    const playOutro = () => {
      active?.cancel();
      state = "outroPlaying";
      const handle = pair.outroFn(el, { duration: 1100 });
      active = handle;
      handle.finished
        .then(() => {
          if (!disposed && active === handle) state = "hidden";
        })
        .catch(() => {});
    };

    const trigger = createScrollTrigger(el, { start: "top 80%", repeat: true }, () =>
      playIntro(),
    );

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (disposed) return;
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const exitLine = window.innerHeight * 0.25;

        if (center < exitLine) {
          if (state === "shown" || state === "introPlaying") playOutro();
        } else if (center < window.innerHeight * 0.85) {
          if (state === "hidden" || state === "outroPlaying") playIntro();
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      disposed = true;
      window.removeEventListener("scroll", onScroll);
      active?.cancel();
      trigger.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontsReady]);

  return (
    <div
      className={`flex w-full flex-col gap-5 md:max-w-[62%] ${
        pair.side === "right" ? "md:ml-auto md:items-end md:text-right" : ""
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <LabelChip color={pair.color}>
          intro: {pair.intro} / outro: {pair.outro}
        </LabelChip>
        <CodeChip
          code={`${pair.intro}(el); ${pair.outro}(el);`}
          label={`${pair.intro} snippet`}
        />
      </div>
      <p
        ref={textRef}
        className="min-h-[7.5rem] font-display text-3xl leading-[1.05] font-extrabold tracking-tight sm:min-h-[9rem] sm:text-5xl md:min-h-[11rem] md:text-6xl"
      >
        {pair.text}
      </p>
    </div>
  );
}

export function Showcase() {
  return (
    <section className="relative px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1200px]">
        <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Intro / outro
        </p>
        <h2 className="mt-4 max-w-[18ch] text-4xl md:text-6xl">
          Entrances worth staying for. Exits worth scrolling back up for.
        </h2>

        <div className="mt-24 space-y-40 md:space-y-56">
          {PAIRS.map((p) => (
            <ShowcaseBlock key={p.intro} pair={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
