import { Link, useRouterState } from "@tanstack/react-router";
import { beginHeroScroll } from "@/lib/scroll-navigation";

const NAV_ITEMS = [
  { label: "Getting Started", to: "/getting-started" as const },
  { label: "Docs", to: "/docs" as const },
  { label: "Animations", to: "/animations" as const },
  { label: "Changelog", to: "/changelog" as const },
];

export function Header() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-[1400px] flex-col items-start gap-2 px-5 py-5 sm:flex-row sm:items-center sm:justify-between md:px-10">
        <Link
          to="/"
          onClick={(event) => {
            if (pathname !== "/") return;

            const hero = document.getElementById("hero");
            if (!hero) return;

            event.preventDefault();
            beginHeroScroll();
            const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            hero.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
          }}
          className="rounded-full border border-foreground bg-background/85 px-4 py-2 font-display text-sm font-extrabold tracking-tight backdrop-blur-md transition-transform duration-300 hover:-translate-y-0.5 md:text-base"
        >
          words-in-motion
        </Link>

        <nav
          aria-label="Primary navigation"
          className="-mt-1 flex max-w-full flex-wrap items-center gap-2 pt-1 pb-1 sm:-my-1 sm:py-1"
        >
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={`shrink-0 rounded-full border border-foreground px-2.5 py-2 font-mono text-[0.62rem] font-medium tracking-tight backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 sm:px-4 sm:text-xs ${
                  active
                    ? "bg-foreground text-background"
                    : "bg-background/85 hover:bg-[var(--lemon)] hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
