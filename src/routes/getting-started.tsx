import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/PlaceholderPage";

const title = "Getting started — words-in-motion";
const description =
  "Install words-in-motion and run your first typographic animation in under a minute.";

export const Route = createFileRoute("/getting-started")({
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
      kicker="Getting started"
      title="One install, one import, done."
      blurb="A short guide for React, Vue and plain HTML is being written. Spoiler: npm install words-in-motion, then call an effect on an element."
    />
  ),
});
