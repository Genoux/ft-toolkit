import type { LucideIcon } from "lucide-react";
import type { ComponentProps, ReactElement, ReactNode } from "react";
import { cn } from "../lib/utils";
import { Button } from "./button";

type EmptyStateActionLook = {
  label: string;
  variant?: ComponentProps<typeof Button>["variant"];
  icon?: LucideIcon;
};

type EmptyStateAction = EmptyStateActionLook &
  ({ onClick: () => void; disabled?: boolean; href?: never } | { href: string; onClick?: never });

// The element is rendered through Slot and asChild, so it must forward props and ref.
type RenderEmptyStateLink = (href: string, content: ReactNode) => ReactElement;

type EmptyStateBaseProps = {
  title: string;
  description?: ReactNode;
  icon?: LucideIcon;
  /** The one way forward: "New request" when nothing exists yet, "Clear filters" for no results, "Try again" after a failed load. */
  action?: EmptyStateAction;
  /** A second, quieter way out beside the action, such as "Contact us" on an error page. `ghost` unless a variant is given. */
  secondaryAction?: EmptyStateAction;
  renderLink?: RenderEmptyStateLink;
  /** `destructive` for a failed load: the icon turns red and the message is announced. Pair it with a "Try again" action. */
  tone?: "neutral" | "destructive";
  /** A quiet line under the actions: the signed-in account, or the reference support can look up. */
  meta?: ReactNode;
  className?: string;
};

export type EmptyStateProps = EmptyStateBaseProps &
  (
    | {
        size?: "default";
        /** Frameless by default: on a list page, in a table, a card or a panel it sits on the surface around it. `dashed` only marks an "add something" slot inside a section among other content (Proof's "No languages yet"). */
        frame?: "dashed";
      }
    | {
        /** `page` for a message that is the whole page (404, error, maintenance, access denied), in a `centered` Page: the title becomes the page's h1, the description reads at body size, the actions are large. Never framed: it sits on the page. */
        size: "page";
        frame?: never;
      }
  );

const renderAnchor: RenderEmptyStateLink = (href, content) => <a href={href}>{content}</a>;

// Never a solid card: a page-level empty state in a white box reads as a broken panel (shadcn Empty,
// Geist blank slate, Linear and Primer Blankslate all sit on the page). A page-size message pads
// nothing: the centred Page around it owns the room, and a mark above it stays at the Page's own gap.
const DASHED_FRAME_CLASS = "rounded-xl border border-dashed border-input px-6";

const SIZE_CLASS = {
  default: {
    icon: "mb-2 size-10 [&>svg]:size-5",
    root: "gap-4",
    header: "max-w-sm gap-2",
    title: "text-base font-medium",
    description: "text-sm/5.5",
    meta: "text-xs text-subtle-foreground",
    button: "default",
  },
  page: {
    icon: "mb-3 size-12 [&>svg]:size-6",
    root: "gap-5",
    header: "max-w-xl gap-3",
    title: "text-2xl font-semibold",
    description: "text-base/relaxed",
    meta: "text-sm text-muted-foreground",
    button: "lg",
  },
} as const;

function EmptyStateButton({
  action,
  fallbackVariant,
  size,
  renderLink,
}: {
  action: EmptyStateAction;
  fallbackVariant: EmptyStateActionLook["variant"];
  size: "default" | "lg";
  renderLink: RenderEmptyStateLink;
}) {
  const ActionIcon = action.icon;
  const content = (
    <>
      {ActionIcon ? <ActionIcon /> : null}
      {action.label}
    </>
  );
  const variant = action.variant ?? fallbackVariant;
  return action.href !== undefined ? (
    <Button asChild size={size} variant={variant}>
      {renderLink(action.href, content)}
    </Button>
  ) : (
    <Button size={size} variant={variant} disabled={action.disabled} onClick={action.onClick}>
      {content}
    </Button>
  );
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
  secondaryAction,
  renderLink = renderAnchor,
  tone = "neutral",
  size = "default",
  meta,
  frame,
  className,
}: EmptyStateProps) {
  const sizeClass = SIZE_CLASS[size];
  const Title = size === "page" ? "h1" : "div";

  // `grow`, not `h-full`: it takes the room a flex column leaves it (Page, PageSection, Card,
  // DataTableShell) and keeps its siblings in place; with no room it is as tall as its content.
  return (
    <div
      data-slot="empty-state"
      data-tone={tone}
      data-size={size}
      data-frame={frame}
      role={tone === "destructive" ? "alert" : undefined}
      className={cn(
        "flex w-full min-w-0 grow flex-col items-center justify-center text-center",
        sizeClass.root,
        size === "default" && "py-12",
        frame === "dashed" && DASHED_FRAME_CLASS,
        className,
      )}
    >
      <div className={cn("flex flex-col items-center", sizeClass.header)}>
        {Icon ? (
          <div
            data-slot="empty-state-icon"
            className={cn(
              "flex shrink-0 items-center justify-center rounded-full",
              tone === "destructive"
                ? "bg-destructive/10 text-destructive"
                : "bg-muted text-muted-foreground",
              sizeClass.icon,
            )}
          >
            <Icon aria-hidden />
          </div>
        ) : null}
        <Title className={cn("text-balance", sizeClass.title)}>{title}</Title>
        {description ? (
          <p className={cn("text-pretty text-muted-foreground", sizeClass.description)}>
            {description}
          </p>
        ) : null}
      </div>
      {action || secondaryAction ? (
        <div
          data-slot="empty-state-actions"
          className="flex flex-wrap items-center justify-center gap-(--gap-sm)"
        >
          {action ? (
            <EmptyStateButton
              action={action}
              fallbackVariant="secondary"
              size={sizeClass.button}
              renderLink={renderLink}
            />
          ) : null}
          {secondaryAction ? (
            <EmptyStateButton
              action={secondaryAction}
              fallbackVariant="ghost"
              size={sizeClass.button}
              renderLink={renderLink}
            />
          ) : null}
        </div>
      ) : null}
      {meta ? <p className={cn("text-pretty", sizeClass.meta)}>{meta}</p> : null}
    </div>
  );
}
