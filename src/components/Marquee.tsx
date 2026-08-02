import { cn } from "../lib/cn";

interface MarqueeProps {
  items: string[];
  className?: string;
  speed?: "slow" | "fast";
}

export default function Marquee({ items, className, speed = "slow" }: MarqueeProps) {
  const doubled = [...items, ...items];
  return (
    <div className={cn("overflow-hidden whitespace-nowrap", className)}>
      <div className={cn("inline-flex items-center gap-10 pause-on-hover", speed === "slow" ? "animate-marquee" : "animate-marquee-fast")}>
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-10">
            <span>{item}</span>
            <span className="text-indigo-glow">&#9670;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
