import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { directionalReveal, rise } from "words-in-motion/intro";
import { IntroText } from "@/components/AnimatedText";
import { CodeChip } from "@/components/CodeChip";
import { Blobs } from "@/components/Blobs";
import { GITHUB_URL } from "@/lib/links";

export function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [visible, setVisible] = useState(false);
  const [headlineDone, setHeadlineDone] = useState(false);

  useEffect(() => {
    const headline = headlineRef.current;
    if (!headline) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    observer.observe(headline);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="hero" className="relative flex min-h-screen items-center px-5 pt-28 pb-20 md:px-10">
      <Blobs />
      <div className="relative mx-auto w-full max-w-[1400px]">
        <h1 ref={headlineRef} className="display-xl max-w-[16ch]">
          <IntroText
            as="span"
            effect={directionalReveal as never}
            options={{ duration: 1400 }}
            delayUntil={visible}
            onDone={() => setHeadlineDone(true)}
            className="block"
          >
            Words that refuse to sit still.
          </IntroText>
        </h1>

        <IntroText
          as="p"
          effect={rise as never}
          options={{ duration: 900 }}
          delayUntil={visible && headlineDone}
          className="mt-8 max-w-[52ch] text-lg text-muted-foreground md:text-2xl"
        >
          Intros, outros, loops, scroll scrubs and cursor tricks. One tiny package, zero
          dependencies.
        </IntroText>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <CodeChip code="npm install words-in-motion" size="lg" className="idle-bob" />
          <Link
            to="/docs"
            className="rounded-full border border-foreground px-5 py-3 text-sm font-semibold transition-colors duration-300 hover:bg-foreground hover:text-background md:text-base"
          >
            Read the docs
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium underline decoration-2 underline-offset-4 transition-colors hover:text-[var(--blue)]"
          >
            GitHub <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
