import type { ReactNode } from "react";
import { cn } from "../lib/utils";
import { AvatarGroup, AvatarGroupCount } from "./avatar";
import { PersonAvatar } from "./person-identity";
import { Tooltip } from "./tooltip";

export type MemberAvatarProfile = {
  id: string;
  name: string | null;
  imageUrl: string | null;
  /** Stands in for a missing name, in the avatar initials and the tooltip. */
  email?: string | null;
};

type NamedMember = Pick<MemberAvatarProfile, "name" | "email">;

const SHOWN_AVATARS = 3;
const SHOWN_NAMES = 2;
// Past this many the tooltip gets too tall to read; the rest collapse into "+N more".
const MAX_NAMES = 10;

const displayName = ({ name, email }: NamedMember) => name ?? email ?? null;

/** Everyone's name, one per line: the stack's "+N" hides people, the tooltip says who they are. */
export function memberNames(members: NamedMember[]): string {
  const names = members
    .map(displayName)
    .filter((name) => name !== null)
    .slice(0, MAX_NAMES);
  if (names.length === 0) return "";

  const hiddenCount = members.length - names.length;
  return [...names, ...(hiddenCount > 0 ? [`+${hiddenCount} more`] : [])].join("\n");
}

const shortName = (member: NamedMember) => {
  if (member.name) return member.name.split(" ")[0] ?? member.name;
  return member.email?.split("@")[0] ?? null;
};

/** First names of the first two members and a count of the rest: "Maya, Theo +2". */
export function memberSummary(members: NamedMember[]): string {
  const names = members
    .map(shortName)
    .filter((name) => name !== null)
    .slice(0, SHOWN_NAMES);
  if (names.length === 0) return "";

  const hiddenCount = members.length - names.length;
  return `${names.join(", ")}${hiddenCount > 0 ? ` +${hiddenCount}` : ""}`;
}

type MemberAvatarStackProps = {
  members?: MemberAvatarProfile[] | null;
  /** Writes "Maya, Theo +2" beside the avatars, where faces alone would not say who is on it. */
  showNames?: boolean;
  /** Says what no members means here: "No team", "Unassigned". */
  emptyLabel?: ReactNode;
  className?: string;
};

export function MemberAvatarStack({
  members,
  showNames = false,
  emptyLabel = "Empty",
  className,
}: MemberAvatarStackProps) {
  const visibleMembers = members ?? [];

  if (visibleMembers.length === 0)
    return (
      <div className={cn("flex w-full items-center justify-start", className)}>
        <p className="rounded-md bg-foreground/8 px-1.5 py-0.5 text-xs leading-4 text-muted-foreground">
          {emptyLabel}
        </p>
      </div>
    );

  // With names the text carries the remainder ("+3"), so a "+N" chip would count twice.
  const shown = visibleMembers.slice(0, showNames ? SHOWN_NAMES : SHOWN_AVATARS);
  const extra = showNames ? 0 : visibleMembers.length - shown.length;
  const names = memberNames(visibleMembers);

  const summary = showNames ? memberSummary(visibleMembers) : "";

  const avatars = (
    <AvatarGroup className="shrink-0 -space-x-0.5">
      {shown.map((m) => (
        <PersonAvatar key={m.id} imageUrl={m.imageUrl} name={displayName(m) ?? ""} decorative />
      ))}
      {extra > 0 ? (
        <AvatarGroupCount className="size-5 text-2xs">+{extra}</AvatarGroupCount>
      ) : null}
    </AvatarGroup>
  );

  // Block-level, not inline: an inline wrapper sits on the text baseline and floats above the
  // middle of the row. Focusable so keyboard users can open the names tooltip too.
  const stack = (
    <span
      data-slot="member-avatar-stack"
      role={names ? "img" : undefined}
      aria-label={names ? names.replaceAll("\n", ", ") : undefined}
      tabIndex={names ? 0 : undefined}
      className={cn(
        "flex w-fit max-w-full min-w-0 items-center gap-(--gap-sm) rounded-full outline-none focus-visible:focus-ring",
        className,
      )}
    >
      {avatars}
      {summary ? (
        <span className="truncate text-table text-muted-foreground">{summary}</span>
      ) : null}
    </span>
  );

  return names ? (
    <Tooltip content={<p className="whitespace-pre-line">{names}</p>}>{stack}</Tooltip>
  ) : (
    stack
  );
}
