import { readingLine, scatterReassemble, waveRelay } from "words-in-motion/scroll";
import { ScrubText } from "@/components/AnimatedText";
import { LabelChip } from "@/components/CodeChip";

const BLOCKS = [
  {
    name: "readingLine",
    color: "var(--lemon)",
    effect: readingLine,
    options: { start: "top 85%", end: "top 25%", by: "words" as const, smooth: 0.25 },
    text: "Reading is motion already. Your eye sweeps, pauses, jumps back. readingLine just makes that sweep visible, word by word, exactly as fast as the reader scrolls.",
  },
  {
    name: "scatterReassemble",
    color: "var(--mint)",
    effect: scatterReassemble,
    options: { start: "top 90%", end: "top 30%", smooth: 0.2 },
    text: "Chaos, then order. Letters arrive scattered across the block and settle into place in reading order, so the sentence assembles itself while you scroll toward it.",
  },
  {
    name: "waveRelay",
    color: "var(--violet)",
    effect: waveRelay,
    options: { start: "top 90%", end: "top 25%", smooth: 0.18 },
    text: "One letter runs the whole line like a relay, nudging its neighbours aside as it passes, then handing the motion over at the end of every wrapped row.",
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
                className="mt-6 font-display text-2xl leading-[1.15] font-extrabold tracking-tight sm:text-4xl md:text-5xl"
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
