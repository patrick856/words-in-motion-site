import { createFileRoute } from "@tanstack/react-router";
import { Callout, CodeBlock, ContentPage, ContentSection, EffectTable } from "@/components/ContentPage";

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
  component: Docs,
});

const sections = [
  { id: "intro", label: "Intro" },
  { id: "loop", label: "Loop" },
  { id: "outro", label: "Outro" },
  { id: "interact", label: "Interact" },
  { id: "scroll", label: "Scroll" },
  { id: "accessibility", label: "Accessibility" },
];

const intro = [
  { name: "directionalReveal", description: "Characters arrive through clipped frames in an irregular order.", options: "duration, by: 'chars' | 'words'" },
  { name: "lampFlicker", description: "A sign warming up, then holding steady.", options: "duration, flickers, by: 'all' | 'words' | 'chars'" },
  { name: "rise", description: "Text rises from below or drops from above.", options: "duration, from, distance, by, mask, fade" },
  { name: "chunkedScramble", description: "Reveals lines or word groups through a brief typo storm.", options: "duration, revealBy, chunkSize, corruptionRate" },
  { name: "stripRealign", description: "Horizontal text strips slide back into place.", options: "duration, strips, maxOffset, by" },
  { name: "pixelResolve", description: "Coarse blocks sharpen into the original text.", options: "duration, pixelSize, steps" },
];

const loop = [
  { name: "wave", description: "A continuous traveling vertical wave.", options: "duration, intensity, by, stagger" },
  { name: "float", description: "Slow elliptical drift with a quiet return.", options: "duration, intensity, by, stagger" },
  { name: "breathe", description: "A gentle expansion, exhale and rest.", options: "duration, intensity, by, stagger" },
  { name: "shimmer", description: "A light sweep that keeps the text color.", options: "duration, intensity, by, stagger" },
  { name: "pendulum", description: "Softly phased letter tilts.", options: "duration, intensity, by, stagger" },
];

const outro = [
  { name: "blackHole", description: "Letters spiral into the center.", options: "duration, by, keep" },
  { name: "paperCut", description: "Horizontal slices slide apart.", options: "duration, strips, maxOffset, keep" },
  { name: "breakAndFade", description: "A reading-order fracture and fade.", options: "duration, sweepDuration, keep" },
  { name: "hingeDrop", description: "Characters pivot and fall out of line.", options: "duration, distance, keep" },
  { name: "blurAway", description: "Words lift, defocus and dissolve.", options: "duration, blur, distance, keep" },
  { name: "windScatter", description: "A gust carries letters away.", options: "duration, direction, distance, keep" },
];

const interact = [
  { name: "pull", description: "A soft attraction toward the pointer.", options: "radius, strength, touch, pointerArea" },
  { name: "push", description: "A soft repulsion around the pointer.", options: "radius, strength, touch, pointerArea" },
  { name: "obstaclePush", description: "A solid cursor nudges letters on contact.", options: "cursorRadius, easing, touch, pointerArea" },
  { name: "proximityFade", description: "Nearby letters fade, then return.", options: "radius, minOpacity, touch" },
  { name: "proximityFlip", description: "Nearby letters tilt in perspective.", options: "axis, maxAngle, touch" },
  { name: "proximityRotate", description: "Letters turn near the pointer.", options: "maxAngle, direction, touch" },
  { name: "proximityShake", description: "A restrained vibration close to the pointer.", options: "maxAmplitude, radius, touch" },
  { name: "fontWeight", description: "Weight follows the nearest word.", options: "minWeight, maxWeight, focusRadius" },
  { name: "accentColor", description: "Color follows the pointer.", options: "accentColor, baseColor, radius" },
];

const scroll = [
  { name: "readingLine", description: "Words gain opacity as reading progresses.", options: "start, end, by, smooth, baseOpacity" },
  { name: "scatterReassemble", description: "Scattered letters settle in reading order.", options: "start, end, by, smooth, maxScatter" },
  { name: "waveRelay", description: "A traveling letter moves across wrapped lines.", options: "start, end, smooth, waveHeight, waveRadius, pushStrength" },
];

function Docs() {
  return (
    <ContentPage kicker="Reference / 02" title="Know every move." intro="Five families, one small API. Pick an effect, pass a selector or element, keep its handle, and let the words do their thing." sections={sections}>
      <ContentSection id="intro" eyebrow="01 / Arrive" title="Intro">
        <p>Intros move text from an initial hidden state into its readable resting state. Import from <code>words-in-motion/intro</code>. All accept a target and optional settings, then return <code>{"{ finished, cancel }"}</code>.</p>
        <EffectTable rows={intro} />
        <CodeBlock code={`import { rise } from "words-in-motion/intro";

const entrance = rise("#headline", {
  from: "ground",
  by: "words",
  duration: 800,
});

await entrance.finished;`} />
        <Callout color="var(--tomato)">Shared intro settings include <code>duration</code>, <code>delay</code>, <code>easing</code>, <code>stagger</code>, <code>trigger</code>, <code>start</code> and <code>once</code>. The default trigger is immediate.</Callout>
      </ContentSection>

      <ContentSection id="loop" eyebrow="02 / Stay awhile" title="Loop">
        <p>Loops repeat until you call <code>cancel()</code>. Their <code>finished</code> promise resolves on cancellation, reduced motion or an empty target.</p>
        <EffectTable rows={loop} />
        <CodeBlock code={`import { wave } from "words-in-motion/loop";

const loop = wave(".headline", {
  by: "chars",
  intensity: 1,
  duration: 2400,
});

// When this view unmounts:
loop.cancel();`} />
        <Callout color="var(--lemon)"><code>duration</code> controls one cycle. <code>intensity</code> is a multiplier from 0 to 4; <code>by</code> accepts <code>"chars"</code> or <code>"words"</code>.</Callout>
      </ContentSection>

      <ContentSection id="outro" eyebrow="03 / Exit gracefully" title="Outro">
        <p>Outros begin with visible text and hide it when they finish. Pass <code>keep: true</code> when you want the original text visible again afterward. Calling <code>cancel()</code> restores the original content and opacity.</p>
        <EffectTable rows={outro} />
        <CodeBlock code={`import { blurAway } from "words-in-motion/outro";

const exit = blurAway("#message", {
  blur: 10,
  duration: 1100,
  keep: true,
});

await exit.finished;`} />
        <Callout color="var(--violet)">All outros also accept shared animation settings such as <code>delay</code>, <code>duration</code>, <code>easing</code> and <code>stagger</code>.</Callout>
      </ContentSection>

      <ContentSection id="interact" eyebrow="04 / Follow the pointer" title="Interact">
        <p>Interactions stay active while mounted. Their handles provide <code>pause()</code>, <code>resume()</code> and <code>destroy()</code>. Multiple cursor effects can share one target.</p>
        <EffectTable rows={interact} />
        <CodeBlock code={`import { pull } from "words-in-motion/interact";

const interaction = pull(".title", {
  radius: 170,
  pointerArea: "target",
  touch: "follow",
});

// When this view unmounts:
interaction.destroy();`} />
        <Callout color="var(--mint)">Shared settings include <code>radius</code>, <code>strength</code>, <code>easing</code>, <code>touch</code>, <code>pointerArea</code> and <code>respectReducedMotion</code>. Weight changes look smoothest with a variable font.</Callout>
      </ContentSection>

      <ContentSection id="scroll" eyebrow="05 / Go with the page" title="Scroll">
        <p><strong>Trigger mode</strong> plays an animation when an element reaches a viewport position. <strong>Scrub mode</strong> ties progress directly to scroll position. Both use viewport anchors such as <code>"top 80%"</code>.</p>
        <p>Trigger handles expose <code>finished</code>, <code>cancel()</code> and <code>destroy()</code>. Scrub handles expose <code>pause()</code>, <code>resume()</code> and <code>destroy()</code>.</p>
        <CodeBlock code={`import { createScrollTrigger } from "words-in-motion/scroll";
import { rise } from "words-in-motion/intro";

const trigger = createScrollTrigger(
  ".headline",
  { start: "top 80%", repeat: true },
  (element) => rise(element, { duration: 800 }),
);

// When this view unmounts:
trigger.destroy();`} />
        <p>The ready-made scrub effects below use the same scroll position model. They follow the viewport; use the <a className="font-semibold underline decoration-2 underline-offset-4" href="/#scroll-effects">home page examples</a> to see them at full size.</p>
        <EffectTable rows={scroll} />
        <CodeBlock code={`import { readingLine } from "words-in-motion/scroll";

const scrub = readingLine(".copy", {
  start: "top 85%",
  end: "top 25%",
  by: "words",
  smooth: 0.25,
});

// When this view unmounts:
scrub.destroy();`} />
        <Callout color="var(--blue)">Trigger settings include <code>start</code>, <code>threshold</code>, <code>repeat</code> and <code>once</code>. Scrub settings include <code>start</code>, <code>end</code>, <code>threshold</code>, <code>by</code> and <code>smooth</code>.</Callout>
      </ContentSection>

      <ContentSection id="accessibility" eyebrow="06 / Everyone gets the words" title="Accessibility">
        <p>The split text keeps the original readable string in an <code>aria-label</code> on its container. Generated character and word spans use <code>aria-hidden="true"</code>, so assistive technology does not announce the animation one letter at a time.</p>
        <p>The package respects <code>prefers-reduced-motion</code>: entrances and exits resolve safely, loops stop, cursor displacement is disabled, and scroll effects settle to a readable state.</p>
        <p>Cursor effects support <code>touch: "follow"</code>, <code>"tap"</code> or <code>"none"</code>. Choose the interaction that makes sense for the surface, and keep ordinary text selectable at rest.</p>
        <Callout color="var(--lemon)">The browser still needs real text in the element. Let the package split it; do not pre-split the letters yourself.</Callout>
      </ContentSection>
    </ContentPage>
  );
}
