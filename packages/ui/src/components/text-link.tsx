import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../lib/utils";

const textLinkVariants = cva(
  // The radius is only for the focus ring: at rest it would clip the underline's ends into a
  // rounded stroke whenever the link truncates (overflow hidden).
  "underline decoration-current/60 underline-offset-4 outline-none transition-[color,text-decoration-color,box-shadow] duration-(--duration-fast) ease-out-expo hover:decoration-current focus-visible:rounded-sm focus-visible:decoration-current focus-visible:focus-ring",
  {
    variants: {
      tone: {
        muted: "text-muted-foreground hover:text-foreground focus-visible:text-foreground",
        default: "text-foreground",
      },
    },
    defaultVariants: { tone: "muted" },
  },
);

type TextLinkProps = ComponentProps<"a"> &
  VariantProps<typeof textLinkVariants> & {
    /** Renders the child element, such as a router Link, with the link's look. */
    asChild?: boolean;
  };

/** A quiet inline link in running text, a footer or a field value; for an action that looks like a control, use Button. */
function TextLink({ asChild = false, tone = "muted", className, ...props }: TextLinkProps) {
  const Comp = asChild ? Slot.Root : "a";
  return (
    <Comp
      data-slot="text-link"
      data-tone={tone}
      className={cn(textLinkVariants({ tone }), className)}
      {...props}
    />
  );
}

export { TextLink, textLinkVariants };
