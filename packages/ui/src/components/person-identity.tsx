import type { ComponentProps, ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { getInitials } from "../lib/initials";
import { cn } from "../lib/utils";

type AvatarSize = NonNullable<ComponentProps<typeof Avatar>["size"]>;

export type PersonIdentityProfile = {
  name: string;
  imageUrl?: string | null;
};

export interface PersonAvatarProps
  extends Omit<ComponentProps<typeof Avatar>, "children" | "size"> {
  imageUrl?: string | null;
  name: string;
  /** Avatar's sizes; `xs` (20px) for a chip or menu row, `md` (32px) for a list. */
  size?: AvatarSize;
  fallbackClassName?: string;
  /** Hides the avatar from screen readers when the name is already written beside it. */
  decorative?: boolean;
}

export function PersonAvatar({
  imageUrl,
  name,
  size = "xs",
  fallbackClassName,
  decorative = false,
  ...props
}: PersonAvatarProps) {
  return (
    <Avatar size={size} {...props}>
      {imageUrl ? <AvatarImage src={imageUrl} alt={decorative ? "" : name} /> : null}
      <AvatarFallback aria-hidden={decorative || undefined} className={fallbackClassName}>
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}

export interface PersonNameProps {
  name: string;
  className?: string;
}

export function PersonName({ name, className }: PersonNameProps) {
  return (
    <p className={cn("w-full truncate text-sm text-muted-foreground", className)}>
      {name}
    </p>
  );
}

const IDENTITY_SIZE = {
  sm: {
    root: "gap-1.5",
    avatar: "xs",
    name: "text-table",
    description: "text-xs text-subtle-foreground",
  },
  md: {
    root: "gap-(--gap-md)",
    avatar: "md",
    name: "text-table font-medium text-foreground",
    description: "text-xs text-subtle-foreground",
  },
  lg: {
    root: "gap-(--gap-md)",
    avatar: "lg",
    name: "text-base font-medium text-foreground",
    description: "text-sm text-muted-foreground",
  },
} as const;

export interface PersonIdentityProps extends PersonIdentityProfile {
  /** A second line under the name, such as an email. */
  description?: ReactNode;
  /** `sm` a 20px avatar beside a muted name, for table cells (32px with a description); `md` a 32px avatar with the name in foreground, for lists; `lg` a 40px avatar, for a page or panel header. */
  size?: keyof typeof IDENTITY_SIZE;
  /** Right after the name in a list or table row: a role Badge or a StatusDot. Not in a header: a
   * record's tags and status go in `PageHeader meta`, beside the title. */
  badge?: ReactNode;
  className?: string;
}

export function PersonIdentity({
  name,
  imageUrl,
  description,
  size = "sm",
  badge,
  className,
}: PersonIdentityProps) {
  const sizeClasses = IDENTITY_SIZE[size];
  // A 20px avatar beside two lines of text reads as misaligned; a described sm row takes the md avatar.
  const avatarSize = description && size === "sm" ? IDENTITY_SIZE.md.avatar : sizeClasses.avatar;
  const nameLine = badge ? (
    <div className="flex min-w-0 items-center gap-(--gap-sm)">
      <PersonName name={name} className={cn("w-auto", sizeClasses.name)} />
      <span className="flex shrink-0 items-center">{badge}</span>
    </div>
  ) : (
    <PersonName name={name} className={sizeClasses.name} />
  );
  return (
    <div
      data-slot="person-identity"
      data-size={size}
      className={cn("flex min-w-0 items-center", sizeClasses.root, className)}
    >
      <PersonAvatar imageUrl={imageUrl} name={name} size={avatarSize} decorative />
      {description ? (
        <div className="flex min-w-0 flex-col">
          {nameLine}
          <span className={cn("truncate", sizeClasses.description)}>{description}</span>
        </div>
      ) : (
        nameLine
      )}
    </div>
  );
}
