import { cn } from "../lib/cn";

interface RatingProps {
  value: number;
  size?: number;
  activeColor?: string;
  inactiveColor?: string;
  className?: string;
}

export default function Rating({
  value,
  size = 13,
  activeColor = "#FFD23F",
  inactiveColor = "#3A3A3E",
  className,
}: RatingProps) {
  const rounded = Math.round(value);
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width={size} height={size} viewBox="0 0 20 20" fill={n <= rounded ? activeColor : inactiveColor}>
          <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6z" />
        </svg>
      ))}
    </div>
  );
}
