import { Link } from "@tanstack/react-router";
import { Blobs } from "@/components/Blobs";

export function PlaceholderPage({
  kicker,
  title,
  blurb,
}: {
  kicker: string;
  title: string;
  blurb: string;
}) {
  return (
    <section className="relative flex min-h-[80vh] items-center px-5 pt-32 pb-20 md:px-10">
      <Blobs />
      <div className="relative mx-auto w-full max-w-[900px]">
        <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {kicker}
        </p>
        <h1 className="mt-4 text-5xl md:text-7xl">{title}</h1>
        <p className="mt-6 max-w-[48ch] text-lg text-muted-foreground">{blurb}</p>
        <Link
          to="/"
          className="mt-10 inline-flex rounded-full border border-foreground px-5 py-3 text-sm font-semibold transition-colors hover:bg-foreground hover:text-background"
        >
          Back home
        </Link>
      </div>
    </section>
  );
}
