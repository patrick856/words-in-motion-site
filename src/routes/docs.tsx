import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/PlaceholderPage";

const title = "Docs — words-in-motion";
const description =
  "API reference for words-in-motion: intro, outro, loop, interact and scroll animation options.";

export const Route = createFileRoute("/docs")({
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
      kicker="Docs"
      title="The manual is on its way."
      blurb="Full API reference for every effect, option and handle. Until then, the README in the package has the signatures."
    />
  ),
});
