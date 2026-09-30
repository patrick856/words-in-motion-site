import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/PlaceholderPage";

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
  component: () => (
    <PlaceholderPage
      kicker="Changelog"
      title="v0.1.0 — hello, world."
      blurb="The first public release: intros, outros, loops, cursor effects and scroll scrubs. Detailed release notes land here next."
    />
  ),
});
