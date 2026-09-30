import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-[1400px] items-center px-5 py-5 md:px-10">
        <Link
          to="/"
          className="rounded-full border border-foreground bg-background/85 px-4 py-2 font-display text-sm font-extrabold tracking-tight backdrop-blur-md transition-transform duration-300 hover:-translate-y-0.5 md:text-base"
        >
          words-in-motion
        </Link>
      </div>
    </header>
  );
}
