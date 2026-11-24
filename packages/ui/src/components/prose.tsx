import { Slot } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../lib/utils";

const proseClassName = [
  "max-w-prose min-w-0 text-sm/relaxed text-foreground",
  "[&>*+*]:mt-3",
  "[&_h1]:text-title [&_h1]:font-semibold [&>h1+*]:mt-4",
  "[&_h2]:text-base [&_h2]:font-medium [&>*+h2]:mt-8",
  "[&_h3]:text-sm [&_h3]:font-medium [&>*+h3]:mt-6",
  "[&_h4]:text-xs [&_h4]:font-medium [&_h4]:text-muted-foreground [&>*+h4]:mt-6",
  "[&_a]:font-medium [&_a]:underline [&_a]:decoration-border [&_a]:underline-offset-4 [&_a]:transition-colors [&_a]:duration-(--duration-fast) [&_a]:ease-out-expo [&_a:hover]:decoration-foreground",
  "[&_strong]:font-medium",
  "[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:pl-1 [&_li+li]:mt-1 [&_li>ul]:mt-1 [&_li>ol]:mt-1 [&_li::marker]:text-subtle-foreground",
  "[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground",
  "[&_:not(pre)>code]:rounded-md [&_:not(pre)>code]:bg-muted [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-xs",
  "[&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:px-4 [&_pre]:py-3 [&_pre]:font-mono [&_pre]:text-xs/relaxed",
  "[&_hr]:border-border [&>hr]:my-8",
  "[&_img]:rounded-lg",
  "[&_table]:w-full [&_table]:border-collapse [&_table]:text-table [&_table]:tabular-nums",
  "[&_th]:border-b [&_th]:border-border [&_th]:py-2 [&_th]:pr-4 [&_th]:text-left [&_th]:text-xs [&_th]:font-medium [&_th]:text-muted-foreground",
  "[&_td]:border-b [&_td]:border-border [&_td]:py-2 [&_td]:pr-4 [&_td]:align-top",
].join(" ");

type ProseProps = ComponentProps<"div"> & {
  /** Renders the child element instead of a div, for an `article`. */
  asChild?: boolean;
};

/** Typography for rendered markdown or HTML you don't control element by element: headings, lists, links, quotes, code and tables on the type roles. */
function Prose({ asChild = false, className, ...props }: ProseProps) {
  const Comp = asChild ? Slot.Root : "div";
  return <Comp data-slot="prose" className={cn(proseClassName, className)} {...props} />;
}

export { Prose };
