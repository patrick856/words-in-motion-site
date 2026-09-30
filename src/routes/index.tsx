import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/sections/Hero";
import { ScrollSection } from "@/components/sections/ScrollSection";
import { CursorPlayground } from "@/components/sections/CursorPlayground";
import { Showcase } from "@/components/sections/Showcase";

const title = "words-in-motion — typographic motion for the web";
const description =
  "An open-source npm package of intro, outro, loop, scroll-driven and cursor-reactive text animations. Zero dependencies, tree-shakeable, accessible.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      <Hero />
      <ScrollSection />
      <CursorPlayground />
      <Showcase />
    </main>
  );
}
