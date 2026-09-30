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
    size: "max(38vw, 22rem)",
    top: "-8%",
    left: "-6%",
    delay: "0s",
    duration: "24s",
    opacity: 0.35,
  },
  {
    color: "var(--blue)",
    size: "max(30vw, 20rem)",
    top: "20%",
    right: "-8%",
    delay: "-6s",
    duration: "28s",
    opacity: 0.28,
  },
  {
    color: "var(--lemon)",
    size: "max(26vw, 18rem)",
    bottom: "-6%",
    left: "18%",
    delay: "-12s",
    duration: "30s",
    opacity: 0.4,
  },
  {
    color: "var(--mint)",
    size: "max(22vw, 16rem)",
    bottom: "10%",
    right: "14%",
    delay: "-18s",
    duration: "26s",
    opacity: 0.32,
  },
];

export function Blobs({ blobs = DEFAULT_BLOBS }: { blobs?: Blob[] }) {
  const reduced = useReducedMotion();

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
            animationPlayState: reduced ? "paused" : "running",
            willChange: reduced ? "auto" : "transform",
          }}
        />
      ))}
    </div>
  );
}
