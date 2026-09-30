import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
import { HERO_SCROLL_EVENT, SKIP_OUTRO_EVENT } from "@/lib/scroll-navigation";
import { CodeChip, LabelChip } from "@/components/CodeChip";
import { useFontsReady, useReducedMotion } from "@/lib/motion";

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
  outroLeadMs: number;
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
    outroLeadMs: 1200,
  },
  {
    intro: "lampFlicker",
    outro: "paperCut",
    introFn: lampFlicker as Fx,
    outroFn: paperCut as Fx,
    color: "var(--blue)",
    side: "right",
    text: "Flicker on like an old sign above a good bar.",
    outroLeadMs: 1050,
  },
  {
    intro: "rise",
    outro: "breakAndFade",
    introFn: rise as Fx,
    outroFn: breakAndFade as Fx,
    color: "var(--lemon)",
    side: "left",
    text: "Rise quietly. Break apart when nobody is watching.",
    outroLeadMs: 1350,
  },
  {
    intro: "chunkedScramble",
    outro: "hingeDrop",
    introFn: chunkedScramble as Fx,
    outroFn: hingeDrop as Fx,
    color: "var(--mint)",
    side: "right",
    text: "Scrambled first, legible second. That is the whole trick.",
    outroLeadMs: 1300,
  },
  {
    intro: "stripRealign",
    outro: "blurAway",
    introFn: stripRealign as Fx,
    outroFn: blurAway as Fx,
    color: "var(--violet)",
    side: "left",
    text: "Slide the strips back into line, then blur out of focus.",
    outroLeadMs: 1000,
  },
  {
    intro: "pixelResolve",
    outro: "windScatter",
    introFn: pixelResolve as Fx,
    outroFn: windScatter as Fx,
    color: "var(--tomato)",
    side: "right",
    text: "Resolve pixel by pixel. Blow away on the next gust.",
    outroLeadMs: 1300,
  },
];

function ShowcaseBlock({
  pair,
  index,
  stageSlot,
  reverseActive,
  lastIntroDone,
  introHandles,
  blockRefs,
  textRefs,
}: {
  pair: Pair;
  index: number;
  stageSlot: HTMLDivElement | null;
  reverseActive: boolean;
  lastIntroDone: boolean;
  introHandles: React.RefObject<(Handle | null)[]>;
  blockRefs: React.RefObject<(HTMLDivElement | null)[]>;
  textRefs: React.RefObject<(HTMLParagraphElement | null)[]>;
}) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const fontsReady = useFontsReady();
  const inStage = index === 5 || reverseActive;
  const introEnabled = index !== 5 && !reverseActive;

  useEffect(() => {
    const el = textRef.current;
    if (!fontsReady || !el || !introEnabled) return;

    let active: Handle | null = null;
    let inView = false;
    const handles = introHandles.current;
    const stop = () => {
      active?.cancel();
      active = null;
      handles[index] = null;
    };
    const setInView = (next: boolean) => {
      if (next === inView) return;
      inView = next;
      stop();
      if (!inView) return;
      active = pair.introFn(el, { duration: 1500 });
      handles[index] = active;
    };

    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return stop;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting && entry.intersectionRatio > 0)),
      { rootMargin: "-25% 0px -25% 0px", threshold: 0.01 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      stop();
    };
  }, [fontsReady, pair, introEnabled, stageSlot, index, introHandles]);

  const content = (
    <div
      ref={(element) => { blockRefs.current[index] = element; }}
      data-state={inStage ? (index === 5 ? "onStage" : "idle") : undefined}
      aria-hidden={inStage && index !== 5}
      className={inStage
        ? `absolute inset-0 flex flex-col justify-center gap-6 will-change-transform md:max-w-[62%] ${pair.side === "right" ? "md:ml-auto md:items-end md:text-right" : ""}`
        : `flex w-full flex-col gap-5 md:max-w-[62%] ${pair.side === "right" ? "md:ml-auto md:items-end md:text-right" : ""}`}
      style={inStage ? { visibility: index === 5 ? "visible" : "hidden", transform: index === 5 ? REST : ABOVE } : undefined}
    >
      <div className={inStage
        ? pair.side === "right" ? "self-start md:self-end" : "self-start"
        : "flex flex-wrap items-center gap-2"}
      >
        <LabelChip color={pair.color}>
          {reverseActive && (index !== 5 || lastIntroDone) ? `outro: ${pair.outro}` : `intro: ${pair.intro}`}
        </LabelChip>
        {!inStage && <CodeChip code={`${pair.intro}(el);`} label={`${pair.intro} snippet`} />}
      </div>
      <p
        ref={(element) => { textRef.current = element; textRefs.current[index] = element; }}
        className={inStage
          ? "font-display text-3xl leading-[1.05] font-extrabold tracking-tight sm:text-5xl md:text-6xl"
          : "min-h-[7.5rem] font-display text-3xl leading-[1.05] font-extrabold tracking-tight sm:min-h-[9rem] sm:text-5xl md:min-h-[11rem] md:text-6xl"}
      >
        {pair.text}
      </p>
    </div>
  );

  if (index === 5) return stageSlot && createPortal(content, stageSlot);
  return <div className="min-h-[11rem]">{reverseActive ? stageSlot && createPortal(content, stageSlot) : content}</div>;
}

type BlockState = "idle" | "onStage" | "exiting" | "gone";
const REST = "translate3d(0, 0, 0)";
const ABOVE = "translate3d(0, -110vh, 0)";

function exitTransform(pair: Pair) {
  return pair.side === "left" ? "translate3d(110vw, 0, 0)" : "translate3d(-110vw, 0, 0)";
}

function PinnedReversePass({
  introHandles,
  blockRefs,
  textRefs,
  slotRefs,
  stageEntered,
  setStageEntered,
  reverseActive,
  setReverseActive,
  setLastIntroDone,
}: {
  introHandles: React.RefObject<(Handle | null)[]>;
  blockRefs: React.RefObject<(HTMLDivElement | null)[]>;
  textRefs: React.RefObject<(HTMLParagraphElement | null)[]>;
  slotRefs: React.RefObject<(HTMLDivElement | null)[]>;
  stageEntered: boolean;
  setStageEntered: (entered: boolean) => void;
  reverseActive: boolean;
  setReverseActive: (active: boolean) => void;
  setLastIntroDone: (done: boolean) => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const bypassUntilRef = useRef(0);
  const fontsReady = useFontsReady();
  const [hintHidden, setHintHidden] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const onScroll = () => {
      if (performance.now() < bypassUntilRef.current) return;
      const rect = wrapper.getBoundingClientRect();
      if (rect.top < window.innerHeight) setStageEntered(true);
      if (rect.top <= 1 && rect.bottom > 0) setReverseActive(true);
    };
    const onWheel = (event: WheelEvent) => {
      if (reverseActive || !event.cancelable || performance.now() < bypassUntilRef.current) return;
      const rect = wrapper.getBoundingClientRect();
      if (event.deltaY > 0 && rect.top > 1 && rect.top < window.innerHeight && event.deltaY >= rect.top) {
        event.preventDefault();
        window.scrollTo({ top: window.scrollY + rect.top, behavior: "instant" });
        setStageEntered(true);
        setReverseActive(true);
      } else if (event.deltaY < 0 && rect.bottom < window.innerHeight && rect.bottom > 0 && -event.deltaY >= window.innerHeight - rect.bottom) {
        event.preventDefault();
        window.scrollTo({ top: window.scrollY + rect.bottom - window.innerHeight, behavior: "instant" });
        setStageEntered(true);
        setReverseActive(true);
      }
    };
    const onHeroScroll = () => {
      bypassUntilRef.current = performance.now() + 2000;
      setReverseActive(false);
    };
    const onSkipOutro = () => {
      bypassUntilRef.current = performance.now() + 2000;
      setReverseActive(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener(HERO_SCROLL_EVENT, onHeroScroll);
    window.addEventListener(SKIP_OUTRO_EVENT, onSkipOutro);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel, true);
      window.removeEventListener(HERO_SCROLL_EVENT, onHeroScroll);
      window.removeEventListener(SKIP_OUTRO_EVENT, onSkipOutro);
    };
  }, [reverseActive, setReverseActive, setStageEntered]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!fontsReady || !wrapper || !reverseActive || !stageEntered || !blockRefs.current[5]) return;

    const travel = Math.max(1, wrapper.offsetHeight - window.innerHeight);
    const initialProgress = Math.max(0, Math.min(1, -wrapper.getBoundingClientRect().top / travel));
    let completedStep = initialProgress >= 1 ? 6 : Math.min(5, Math.floor(initialProgress * 6));
    const states: BlockState[] = PAIRS.map((_, index) =>
      index === 5 - completedStep ? "onStage" : index > 5 - completedStep ? "gone" : "idle");
    const stageTexts = [...textRefs.current];
    const originalTextOpacity = PAIRS.map((_, index) => stageTexts[index]?.style.opacity ?? "");
    const handles = introHandles.current;
    const outroHandles: (Handle | null)[] = PAIRS.map(() => null);
    const animations = new Set<Animation>();
    let targetStep = completedStep;
    let running = false;
    let disposed = false;
    let scrollFrame = 0;

    const setBlockState = (index: number, state: BlockState) => {
      const block = blockRefs.current[index];
      states[index] = state;
      if (!block) return;
      block.dataset["state"] = state;
      block.style.visibility = state === "idle" || state === "gone" ? "hidden" : "visible";
      block.setAttribute("aria-hidden", state === "idle" || state === "gone" ? "true" : "false");
    };

    PAIRS.forEach((_, index) => {
      const block = blockRefs.current[index];
      if (!block) return;
      block.style.transform = states[index] === "onStage" ? REST : states[index] === "gone" ? exitTransform(PAIRS[index]!) : ABOVE;
      setBlockState(index, states[index] ?? "idle");
    });

    if (completedStep === 0 && textRefs.current[5]) {
      setLastIntroDone(false);
      const intro = PAIRS[5]!.introFn(textRefs.current[5], { duration: 1500 });
      handles[5] = intro;
      void intro.finished.then(() => {
        if (!disposed) setLastIntroDone(true);
      }).catch(() => {});
    } else {
      setLastIntroDone(true);
    }

    const move = async (block: HTMLElement, from: string, to: string, duration: number, easing: string, delay = 0) => {
      block.style.transform = from;
      const animation = block.animate([{ transform: from }, { transform: to }], {
        duration,
        delay,
        easing,
        fill: "forwards",
      });
      animations.add(animation);
      try {
        await animation.finished;
      } catch {
        // Unmount cancels in-flight animations.
      }
      if (!disposed) block.style.transform = to;
      animation.cancel();
      animations.delete(animation);
    };

    const forward = async (step: number) => {
      const index = 5 - step;
      const block = blockRefs.current[index];
      const text = textRefs.current[index];
      const pair = PAIRS[index];
      if (!block || !text || !pair) return;

      if (step === 0) await handles[5]?.finished.catch(() => {});
      if (disposed) return;
      setBlockState(index, "exiting");
      const outro = pair.outroFn(text, { duration: 1600, keep: true });
      outroHandles[index] = outro;
      await Promise.all([
        outro.finished.then(() => {
          if (!disposed && outroHandles[index] === outro) text.style.opacity = "0";
        }).catch(() => {}),
        move(block, REST, exitTransform(pair), 1250, "ease-in-out", pair.outroLeadMs),
      ]);
      if (disposed) return;
      setBlockState(index, "gone");

      if (index > 0) {
        const next = blockRefs.current[index - 1];
        if (!next) return;
        setBlockState(index - 1, "onStage");
        await move(next, ABOVE, REST, 850, "ease-out");
        if (!disposed) setBlockState(index - 1, "onStage");
      }
    };

    const backward = async (step: number) => {
      const newerIndex = 5 - step;
      if (newerIndex >= 0) {
        const newer = blockRefs.current[newerIndex];
        if (newer) {
          setBlockState(newerIndex, "exiting");
          await move(newer, REST, ABOVE, 850, "ease-in-out");
          if (disposed) return;
          setBlockState(newerIndex, "idle");
        }
      }

      const oldIndex = 6 - step;
      const old = blockRefs.current[oldIndex];
      const pair = PAIRS[oldIndex];
      if (!old || !pair) return;
      outroHandles[oldIndex]?.cancel();
      outroHandles[oldIndex] = null;
      const oldText = textRefs.current[oldIndex];
      if (oldText) oldText.style.opacity = originalTextOpacity[oldIndex] ?? "";
      setBlockState(oldIndex, "onStage");
      await move(old, exitTransform(pair), REST, 950, "ease-out");
      if (!disposed) setBlockState(oldIndex, "onStage");
    };

    const zonePosition = (step: number) =>
      window.scrollY + wrapper.getBoundingClientRect().top + (travel * step) / 6;

    const snapToZone = (step: number) => {
      window.scrollTo({ top: zonePosition(step), behavior: "instant" });
    };

    const drain = async () => {
      if (running || targetStep === completedStep) return;
      running = true;
      const nextStep = targetStep;
      if (nextStep > completedStep) await forward(completedStep);
      else await backward(completedStep);
      if (disposed) return;
      completedStep = nextStep;
      if (completedStep > 0) setHintHidden(true);
      running = false;
    };

    const requestStep = (direction: 1 | -1) => {
      if (running) return;
      const next = Math.max(0, Math.min(6, completedStep + direction));
      if (next === completedStep) return;
      targetStep = next;
      snapToZone(next);
      void drain();
    };

    const inPinnedStage = () => {
      const rect = wrapper.getBoundingClientRect();
      return rect.top <= 1 && rect.bottom >= window.innerHeight - 1;
    };

    const onWheel = (event: WheelEvent) => {
      if (!event.cancelable) return;
      if (running) {
        event.preventDefault();
        return;
      }
      if (!inPinnedStage()) return;
      if (event.deltaY > 0 && completedStep < 6) {
        event.preventDefault();
        requestStep(1);
      } else if (event.deltaY < 0 && completedStep > 0) {
        event.preventDefault();
        requestStep(-1);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.target instanceof HTMLInputElement) return;
      const direction = ["ArrowDown", "PageDown", " "].includes(event.key) ? 1
        : ["ArrowUp", "PageUp"].includes(event.key) ? -1 : 0;
      if (!direction || !inPinnedStage()) return;
      if (running || (direction > 0 && completedStep < 6) || (direction < 0 && completedStep > 0)) {
        event.preventDefault();
        if (!running) requestStep(direction as 1 | -1);
      }
    };

    let touchStartY = 0;
    let touchStepped = false;
    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
      touchStepped = false;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (!event.cancelable || !inPinnedStage()) return;
      const delta = touchStartY - (event.touches[0]?.clientY ?? touchStartY);
      if (running) {
        event.preventDefault();
        return;
      }
      const direction = delta > 25 ? 1 : delta < -25 ? -1 : 0;
      if ((direction > 0 && completedStep < 6) || (direction < 0 && completedStep > 0)) {
        event.preventDefault();
        if (direction && !touchStepped) {
          touchStepped = true;
          requestStep(direction as 1 | -1);
        }
      }
    };

    const updateTarget = () => {
      scrollFrame = 0;
      if (disposed) return;
      const rect = wrapper.getBoundingClientRect();
      if (completedStep === 0 && !running && rect.top > 2) {
        setReverseActive(false);
        return;
      }
      if (completedStep === 6 && !running && rect.bottom < window.innerHeight) return;
      const progress = Math.max(0, Math.min(1, -rect.top / travel));
      const zone = progress >= 1 ? 6 : Math.min(5, Math.floor(progress * 6));
      if (running) {
        if (Math.abs(window.scrollY - zonePosition(targetStep)) > 2) snapToZone(targetStep);
      } else if (zone !== completedStep) {
        requestStep(zone > completedStep ? 1 : -1);
      }
    };

    const onScroll = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateTarget);
    };

    const onHeroScroll = () => {
      disposed = true;
      setReverseActive(false);
    };

    const onSkipOutro = () => {
      disposed = true;
      setReverseActive(false);
      window.scrollTo({
        top: window.scrollY + wrapper.getBoundingClientRect().bottom,
        behavior: "instant",
      });
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("keydown", onKeyDown, { capture: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener(HERO_SCROLL_EVENT, onHeroScroll);
    window.addEventListener(SKIP_OUTRO_EVENT, onSkipOutro);
    onScroll();

    return () => {
      disposed = true;
      window.removeEventListener("wheel", onWheel, true);
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove, true);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener(HERO_SCROLL_EVENT, onHeroScroll);
      window.removeEventListener(SKIP_OUTRO_EVENT, onSkipOutro);
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
      animations.forEach((animation) => animation.cancel());
      outroHandles.forEach((handle) => handle?.cancel());
      stageTexts.forEach((text, index) => {
        if (text) text.style.opacity = originalTextOpacity[index] ?? "";
      });
      handles[5]?.cancel();
      handles[5] = null;
    };
  }, [fontsReady, reverseActive, stageEntered, setReverseActive, setLastIntroDone, introHandles, blockRefs, textRefs]);

  return (
    <div id="reverse-pass" ref={wrapperRef} data-native-scroll-stage className="relative h-[600vh]">
      <div className="sticky top-0 h-screen overflow-x-clip overflow-y-visible border-y border-foreground/15 bg-background px-5 md:px-10">
        <div className="relative mx-auto h-full max-w-[1200px]">
          {PAIRS.map((pair, index) => (
            <div key={pair.intro} ref={(element) => { slotRefs.current[index] = element; }} className="absolute inset-0" />
          ))}
          <p aria-hidden={hintHidden} className={`absolute bottom-8 left-0 font-mono text-xs tracking-widest text-muted-foreground uppercase transition-opacity duration-500 ${hintHidden ? "opacity-0" : "opacity-100"}`}>
            Keep scrolling ↓
          </p>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(SKIP_OUTRO_EVENT))}
            className="absolute right-0 bottom-8 rounded-full border border-foreground bg-background/85 px-3 py-2 font-mono text-[0.65rem] tracking-wide uppercase backdrop-blur-md transition-colors hover:bg-foreground hover:text-background"
          >
            Skip animation ↓
          </button>
        </div>
      </div>
    </div>
  );
}

function ReversePass({
  introHandles,
  blockRefs,
  textRefs,
  slotRefs,
  stageEntered,
  setStageEntered,
  reverseActive,
  setReverseActive,
  setLastIntroDone,
}: {
  introHandles: React.RefObject<(Handle | null)[]>;
  blockRefs: React.RefObject<(HTMLDivElement | null)[]>;
  textRefs: React.RefObject<(HTMLParagraphElement | null)[]>;
  slotRefs: React.RefObject<(HTMLDivElement | null)[]>;
  stageEntered: boolean;
  setStageEntered: (entered: boolean) => void;
  reverseActive: boolean;
  setReverseActive: (active: boolean) => void;
  setLastIntroDone: (done: boolean) => void;
}) {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <div className="mt-40 md:mt-56">
      <PinnedReversePass introHandles={introHandles} blockRefs={blockRefs} textRefs={textRefs} slotRefs={slotRefs} stageEntered={stageEntered} setStageEntered={setStageEntered} reverseActive={reverseActive} setReverseActive={setReverseActive} setLastIntroDone={setLastIntroDone} />
    </div>
  );
}

export function Showcase() {
  const introHandles = useRef<(Handle | null)[]>([]);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [stageEntered, setStageEntered] = useState(false);
  const [reverseActive, setReverseActive] = useState(false);
  const [lastIntroDone, setLastIntroDone] = useState(false);
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-x-clip px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1200px]">
        <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Intro / outro
        </p>
        <h2 className="mt-4 max-w-[18ch] text-4xl md:text-6xl">
          Entrances worth staying for. Exits worth scrolling back up for.
        </h2>

        <div className="mt-24 space-y-40 md:space-y-56">
          {PAIRS.slice(0, reduced ? 6 : 5).map((p, index) => (
            <ShowcaseBlock key={p.intro} pair={p} index={index} stageSlot={slotRefs.current[index] ?? null} reverseActive={reverseActive} lastIntroDone={lastIntroDone} introHandles={introHandles} blockRefs={blockRefs} textRefs={textRefs} />
          ))}
        </div>
      </div>
      <ReversePass introHandles={introHandles} blockRefs={blockRefs} textRefs={textRefs} slotRefs={slotRefs} stageEntered={stageEntered} setStageEntered={setStageEntered} reverseActive={reverseActive} setReverseActive={setReverseActive} setLastIntroDone={setLastIntroDone} />
      {!reduced && <ShowcaseBlock pair={PAIRS[5]!} index={5} stageSlot={stageEntered ? slotRefs.current[5] ?? null : null} reverseActive={reverseActive} lastIntroDone={lastIntroDone} introHandles={introHandles} blockRefs={blockRefs} textRefs={textRefs} />}
    </section>
  );
}
