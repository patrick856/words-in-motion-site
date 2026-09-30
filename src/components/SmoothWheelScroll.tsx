import { useEffect } from "react";

const MAX_WHEEL_STEP = 110;
const MAX_SPEED = 1200; // Pixels per second while catching up to the wheel.
const EASING_MS = 140;

export function SmoothWheelScroll() {
  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let target = window.scrollY;
    let frame = 0;
    let lastTime = 0;

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      target = window.scrollY;
    };

    const nativeStageVisible = () => {
      const stage = document.querySelector("[data-native-scroll-stage]");
      if (!stage) return false;
      if (stage.querySelector('[data-held-stage="true"]')) return true;
      const rect = stage.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    };

    const tick = (time: number) => {
      if (nativeStageVisible()) {
        stop();
        return;
      }
      const elapsed = lastTime ? Math.min(time - lastTime, 50) : 16;
      lastTime = time;
      const remaining = target - window.scrollY;

      if (Math.abs(remaining) < 0.5) {
        window.scrollTo({ top: target, behavior: "instant" });
        stop();
        return;
      }

      const easedStep = remaining * (1 - Math.exp(-elapsed / EASING_MS));
      const maxStep = (MAX_SPEED * elapsed) / 1000;
      const step = Math.max(-maxStep, Math.min(maxStep, easedStep));
      window.scrollTo({ top: window.scrollY + step, behavior: "instant" });
      frame = requestAnimationFrame(tick);
    };

    const onWheel = (event: WheelEvent) => {
      if (motionPreference.matches || event.ctrlKey || event.shiftKey || !event.cancelable) return;

      if (nativeStageVisible()) {
        stop();
        return;
      }

      // Let menus and other independently scrollable areas keep their native behavior.
      for (const node of event.composedPath()) {
        if (!(node instanceof HTMLElement)) continue;
        if (node === document.body || node === document.documentElement) break;
        const overflow = getComputedStyle(node).overflowY;
        if (/auto|scroll/.test(overflow) && node.scrollHeight > node.clientHeight) return;
      }

      const lineHeight = 16;
      const delta =
        event.deltaY *
        (event.deltaMode === 1 ? lineHeight : event.deltaMode === 2 ? window.innerHeight : 1);
      if (!delta) return;

      event.preventDefault();
      const pageEnd = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const step = Math.max(-MAX_WHEEL_STEP, Math.min(MAX_WHEEL_STEP, delta));
      const maxLead = window.innerHeight * 0.8;
      target = Math.max(0, Math.min(pageEnd, target + step));
      target = Math.max(window.scrollY - maxLead, Math.min(window.scrollY + maxLead, target));
      if (!frame) frame = requestAnimationFrame(tick);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", stop);
    window.addEventListener("pointerdown", stop);
    window.addEventListener("popstate", stop);
    motionPreference.addEventListener("change", stop);
    return () => {
      stop();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", stop);
      window.removeEventListener("pointerdown", stop);
      window.removeEventListener("popstate", stop);
      motionPreference.removeEventListener("change", stop);
    };
  }, []);

  return null;
}
