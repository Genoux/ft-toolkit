import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge reads unknown text-*/shadow-* names as colours, so without these groups
// cn("text-table text-muted-foreground") drops the size.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      ease: ["out-expo", "in-out-quart"],
      spacing: ["control-xs", "control-sm", "control-default", "control-lg"],
    },
    classGroups: {
      "font-size": [
        {
          text: [
            "3xs",
            "2xs",
            "table",
            "item",
            "heading",
            "lead",
            "stat-sm",
            "title",
            "title-sm",
            "stat",
            "display",
          ],
        },
      ],
      shadow: [{ shadow: ["hairline", "raised", "subtle", "elevated"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
