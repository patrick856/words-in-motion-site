import { readingLine, scatterReassemble, waveRelay } from "words-in-motion/scroll";
import { ScrubText } from "@/components/AnimatedText";
import { LabelChip } from "@/components/CodeChip";

const BLOCKS = [
  {
    name: "readingLine",
    color: "var(--lemon)",
    effect: readingLine,
    options: { start: "top 78%", end: "top 18%", by: "words" as const, smooth: 0.25 },
    text: "Reading is motion.\n\nYour eye sweeps.    Pauses.    Jumps back.\n\nreadingLine makes the rhythm visible.",
  },
  {
    name: "scatterReassemble",
    color: "var(--mint)",
    effect: scatterReassemble,
    options: { start: "top 82%", end: "top 22%", smooth: 0.2 },
    text: "Chaos.\n\nThen order.\n\nLetters scatter.    Words return.    The sentence settles.",
  },
  {
    name: "waveRelay",
    color: "var(--violet)",
    effect: waveRelay,
    options: { start: "top 82%", end: "top 18%", smooth: 0.18 },
    text: "One letter starts.\n\nThe next one follows.    Then another.\n\nA wave crosses every line.",
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

        <div className="mt-20 space-y-40 md:space-y-64">
          {BLOCKS.map((b) => (
            <div key={b.name}>
              <LabelChip color={b.color}>{b.name}</LabelChip>
              <ScrubText
                effect={b.effect as never}
                options={b.options}
                className="mt-6 whitespace-pre-wrap font-display text-2xl leading-[1.2] font-extrabold tracking-tight sm:text-4xl md:text-5xl"
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
