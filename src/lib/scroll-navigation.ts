export const HERO_SCROLL_EVENT = "words-in-motion:hero-scroll";
export const SKIP_OUTRO_EVENT = "words-in-motion:skip-outro";

export function beginHeroScroll() {
  window.dispatchEvent(new Event(HERO_SCROLL_EVENT));
}
