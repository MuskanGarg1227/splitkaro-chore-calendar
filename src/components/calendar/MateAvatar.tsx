import { cn } from "@/lib/utils";
import type { Flatmate } from "@/lib/calendar-data";

const TONES: Record<Flatmate["tone"], string> = {
  1: "bg-mate-1-soft text-mate-1",
  2: "bg-mate-2-soft text-mate-2",
  3: "bg-mate-3-soft text-mate-3",
  4: "bg-mate-4-soft text-mate-4",
};

export function MateAvatar({
  mate,
  size = "sm",
  className,
}: {
  mate: Flatmate;
  size?: "xs" | "sm" | "md";
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-bold",
        size === "xs" && "size-5 text-[9px]",
        size === "sm" && "size-6 text-[10px]",
        size === "md" && "size-10 text-xs",
        TONES[mate.tone],
        className,
      )}
    >
      {mate.initials}
    </span>
  );
}
