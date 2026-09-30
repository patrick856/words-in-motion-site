import { readingLine, scatterReassemble, waveRelay } from "words-in-motion/scroll";
import { ScrubText } from "@/components/AnimatedText";
import { LabelChip } from "@/components/CodeChip";

const BLOCKS = [
  {
    name: "readingLine",
    color: "var(--lemon)",
    effect: readingLine,
    options: { start: "top 78%", end: "top 18%", by: "words" as const, smooth: 0.25 },
    text: "Reading is motion already.\nYour eye sweeps.   Pauses.   Jumps back.\nreadingLine makes every beat visible as you scroll.",
  },
  {
    name: "scatterReassemble",
    color: "var(--mint)",
    effect: scatterReassemble,
    options: { start: "top 82%", end: "top 22%", smooth: 0.2 },
    text: "Chaos first.   Then order.\nLetters arrive apart.   Words find each other.\nThe sentence settles back into place.",
  },
  {
    name: "waveRelay",
    color: "var(--violet)",
    effect: waveRelay,
    options: { start: "top 82%", end: "top 18%", smooth: 0.18 },
    text: "One letter starts the relay.\nThe next follows.   Then another.\nA wave crosses each wrapped line and carries the sentence forward.",
  },
];

export function ScrollSection() {
  return (
    <section id="scroll-effects" className="relative scroll-mt-20 px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1100px]">
        <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Scroll-driven
        </p>
        <h2 className="mt-4 max-w-[18ch] text-4xl md:text-6xl">
          Scrub effects that move at the speed of your thumb.
        </h2>

        <div className="mt-16 space-y-28 md:space-y-44">
          {BLOCKS.map((b) => (
            <div key={b.name}>
              <LabelChip color={b.color}>{b.name}</LabelChip>
              <ScrubText
                effect={b.effect as never}
                options={b.options}
                className="mt-6 whitespace-pre-wrap font-display text-2xl leading-[1.12] font-extrabold tracking-tight sm:text-4xl md:text-5xl"
              >
                {b.text}
              </ScrubText>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
