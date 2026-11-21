---
name: ib-ui
description: Build UI in an inBeat app with @inbeat/ui primitives and tokens. Use when creating or editing components, pages, dialogs, tables, forms, empty states, or when the user mentions ib-ui or @ib-ui.
---

# ib-ui

## Before writing any UI

1. Read "Look" under "This app" in `AGENTS.md`. If it is empty, settle it with the user first
   (see [Look](#look-neutral-fieldtrip-or-product-specific)).
2. Name the layer of what you are about to build (the table is in the "UI" section of the
   standard):
   - **Plumbing** (controls, forms, dialogs, menus, tables, tabs, toasts, shell, page frame):
     from the [Catalog](#catalog), laid out with a [page pattern](#page-patterns). A missing piece
     follows **Missing component or variant** below.
   - **Signature surface** (what makes this product itself: a game board, a canvas, a hero, a
     custom card): build it in the feature's `components/` on the tokens, with catalog pieces
     inside it where they fit.
3. Pick the page pattern. A page that needs another layout is fine; add a line under
   **Deliberate deviations** saying which page and why.

Icons are always `lucide-react`.

**Not allowed**: copying, forking or restyling a toolkit component, faking a variant with
override classes on it, installing another UI library, running `shadcn add`. `ib check` fails on
other UI, icon and animation libraries, hand-set colours, spacing lengths and type sizes.

**Missing component or variant**: do not stop. Compose it in the feature's `components/` from
catalog primitives and tokens, mark it `// toolkit-gap: <what is missing>` so it is greppable,
and tell the user which piece is missing. It moves to ib-toolkit (`packages/ui` plus its story)
once a second app needs it.

## Rules

- Import `@inbeat/ui/components/<name>`; `cn` from `@inbeat/ui/lib/utils`.
- Tokens only: `bg-background`, `text-muted-foreground`, `border-border`, `bg-primary`, radius
  scale `rounded-{sm..4xl}`, shadows `shadow-hairline|subtle|elevated`. No hex colors.
- Spacing: never write `p-*`, `m-*`, `gap-*` or `space-*` yourself; `ib check` fails on them.
  Components own it: `Page`, `PageSection`, `Card` and `Item` pad themselves, and children are
  spaced by `Stack` (one under the other), `Inline` (side by side, wraps) or `Grid` (equal
  columns that reflow). Pick the gap by role, not by size: `xs` a label and its hint, `sm` an
  icon and its text or a group of buttons, `md` items of a list, `lg` blocks inside a card or
  form, `xl` groups of blocks. Rows in a bordered list are `Item`s in an `ItemGroup`, never a
  `div` with padding and `border-b`. A signature surface (a game board, a canvas, a hero) may
  space itself: mark its file `// signature-surface: <what>`. Density is the app's choice, made
  once in `globals.css` by overriding `--gap-xs` … `--gap-xl`, `--card-padding` and
  `--item-padding-x|y`.
- App shells: `AppShell` + `AppNav`, never Sidebar primitives. Links come in via `renderLink`;
  app sidebar content goes in the `sidebar` slot. Products differ only through `AppShell` props
  (`variant`, `collapsible`, `sidebarWidth`, `headerVariant`), never classes or local shell markup.
- Variants are only the ones an app uses. `Button`: default, secondary, outline, ghost, link,
  dots; sizes xs, sm, default, lg, icon*; always `rounded-full`, no destructive variant.
  `Badge`: default, secondary, outline. `TabsList` is pills only.
- Tabs: `Tabs` + `TabsList tabs={[{ value, label, count? }]}` + `TabsContent`; drop
  `TabsContent` for a filter bar.
- Destructive flows open `DestructiveActionDialog` (owns the confirm step; `variant="typed"`
  makes the user type `DELETE <name>`). Fields the action needs, such as a required reason, go in
  as children with `confirmDisabled` until they are valid. Confirm never closes it: call
  `onOpenChange(false)` on success, so a pending or failed action keeps it open.
- Action menus: `Button variant="dots"` + `DropdownMenu`. Inside an element with `data-row` it
  reveals on row hover; elsewhere it stays visible.
- Icon-only buttons are `IconButton` (required `label` = tooltip + `aria-label`), except `dots`.
  It works as a `DropdownMenuTrigger asChild` child; with `asChild` it renders a link. Show/hide
  toggles: `label="Show filters" pressedLabel="Hide filters" pressed={isOpen}`; `pressed` owns the
  look. Menu and popover triggers are not toggles: static label, no `pressed`.
- Labels are one to three words, no ids or emails.
- People in a table are avatars only (`MemberAvatarStack`); it names them in a tooltip.
- Lists: `DataTableShell` + `DataTable`. With no data render `EmptyState` instead of the table;
  DataTable's "No results." is only for an empty filter result.
- Forms (client leaf): `schema.safeParse(values)` with the schema shared with the action; on
  failure keep one message per field from `issues` (`issue.path[0]`). Per field:
  `<Field data-invalid={Boolean(errors.name)}><Label/><Input aria-invalid={Boolean(errors.name)}
  aria-describedby="name-error"/><FieldError id="name-error">{errors.name}</FieldError></Field>`.
  On success `const result = await action(parsed.data)`; `if (!result.ok) toast.error(result.error)`
  (`sonner`; `result.errorId` when present is the support reference).
- Animation: `motion/react` only, respecting `prefers-reduced-motion`.
- `page.tsx` stays a Server Component (title, layout, data loading); only the stateful leaf (a
  table with dialogs, a form) is `"use client"`.

## Page patterns

Every page body is `Page` > `PageHeader` > content. Stories: Storybook "Layout/Page". These are
the default; a page that needs something else is recorded under **Deliberate deviations**.

- **Frame.** Inside `AppShell`, the shell header holds the `Breadcrumb` (where you are) and the
  page body starts with `PageHeader` (what this page is, its actions). A top-level page with no
  trail leaves the shell header empty. Actions sit in `PageHeader actions`: at most one primary
  `Button`, the rest `secondary`, `IconButton` or a `dots` menu.
- **List**: `Page` > `PageHeader` (title, description, the create action) > `PageSection` with the
  filter bar (`SearchInput`, `TabsList` or `TogglePills`) above `DataTableShell` + `DataTable`.
  No data at all: `EmptyState` replaces the section, its action the same as the header's. Use
  `size="full"` when the table needs the width.
- **Detail**: `Page` > `PageHeader` (the record's name, a one-line summary, edit and `dots`
  actions) > optional `Tabs` > one `PageSection` per group: key facts as a grid of
  `Card`s, one `LabeledField` each (`<Grid min="sm">`, the same grid as overview stats), related
  lists as tables, or as `Item`s in an `ItemGroup` when they are short.
- **Form and settings**: `Page size="narrow"` > `PageHeader` > one `PageSection` per topic, each
  holding a `Card` with a `FieldGroup`; the save `Button` ends its card. Destructive settings go in
  a last section and open `DestructiveActionDialog`.
- **Overview**: `Page` > `PageHeader` > a grid of stat `Card`s (`<Grid min="sm">`) >
  `PageSection`s for what needs attention.
- **Spacing** comes from these components: `Page` spaces its sections, `PageSection` its header
  and content, `Card` and `Item` pad themselves. Inside them, compose with `Stack`, `Inline` and
  `Grid`.

## Catalog

Every module of `@inbeat/ui`, imported as `@inbeat/ui/<path>`.

### Actions
- `components/button`: Button with variants, sizes and `buttonVariants` for link styling.
- `components/icon-button`: icon-only Button with a required label, tooltip and toggle state.

### Forms
- `components/field`: Field, FieldLabel, FieldDescription, FieldError, FieldGroup, FieldSet and friends for form layout.
- `components/label`: accessible form Label.
- `components/input`: text Input.
- `components/textarea`: multi-line Textarea.
- `components/checkbox`: Checkbox; `checked="indeterminate"` shows a dash for a partial select-all.
- `components/select`: single-choice Select.
- `components/combobox`: searchable Combobox with chips for multiple values.
- `components/multi-select-popover`: popover multi-select over a list of options; `disabled` on an option locks that row; `renderLabel(selectedOptions)` sets the trigger text; takes every `MultiSelectOptionList` prop (`searchable`, `isPending`, …).
- `components/toggle-pills`: pill buttons toggling a set of string options, for filters.
- `components/input-group`: Input or Textarea with inline addons, buttons and text.
- `components/search-input`: controlled search Input with a loading state.
- `components/calendar`: date Calendar (react-day-picker) in the toolkit style.
- `components/date-picker`: DatePicker, a pill trigger showing "Apr 30, 2027" that opens the Calendar; `value` and `onChange` use ISO dates ("2027-04-30", "" when empty).

### Display
- `components/avatar`: Avatar, AvatarImage, AvatarFallback, AvatarGroup and AvatarGroupCount.
- `components/person-identity`: PersonAvatar, PersonName and PersonIdentity for a person's image and name.
- `components/member-avatar-stack`: overlapping avatars of up to three members plus a remainder count.
- `components/badge`: Badge chip.
- `components/number-dot`: small count pill, renders nothing at zero.
- `components/labeled-field`: read-only label and value pair.
- `components/empty-state`: EmptyState with icon, title, description and an optional labelled action: `onClick`, or `href` so a Server Component can link (pass `renderLink` for the router Link; it must forward props and ref, which `next/link` does).
- `components/card`: Card, the bordered surface for a group of content (a form, key facts, a stat); padding and gap built in.
- `components/item`: Item rows (ItemMedia, ItemContent with ItemTitle and ItemDescription, ItemActions) inside an ItemGroup frame with dividers, for lists of people, files or settings; padding built in, `asChild` makes a row a link or an `li`.
- `components/separator`: horizontal or vertical Separator.
- `components/carousel`: Embla Carousel, CarouselContent and CarouselItem.
- `components/collapsible-section`: animated CollapsibleSection with trigger and content.

### Feedback
- `components/alert`: Alert, AlertTitle and AlertDescription (default, destructive); the title wraps, `className="line-clamp-1"` keeps it to one line.
- `components/sonner`: Toaster for `sonner` toasts; mount once in the root layout.
- `components/spinner`: Spinner and SectionSpinner for loading states.
- `components/skeleton`: Skeleton placeholder.
- `components/progress`: Progress bar.
- `components/platform-disclaimer`: dismissible notice whose dismissal is stored in a cookie.

### Navigation
- `components/app-nav`: sidebar navigation list driven by `items` and `renderLink`.
- `components/nav-user`: sidebar user menu with name, email, avatar and dropdown.
- `components/breadcrumb`: Breadcrumb from `links` + `page` (pass `renderLink` for the router Link); renderLink must return an element that forwards props and ref, which `next/link` does. It truncates the page title and collapses links into a … menu below `lg` and when there are more than 2 links.
- `components/tabs`: Tabs, TabsList (pills from a `tabs` array) and TabsContent.
- `components/sidebar`: Sidebar primitives that AppShell is built from; apps do not use them directly.

### Overlays
- `components/dialog`: modal Dialog.
- `components/alert-dialog`: AlertDialog for interrupting confirmations.
- `components/destructive-action-dialog`: confirm step for destructive actions in the Dialog look, optionally typed; children add fields (a required reason) and `confirmDisabled` holds confirm until they are valid.
- `components/sheet`: side Sheet panel.
- `components/popover`: Popover.
- `components/dropdown-menu`: DropdownMenu.
- `components/tooltip`: Tooltip and TooltipProvider.
- `components/portal-container`: PortalContainerProvider and usePortalContainer to portal overlays into a chosen element.

### Data
- `components/data-table`: DataTable driven by TanStack `columns` and `data`.
- `components/data-table-shell`: scrollable wrapper that holds a DataTable.
- `components/data-table-sortable-header`: sortable column header for DataTable columns.
- `components/table`: Table, TableHeader, TableBody, TableRow, TableHead and TableCell primitives.
- `components/load-more-sentinel`: invisible marker that triggers infinite loading.

### Layout
- `components/app-shell`: AppShell page frame with sidebar and header, and AppShellLogo.
- `components/page`: Page (centred body column; `size` default, narrow or full; `asChild` to render `main`), PageHeader (`title`, `description`, `actions`) and PageSection (optional `title`, `description`, `actions`, then content).
- `components/layout`: Stack (one under the other), Inline (side by side, wraps; `justify="between"` for a toolbar) and Grid (equal columns that reflow; `min` sm, md or lg), each with `gap` xs, sm, md, lg or xl and `asChild`.

### Hooks and lib
- `hooks/use-mobile`: `useIsMobile()` breakpoint hook.
- `lib/utils`: `cn()` class merging.
- `lib/easing`: `EASING_FUNCTION` curves shared with motion animations.
- `lib/initials`: `getInitials(name, fallback)`.

## Setup in an app

```css
/* src/app/globals.css */
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@inbeat/ui/theme.css";
```

`next.config.ts`: `transpilePackages: ["@inbeat/ui"]` (ui ships source; core and next ship compiled JS).
The template installs every peer the catalog needs.

## Look: neutral, Fieldtrip, or product-specific

Decide this when the app starts and record it under "Look" in the app's `AGENTS.md`, one line:
the choice plus, for product-specific, which tokens it overrides and why (`product-specific:
--primary, --radius and font-sans for a playful game feel`). The components are the same in all
three; only tokens and signature surfaces change.

- **Neutral** (default; dashboards and internal tools): `theme.css` alone.
- **Fieldtrip brand**: add `@import "@inbeat/ui/fieldtrip.css";` after `theme.css`. It gives the
  brand palette as `--color-fieldtrip-<name>` and `-light` (ink, olive, orange, mauve, brown,
  green, spring, yellow, sky, pink, powder; utilities like `bg-fieldtrip-orange`) and maps
  `font-sans` to SwissNow and `font-serif` to Diplomat. The font files are licensed and stay in
  the app: load them with `next/font/local` and put `--font-swiss-now` and `--font-diplomat` on
  `<html>`.
- **Product-specific**: override tokens in the app's `globals.css` after the imports: colours and
  `--radius` in `:root` (and `.dark`), fonts as `--font-sans` in `@theme inline`, the way
  `fieldtrip.css` does. Every toolkit component follows, so the plumbing takes
  the product's look without a single override class. Colours the product adds get their own
  tokens there (`--color-board: ...` in `@theme`), never hex in components. Signature surfaces
  (a game card, a player) are built in the app on these tokens; they are not toolkit gaps and stay
  in the app until a second app needs them. Never copy a toolkit component into the app to edit it.

## Before you say it is done

Look at what you built, the way a user will:

1. Run the app (`bun dev`) and open each page you changed at 1440px and 390px wide, in light and
   dark when the app has both. Use your browser tool, or a Playwright screenshot.
2. Compare it with its [page pattern](#page-patterns) and check: content never touches a border
   or edge; one gap step per level; one primary action per page; text takes the type roles;
   nothing overflows or wraps a title at 390px; empty, loading and error states render.
3. Fix what is off before reporting. Say in the report which pages and widths you looked at; if
   you could not run the app, say so.

## Adding or changing a component

Do it in `ib-toolkit/packages/ui/src/components`, add or update its story in `packages/ui/stories`
(`bun run storybook`; stories are grouped like the catalog, render every variant and size from a
declared list, and use the neutral data in `stories/lib/fixtures.ts`), add it to the Catalog
above (a test enforces this), then `bun run sync <app-dir>`. Domain compositions tied to one app's
data stay in the app; once a second app needs one, promote it here.
