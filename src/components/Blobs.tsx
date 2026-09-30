import { useReducedMotion } from "@/lib/motion";

type Blob = {
  color: string;
  size: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  delay: string;
  duration: string;
  opacity: number;
};

const DEFAULT_BLOBS: Blob[] = [
  {
    color: "var(--tomato)",
    size: "38vw",
    top: "-8%",
    left: "-6%",
    delay: "0s",
    duration: "24s",
    opacity: 0.35,
  },
  {
    color: "var(--blue)",
    size: "30vw",
    top: "20%",
    right: "-8%",
    delay: "-6s",
    duration: "28s",
    opacity: 0.28,
  },
  {
    color: "var(--lemon)",
    size: "26vw",
    bottom: "-6%",
    left: "18%",
    delay: "-12s",
    duration: "30s",
    opacity: 0.4,
  },
  {
    color: "var(--mint)",
    size: "22vw",
    bottom: "10%",
    right: "14%",
    delay: "-18s",
    duration: "26s",
    opacity: 0.32,
  },
];

export function Blobs({ blobs = DEFAULT_BLOBS }: { blobs?: Blob[] }) {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {blobs.map((b, i) => (
        <span
          key={i}
          className="blob"
          style={{
            background: b.color,
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            right: b.right,
            bottom: b.bottom,
            opacity: b.opacity,
            animationDelay: b.delay,
            animationDuration: b.duration,
          }}
        />
      ))}
    </div>
  );
}
