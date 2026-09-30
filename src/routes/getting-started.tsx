import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Callout, CodeBlock, ContentPage, ContentSection } from "@/components/ContentPage";

const title = "How to use — words-in-motion";
const description = "Install words-in-motion, run your first effect, and clean it up the right way.";

const sections = [
  { id: "install", label: "Install" },
  { id: "quick-start", label: "Quick start" },
  { id: "react", label: "React" },
  { id: "handles", label: "Handles" },
  { id: "good-to-know", label: "Good to know" },
];

export const Route = createFileRoute("/getting-started")({
  head: () => ({ meta: [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
  ] }),
  component: GettingStarted,
});

function GettingStarted() {
  return (
    <ContentPage kicker="Getting started / 01" title="Make a little noise." intro="One install. One element. Suddenly your headline has an entrance. Here's the short path from static type to motion." sections={sections}>
      <ContentSection id="install" eyebrow="01 / The tiny first step" title="Install the package.">
        <p>Drop it into your project. There are no runtime animation dependencies tagging along.</p>
        <CodeBlock language="terminal" code="npm install words-in-motion" />
        <Callout color="var(--lemon)">Works with a CSS selector or an <code>HTMLElement</code>. Importing the package is safe during server rendering; call effects after the element exists in the browser.</Callout>
      </ContentSection>

      <ContentSection id="quick-start" eyebrow="02 / Your first entrance" title="Pixels first. Words second.">
        <p><code>pixelResolve</code> turns coarse blocks into crisp type. Give it a headline, then let the returned handle tell you when the show is over.</p>
        <CodeBlock code={`import { pixelResolve } from "words-in-motion/intro";

const handle = pixelResolve("#headline", {
  pixelSize: 16,
  steps: 8,
  duration: 1600,
});

await handle.finished;
// Call handle.cancel() if the element leaves before it finishes.`} />
        <p>The target can be <code>"#headline"</code> or the element itself. For <code>pixelResolve</code>, wait until web fonts are ready so the canvas version lines up with the final text.</p>
      </ContentSection>

      <ContentSection id="react" eyebrow="03 / In a component" title="Mount. Move. Clean up.">
        <p>Wait for fonts, guard against unmounting while they load, and cancel the animation in the effect cleanup. React StrictMode can mount effects twice in development, so cleanup matters.</p>
        <CodeBlock language="tsx" code={`import { useEffect, useRef } from "react";
import { pixelResolve } from "words-in-motion/intro";

export function AnimatedHeadline() {
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let mounted = true;
    let handle: ReturnType<typeof pixelResolve> | undefined;

    document.fonts.ready.then(() => {
      if (!mounted || !textRef.current) return;
      handle = pixelResolve(textRef.current, { duration: 1600 });
    });

    return () => {
      mounted = false;
      handle?.cancel();
    };
  }, []);

  return <h1 ref={textRef}>Hello, motion.</h1>;
}`} />
        <p>Cursor effects are long-running interactions. Their cleanup uses <code>destroy()</code>:</p>
        <CodeBlock language="tsx" code={`import { useEffect, useRef } from "react";
import { pull } from "words-in-motion/interact";

export function MagneticTitle() {
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let mounted = true;
    let interaction: ReturnType<typeof pull> | undefined;

    document.fonts.ready.then(() => {
      if (!mounted || !textRef.current) return;
      interaction = pull(textRef.current, { pointerArea: "target" });
    });

    return () => {
      mounted = false;
      interaction?.destroy();
    };
  }, []);

  return <h2 ref={textRef}>Come a little closer.</h2>;
}`} />
      </ContentSection>

      <ContentSection id="handles" eyebrow="04 / The off switch" title="Every effect leaves a handle.">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { name: "finished", color: "var(--mint)", text: "A promise for intros, loops, outros and scroll triggers. It resolves when the work finishes or is canceled." },
            { name: "cancel()", color: "var(--tomato)", text: "Stops an intro, loop or outro. A scroll trigger also has cancel() for its active animation." },
            { name: "destroy()", color: "var(--violet)", text: "Tears down an interact or scroll effect and restores the text and listeners." },
          ].map((item) => (
            <div key={item.name} className="rounded-2xl border border-foreground/20 p-5" style={{ boxShadow: `5px 5px 0 ${item.color}` }}>
              <code className="font-mono text-sm font-semibold text-foreground">{item.name}</code>
              <p className="mt-2 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
        <Callout color="var(--blue)">Interact and scroll scrub handles also have <code>pause()</code> and <code>resume()</code>. A scroll trigger has both <code>cancel()</code> and <code>destroy()</code>; use <code>destroy()</code> on unmount.</Callout>
      </ContentSection>

      <ContentSection id="good-to-know" eyebrow="05 / A few useful edges" title="Keep the text happy.">
        <ul className="list-disc space-y-3 pl-5 marker:text-[var(--tomato)]">
          <li><strong>Server rendering:</strong> imports are safe in Next.js, Nuxt, Remix and SvelteKit. Start effects in client-side lifecycle code.</li>
          <li><strong>Tree-shaking:</strong> import from category paths such as <code>words-in-motion/intro</code> or <code>words-in-motion/interact</code>.</li>
          <li><strong>Outros:</strong> they hide the target when finished by default. Pass <code>keep: true</code> to restore visibility after the exit.</li>
          <li><strong>Text updates:</strong> cancel or destroy the current effect before changing its text, then start it again.</li>
          <li><strong>Reduced motion:</strong> the package checks the user's preference and resolves effects safely when motion is reduced.</li>
        </ul>
        <Link to="/docs" className="inline-flex items-center gap-2 rounded-full border border-foreground bg-[var(--lemon)] px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5">
          Open the reference <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </ContentSection>
    </ContentPage>
  );
}
