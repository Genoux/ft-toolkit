"use client";

import { Info } from "lucide-react";
import { type ComponentProps, type ReactNode, useState } from "react";
import { cn } from "../lib/utils";
import { TooltipContent, TooltipRoot, TooltipTrigger } from "./tooltip";

type InfoHintProps = Omit<ComponentProps<"button">, "children" | "aria-label"> & {
  /** The button's name, read before the hint: "What band position means". */
  label: string;
  /** The explanation shown in the tooltip; screen readers get it as the button's description. */
  children: ReactNode;
  side?: ComponentProps<typeof TooltipContent>["side"];
};

/** A small info icon beside a figure or term whose tooltip explains it. Opens on hover, keyboard
 * focus and a tap. */
function InfoHint({ label, children, side = "top", className, onClick, ...props }: InfoHintProps) {
  // Radix closes a tooltip on its trigger's click, so a tap on a phone could never open it;
  // controlling it and toggling on click makes the tap the way in.
  const [open, setOpen] = useState(false);
  return (
    <TooltipRoot open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <button
          type="button"
          data-slot="info-hint"
          aria-label={label}
          onClick={(event) => {
            onClick?.(event);
            event.preventDefault();
            setOpen((current) => !current);
          }}
          className={cn(
            // The focus ring is drawn inside: the hit area's negative margin leaves an outer ring over
            // the words before the icon. The start side pulls in less, so the hover fill stays 4px
            // clear of a preceding label.
            "-my-1 -me-1 -ms-0.5 inline-grid size-6 shrink-0 place-items-center rounded-full align-middle text-subtle-foreground outline-none",
            "transition-colors duration-(--duration-fast) ease-out-expo hover:bg-muted hover:text-foreground",
            "focus-visible:text-foreground focus-visible:focus-ring-inset data-[state=delayed-open]:text-foreground data-[state=instant-open]:text-foreground",
            className,
          )}
          {...props}
        >
          <Info aria-hidden className="size-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side={side} className="max-w-64 text-left">
        {children}
      </TooltipContent>
    </TooltipRoot>
  );
}

export { InfoHint };
