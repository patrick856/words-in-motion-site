import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { useFontsReady } from "@/lib/motion";

type Handle = { finished: Promise<void>; cancel: () => void };
type Destroyable = { destroy: () => void };

/**
 * Plays a one-shot intro animation on the wrapped text once fonts are ready.
 */
export function IntroText({
  as: Tag = "div",
  effect,
  options,
  delayUntil,
  onDone,
  className,
  children,
}: {
  as?: ElementType;
  effect: (target: HTMLElement, options?: Record<string, unknown>) => Handle;
  options?: Record<string, unknown>;
  /** Optional gate: the intro waits until this is true. */
  delayUntil?: boolean;
  onDone?: () => void;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const fontsReady = useFontsReady();
  const gate = delayUntil ?? true;

  useEffect(() => {
    if (!fontsReady || !gate || !ref.current) return;
    let handle: Handle | null = effect(ref.current, options);
    handle.finished.then(() => onDone?.()).catch(() => {});
    return () => {
      handle?.cancel();
      handle = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontsReady, gate]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/**
 * Runs a looping animation for as long as the component is mounted.
 */
export function LoopText({
  as: Tag = "div",
  effect,
  options,
  className,
  children,
}: {
  as?: ElementType;
  effect: (target: HTMLElement, options?: Record<string, unknown>) => Handle;
  options?: Record<string, unknown>;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const fontsReady = useFontsReady();

  useEffect(() => {
    if (!fontsReady || !ref.current) return;
    const handle = effect(ref.current, options);
    return () => handle.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontsReady]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/**
 * Ties the wrapped text's progress to the scroll position.
 */
export function ScrubText({
  as: Tag = "p",
  effect,
  options,
  className,
  children,
}: {
  as?: ElementType;
  effect: (target: HTMLElement, options?: Record<string, unknown>) => Destroyable;
  options?: Record<string, unknown>;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const fontsReady = useFontsReady();

  useEffect(() => {
    if (!fontsReady || !ref.current) return;
    const handle = effect(ref.current, options);
    return () => handle.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontsReady]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/**
 * Attaches one or more cursor-reactive effects to the wrapped text.
 */
export function InteractText({
  as: Tag = "p",
  effects,
  className,
  children,
  ...rest
}: {
  as?: ElementType;
  effects: Array<(target: HTMLElement) => Destroyable>;
  className?: string;
  children: ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  const fontsReady = useFontsReady();

  useEffect(() => {
    if (!fontsReady || !ref.current) return;
    const el = ref.current;
    const handles = effects.map((create) => create(el));
    return () => handles.forEach((h) => h.destroy());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontsReady]);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
