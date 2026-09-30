import { createFileRoute } from "@tanstack/react-router";
import { AnimationGallery } from "@/components/AnimationGallery";
import { Blobs } from "@/components/Blobs";

const title = "Animations gallery — words-in-motion";
const description =
  "Browse every intro, outro, loop, scroll and cursor effect in words-in-motion side by side.";

export const Route = createFileRoute("/animations")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Animations,
});

function Animations() {
  return (
    <main>
      <section className="relative border-b border-foreground/10 px-5 pt-36 pb-20 md:px-10 md:pt-44 md:pb-28">
        <Blobs />
        <div className="relative mx-auto max-w-[1400px]">
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Animations / 03</p>
          <h1 className="mt-4 max-w-[13ch] text-5xl leading-[0.98] sm:text-6xl md:text-8xl">Every word has a move.</h1>
          <p className="mt-7 max-w-[58ch] text-lg leading-relaxed text-muted-foreground md:text-xl">Twenty-nine effects, five families, zero stage fright. Filter the cast, hover over the cursor tricks, and give an entrance another take.</p>
        </div>
      </section>
      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <AnimationGallery />
      </section>
    </main>
  );
}
