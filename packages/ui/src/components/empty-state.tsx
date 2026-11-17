import type { LucideIcon } from "lucide-react";
import type { ComponentProps, ReactElement, ReactNode } from "react";
import { cn } from "../lib/utils";
import { Button } from "./button";

type EmptyStateActionLook = {
  label: string;
  variant?: ComponentProps<typeof Button>["variant"];
  icon?: LucideIcon;
};

// The element is rendered through Slot and asChild, so it must forward props and ref.
type RenderEmptyStateLink = (href: string, content: ReactNode) => ReactElement;

export type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: EmptyStateActionLook &
    ({ onClick: () => void; disabled?: boolean; href?: never } | { href: string; onClick?: never });
  renderLink?: RenderEmptyStateLink;
  className?: string;
};

const renderAnchor: RenderEmptyStateLink = (href, content) => <a href={href}>{content}</a>;

export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
  renderLink = renderAnchor,
  className,
}: EmptyStateProps) {
  const ActionIcon = action?.icon;
  const actionContent = action ? (
    <>
      {ActionIcon ? <ActionIcon className="size-3.5" /> : null}
      {action.label}
    </>
  ) : null;

  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex h-full min-h-0 w-full min-w-0 flex-1 flex-col items-center justify-center gap-2.5 rounded-xl border border-border px-6 py-12 text-center text-balance",
        className,
      )}
    >
      <div className="flex max-w-sm flex-col items-center gap-2">
        {Icon ? (
          <div className="mb-2 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Icon className="size-4 text-muted-foreground" />
          </div>
        ) : null}
        <div className="text-sm font-medium tracking-tight">{title}</div>
        {description ? (
          <p className="text-sm/relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action?.href !== undefined ? (
        <Button asChild size="sm" variant={action.variant ?? "secondary"}>
          {renderLink(action.href, actionContent)}
        </Button>
      ) : action ? (
        <Button
          size="sm"
          variant={action.variant ?? "secondary"}
          disabled={action.disabled}
          onClick={action.onClick}
        >
          {actionContent}
        </Button>
      ) : null}
    </div>
  );
}
