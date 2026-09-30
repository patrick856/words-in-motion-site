import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Callout, ContentPage, ContentSection } from "@/components/ContentPage";

const title = "Changelog — words-in-motion";
const description = "Release notes and version history for the words-in-motion package.";

export const Route = createFileRoute("/changelog")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Changelog,
});

const sections = [
  { id: "v013", label: "v0.1.3" },
  { id: "v0", label: "v0.1.0–v0.1.2" },
  { id: "next", label: "What's next" },
];

const categories = [
  {
    name: "Intro",
    color: "var(--tomato)",
    text: "Six ways to make an entrance, from a quiet rise to a pixel-by-pixel reveal.",
  },
  {
    name: "Loop",
    color: "var(--lemon)",
    text: "Five motions that keep breathing until you tell them to stop.",
  },
  {
    name: "Outro",
    color: "var(--violet)",
    text: "Six exits with a proper goodbye and a clean way back.",
  },
  {
    name: "Interact",
    color: "var(--mint)",
    text: "Nine cursor-reactive effects for curious pointers and touchscreens.",
  },
  {
    name: "Scroll",
    color: "var(--blue)",
    text: "Viewport triggers and three scrubs that move with the reader.",
  },
];

function Changelog() {
  return (
    <ContentPage
      kicker="Changelog / 04"
      title="Little notes. Big moves."
      intro="A running record of what the words learned to do. The first chapter is already moving."
      sections={sections}
    >
      <ContentSection id="v013" eyebrow="Release / v0.1.3" title="More room to move.">
        <p>
          Version 0.1.3 sharpens text layout where bold type, tight tracking and responsive flex
          containers meet animation.
        </p>
        <div className="space-y-4">
          <div className="rounded-2xl border border-foreground/15 p-5">
            <h3 className="text-xl">Cleaner directional reveals</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Clip frames now account for the visible edges of each glyph—including negative letter
              spacing—so large, tightly tracked headlines arrive without shaved-off sides.
            </p>
          </div>
          <div className="rounded-2xl border border-foreground/15 p-5">
            <h3 className="text-xl">Flex text keeps wrapping</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Split text inside flex and inline-flex targets now preserves its natural line wrapping
              throughout the animation and restores the original DOM cleanly.
            </p>
          </div>
        </div>
        <Callout color="var(--blue)">
          Update with <code>npm install words-in-motion@0.1.3</code> to pick up both layout fixes.
        </Callout>
      </ContentSection>

      <ContentSection
        id="v0"
        eyebrow="Initial releases / v0.1.0–v0.1.2"
        title="Hello, world. Now move."
      >
        <p>
          The 0.1.x line groups versions 0.1.0, 0.1.1 and 0.1.2. Together they brought the full
          toolkit into the open: standalone typographic effects, five ways to use them, and zero
          runtime dependencies.
        </p>
        <div className="relative ml-2 border-l-2 border-foreground/15 pl-7">
          {categories.map((category) => (
            <div key={category.name} className="relative pb-7 last:pb-0">
              <span
                className="absolute -left-[37px] top-1 size-4 rounded-full border-2 border-foreground"
                style={{ background: category.color }}
                aria-hidden
              />
              <h3 className="text-xl">{category.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{category.text}</p>
            </div>
          ))}
        </div>
        <Callout color="var(--mint)">
          The package ships category subpath imports, SSR-safe modules, built-in reduced-motion
          behavior and cleanup handles for every effect.
        </Callout>
        <Link
          to="/animations"
          className="inline-flex items-center gap-2 rounded-full border border-foreground bg-[var(--lemon)] px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
        >
          Meet the effects <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </ContentSection>

      <ContentSection id="next" eyebrow="Upcoming versions" title="More soon.">
        <p>
          This timeline will grow with each release. Until then, take the current set for a spin and
          make something with it.
        </p>
        <div className="rounded-2xl border border-dashed border-foreground/25 p-6">
          <span className="chip bg-[var(--violet)]">Next entry</span>
          <p className="mt-4 text-sm text-muted-foreground">
            A space is saved for the next version. No mystery feature list, just room to keep
            moving.
          </p>
        </div>
      </ContentSection>
    </ContentPage>
  );
}
