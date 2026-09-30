import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/PlaceholderPage";

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
  component: () => (
    <PlaceholderPage
      kicker="Animations"
      title="Every effect, side by side."
      blurb="A searchable gallery with live previews and copyable snippets is coming. The home page already shows all of them in the wild."
    />
  ),
});
