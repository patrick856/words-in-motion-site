import { useEffect, useState } from "react";

/** True once web fonts are ready (never before hydration). */
export function useFontsReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    const done = () => {
      if (alive) setReady(true);
    };
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(done).catch(done);
    } else {
      done();
    }
    return () => {
      alive = false;
    };
  }, []);

  return ready;
}

/** True when the user asked for reduced motion. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

export const ACCENTS = [
  "var(--tomato)",
  "var(--blue)",
  "var(--lemon)",
  "var(--mint)",
  "var(--violet)",
] as const;
