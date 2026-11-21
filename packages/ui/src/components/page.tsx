import { Slot } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/utils";

const PAGE_WIDTH = {
  default: "max-w-6xl",
  narrow: "max-w-3xl",
  full: "",
} as const;

type PageProps = ComponentProps<"div"> & {
  /** `default` for lists, details and overviews; `narrow` for forms and settings; `full` for wide tables and workspaces. */
  size?: keyof typeof PAGE_WIDTH;
  /** Renders the child element, usually `main`, instead of a div. */
  asChild?: boolean;
};

function Page({ size = "default", asChild = false, className, ...props }: PageProps) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="page"
      data-size={size}
      className={cn(
        "mx-auto flex w-full min-w-0 flex-col gap-8 px-4 pt-6 pb-16 md:px-8 md:pt-8",
        PAGE_WIDTH[size],
        className,
      )}
      {...props}
    />
  );
}

type PageHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <header
      data-slot="page-header"
      className={cn("flex flex-wrap items-end justify-between gap-x-8 gap-y-(--gap-lg)", className)}
    >
      <div className="flex min-w-0 flex-col gap-(--gap-xs)">
        <h1 className="text-xl font-semibold text-balance">{title}</h1>
        {description ? (
          <p className="max-w-prose text-sm text-pretty text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-(--gap-sm)">{actions}</div> : null}
    </header>
  );
}

type PageSectionProps = Omit<ComponentProps<"section">, "title"> & {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
};

function PageSection({ title, description, actions, className, children, ...props }: PageSectionProps) {
  const hasHeader = title || description || actions;
  return (
    <section data-slot="page-section" className={cn("flex min-w-0 flex-col gap-(--gap-lg)", className)} {...props}>
      {hasHeader ? (
        <div className="flex items-end justify-between gap-(--gap-xl)">
          <div className="flex min-w-0 flex-col gap-(--gap-xs)">
            {title ? <h2 className="text-base font-semibold">{title}</h2> : null}
            {description ? (
              <p className="text-sm text-pretty text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-(--gap-sm)">{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export { Page, PageHeader, PageSection };
