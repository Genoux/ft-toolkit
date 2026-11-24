---
name: ib-ui
description: Build UI in an inBeat app with @fieldtripagency/ui primitives and tokens. Use when creating or editing components, pages, dialogs, tables, forms, empty states, or when the user mentions ib-ui or @ib-ui.
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

- Import `@fieldtripagency/ui/components/<name>`; `cn` from `@fieldtripagency/ui/lib/utils`.
- Lines only where the eye cannot group things by spacing: no rules between rows, sections or
  label/value pairs. A list that scrolls under a search or header sits in a frame (`DialogBody frame`,
  a framed `ItemGroup`), so the frame is the edge rows pass behind; never edge lines that come and go.
- Tokens only: `bg-background`, `text-muted-foreground`, `border-border`, `bg-primary`. No hex
  colors. Text has three levels: `text-foreground`, `text-muted-foreground` (secondary) and
  `text-subtle-foreground` (meta). Status is `success|warning|info|destructive`; `bg-highlight` is
  the one coloured surface a page may use (a hero figure's `Card`).
- Type by role, never a pixel size: `text-3xs` initials and count dots, `text-2xs` overlines,
  `text-xs` meta and captions, `text-table` table cells, `text-sm` body and controls,
  `text-item` (15px) a list row's title (ItemTitle), `text-title` the page title (36px on list and dashboard pages; PageHeader switches to `text-title-sm`, 28px, on `narrow` and `medium` pages: forms and settings), `text-stat` a card figure, `text-display` the one hero figure (StatValue
  picks them).
- Radius by role: `rounded-sm` checkbox, `rounded-lg` menu item and every
  field in a form or dialog (Input, SearchInput, Select, Combobox, DatePicker, InputGroup, Textarea),
  `rounded-xl` menu, popover, card or table frame, `rounded-2xl` dialog or hero, `rounded-full`
  buttons, badges, chips, tabs, avatars, and fields inside a `PageToolbar` (the shell's search and
  filters; automatic, no class needed). Shadows
  `shadow-hairline|raised|subtle|elevated`.
- Card is the container for any custom content; Stat parts give a figure its look; there is no
  stat card component.
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
  app sidebar content goes in the `sidebar` slot: one `AppNav` per group (`label` is its overline,
  `count` on an item a right-aligned number). Even a
  one- or two-page app uses the shell. Products differ only through `AppShell` props
  (`variant`, `collapsible`, `sidebarWidth`, `headerVariant`), never classes or local shell markup.
- App identity is the same in every app: the top-left of the shell is the app's name only,
  `<AppShellTitle>Pool</AppShellTitle>` in `sidebarHeader` or `topbarBrand` (`asChild` to make it the
  link home). No logo tile, no version, no serif or brand wordmark; `AppShellWorkspace` and
  `AppShellLogo` are deprecated.
- Variants are only the ones an app uses. `Button`: default, secondary, outline, ghost, link,
  dots, destructive (only the confirm of a delete); sizes xs (h-8), sm (h-9), default (h-10),
  lg (h-11), icon*; always `rounded-full`. `Badge`: default, secondary, outline, and the status tones. `TabsList` is a segmented control (filters and view
  toggles too) or `variant="line"` underline tabs for page sections. No counts in tabs.
- Tabs: `Tabs` + `TabsList tabs={[{ value, label, count? }]}` + `TabsContent`; drop
  `TabsContent` for a filter bar.
- Destructive flows open `DestructiveActionDialog` (owns the confirm step; `variant="typed"`
  makes the user type `DELETE <name>`). Fields the action needs, such as a required reason, go in
  as children with `confirmDisabled` until they are valid. Confirm never closes it: call
  `onOpenChange(false)` on success, so a pending or failed action keeps it open.
- Action menus: `Button variant="dots"` + `DropdownMenu`. Inside an element with `data-row` it
  reveals on row hover, focus or selection (always shown on touch); elsewhere it stays visible.
  Several actions on a row go in `TableRowActions`.
- Icon-only buttons are `IconButton` (required `label` = tooltip + `aria-label`), except `dots`.
  It works as a `DropdownMenuTrigger asChild` child; with `asChild` it renders a link. Show/hide
  toggles: `label="Show filters" pressedLabel="Hide filters" pressed={isOpen}`; `pressed` owns the
  look. Menu and popover triggers are not toggles: static label, no `pressed`.
- Labels are one to three words, no ids or emails.
- People in a table are avatars only (`MemberAvatarStack`); it names them in a tooltip.
- Lists: `DataTableShell` + `DataTable`. With no data render `EmptyState` instead of the table;
  DataTable's "No results." is only for an empty filter result.
- Column widths: the primary column (the person, creator or record) gets `w-1/3` (30 to 40%); a
  money column gets a compact width (`w-[12%]`) so its figure stays under its header; every other
  column sets no width and shares what is left. With few columns, cap the primary column and let
  the last column absorb the rest, never a dead gap in the middle. Freezing a column
  (`meta.sticky`) sizes every column to its content instead.
- Cards or a table: a table when people compare or sort records across many columns; a grid of
  record cards (`RecordCard` + `RecordCardHeader`, `<Grid cols={3}>`) when each record has few fields or a
  visual identity and is opened rather than compared. Offering both is a segmented `TabsList`
  (Table / Cards) over the same data.
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
  trail leaves the shell header empty. Actions sit in `PageHeader actions` (detail and form pages) or at the right end of the `PageToolbar` (list pages): at most one primary
  `Button`, the rest `secondary`, `IconButton` or a `dots` menu.
- **List**: `Page` > `PageHeader` (title, one-line description) > `PageToolbar` (search and filters
  on the left, the create action at the right end) > `DataTableShell` + `DataTable`. No data at all:
  `EmptyState` replaces the table, its action the same as the toolbar's, frameless on the page and
  filling the room under the toolbar (see "Empty, loading and error states"). The default size already
  fills the room beside the sidebar; `size="full"` only for a workspace that must pass 1536px.
  Groups of one list (a queue per department or step) stay in that one table under one header, a `TableGroupRow` band per group; what nobody acts on anymore (closed, approved) is a last band that folds open.
- **Detail**: `Page` > `PageHeader` (the record's name, a one-line summary, edit and `dots`
  actions) > optional `Tabs` > one `PageSection` per group: key facts as a
  `DescriptionList layout="tiles"` (it fills the row; a grid of Cards leaves empty columns), many short
  details as `DescriptionList layout="stacked"` (a compact grid, not one long column), related
  lists as tables, or as `Item`s in an `ItemGroup` when they are short. A "…" menu beside header
  buttons is `Button variant="dots" size="icon-sm"`; a header avatar is `Avatar size="xl"`.
- **Form and settings**: `Page size="narrow"` > `PageHeader` > one `PageSection` per topic, each
  holding a `Card` with a `FieldGroup`; the save `Button` ends its card. Destructive settings go in
  a last section and open `DestructiveActionDialog`.
- **Error pages** (404, error, maintenance, access denied): `Page size="centered"` > `EmptyState
  size="page"` (the title is the page's h1, the description on a 33rem measure). Never framed, on a
  bare page or inside the app shell: a page-level message sits on the page. `meta` for the digest or
  "Signed in as".
- **Overview**: `Page` > `PageHeader` > a grid of `Card`s each holding a `Stat` (`<Grid min="sm">`;
  at most one hero figure, `StatValue size="lg"`, first, its Card spanning two columns) >
  `PageSection`s for what needs attention.
- **Spacing** comes from these components, as a rhythm of tight and generous intervals: page
  padding 24px (48px at the bottom); title (36px) to description (16px) 8px; header to toolbar 24px; toolbar to its table 24px;
  sections 40px apart; a section heading to its content 12px. A count in a section heading is muted
  text after the title, `PageSection meta="20 profiles"` ("2,847 customers · sorted by last seen"),
  never a pill or `NumberDot`; with actions the title row centres on them. `Page` and `PageSection` set these,
  `Card` and `Item` pad themselves. Inside them, compose with `Stack`, `Inline` and `Grid`; never add
  spacing between page blocks yourself.

## Empty, loading and error states

Render in this order: loading, then error, then empty, then the content.

- **Height**: every empty state takes the full height available to it and centres its message there;
  never a box at the top with blank space under it. `EmptyState` grows inside a flex column, and
  `Page`, its last `PageSection`, `PageScroll`, `DataTableShell` (while it holds an empty or error
  state) and `Card` hand it that room, and `Tabs`, `Stack` and `SettingsLayout` grow while they hold
  one; with no room it is as tall as its content. A custom container around one is a flex column
  (`Stack`), never a fixed height.
- **Frame**: empty states are frameless. On a list page (empty, no results, a failed load) the
  message sits on the page background, centred in the room under the header or toolbar; in a Card
  or a panel it sits on that surface. Never a solid white box around an empty state. The one frame
  is `frame="dashed"`, for an "add something" slot inside a section among other content (Proof's
  "No languages yet").
- **Empty**: one `EmptyState`. Nothing yet: say what is missing and give the one action that adds
  it, verb + noun ("Create campaign", primary). No results: "No requests match" + "Try another
  search or clear the filters." + a `Clear filters` outline button, never a create action. Nothing
  to do (a cleared queue): title and line, no action. At most one action plus one quieter
  `secondaryAction`. An icon only when it says something (`SearchX` for no results, the record's
  own icon for nothing yet); no illustrations. Title, one line, the action 16px below. In a table:
  `DataTable empty` / `error`; the message replaces the table, column headers included, and
  `DataTableShell` drops its frame and surface while it holds one.
- **Loading**: skeletons when the layout is known (tables via `DataTable isLoading`, lists, cards
  via `RecordCardSkeleton`, detail panels, a record's page header); `SectionSpinner` only for a
  panel whose shape is unknown, alone on the surface (never in a box or an empty card), centred in
  the room left, `Spinner` inline for a short wait (autosave, a toast). Skeletons
  are calm bars at the text's line height, full width with a shorter last line, never drawings of
  avatars, badges or data; known text (a card title, column headers) stays. They pulse in step and
  stop under reduced motion. Buttons take `loading` and keep their width. A loading label ends in
  "…" ("Saving…"). `SectionSpinner` shows after 200ms so a fast load does not flash.
- **Error**: say what happened and what to do next, calm, no blame, no internals (never
  `error.message`; the digest or `errorId` as `meta`). A failed load: `EmptyState tone="destructive"`
  with "Try again", where the content would be; keep data already on screen. A failed action: a
  `toast.error` with the server's safe message; a problem the user must fix before continuing:
  `Alert variant="destructive"` inline; a field: `FieldError`.

## Catalog

Every module of `@fieldtripagency/ui`, imported as `@fieldtripagency/ui/<path>`.

### Actions
- `components/button`: Button with variants, sizes and `buttonVariants` for link styling; `variant="destructive"` for a confirm that deletes; `loading` swaps the leading icon (else the trailing one, else the label's place) for a spinner, so the width never changes; mark a trailing icon `data-icon="inline-end"`.
- `components/text-link`: TextLink, a quiet inline link for text, footers and values (`tone` muted or default, `asChild` for router links).
- `components/icon-button`: icon-only Button with a required label, tooltip and toggle state; `tooltip` for a longer explanation than the label, `indicator` for an unread dot, `tone="warning"` for a stale or risky action.

### Forms
- `components/field`: Field, FieldLabel (`optional` adds a muted "(optional)"; mark only the rarer kind, required `*` or optional), FieldDescription, FieldError (red message with an icon; the label stays neutral), FieldGroup, FieldSet, and FieldRow (two fields side by side, stacked below `sm`, sharing columns with choice-card RadioGroups) for form layout.
- `components/label`: accessible form Label.
- `components/input`: text Input; `size` default (h-10, forms and the page toolbar) or sm (h-9, a compact row in a card or panel). The same `size` exists on InputGroup, SearchInput, DatePicker, ComboboxInput, MultiSelectPopover and Chip.
- `components/textarea`: multi-line Textarea.
- `components/checkbox`: Checkbox; `checked="indeterminate"` shows a dash for a partial select-all.
- `components/radio-group`: RadioGroup and RadioGroupItem, one choice from a few; inside a FieldLabel they become choice cards.
- `components/switch`: Switch for an on/off setting (`size` sm or default).
- `components/select`: single-choice Select; SelectTrigger `variant` default, ghost or badge (a status pill that opens the list, tinted by `tone` like Badge); two badge sizes: `default` in a table row, `lg` for a page or section header's status, as tall as the `icon-sm` buttons beside it.
- `components/combobox`: searchable Combobox with chips for multiple values.
- `components/multi-select-popover`: popover multi-select over a list of options; `disabled` on an option locks that row; `renderLabel(selectedOptions)` sets the trigger text; the trigger takes `id`, `aria-invalid` and `aria-describedby` for FieldLabel and FieldError; takes every `MultiSelectOptionList` prop (`searchable`, `isPending`, …).
- `components/toggle-pills`: pill buttons toggling a set of string options, for filters.
- `components/input-group`: Input or Textarea with inline addons, buttons and text.
- `components/search-input`: controlled search Input with a loading state.
- `components/calendar`: date Calendar (react-day-picker) in the toolkit style.
- `components/date-picker`: DatePicker, a field trigger showing "Apr 30, 2027" that opens the Calendar; `value` and `onChange` use ISO dates ("2027-04-30", "" when empty).

### Display
- `components/avatar`: Avatar (`size` xs, sm, md, lg, xl for a record header), AvatarImage, AvatarFallback, AvatarGroup and AvatarGroupCount.
- `components/media-frame`: MediaFrame, a fixed-aspect photo or video-poster frame with an icon fallback and a spinner (`aspect` square, 4/5, 9/16 or video; `radius` lg or xl); a small square is a thumbnail tile; `scrim="bottom|top"` for white text on the photo, `interactive` zooms on hover or focus for cards that open something, MediaFrameOverlay (`placement` top or bottom) holds badges, names and actions on the photo.
- `components/person-identity`: PersonAvatar (`size` xs, sm, md, lg, xl for a record header), PersonName and PersonIdentity for a person's image and name; PersonIdentity (`size` sm, md, lg; optional `badge`, a role in a list or table row) takes an optional `description` (an email) under the name and `size` sm (default, table cells) or md (32px avatar, name in foreground); a header identity carries no tags: a record's status goes in `PageHeader meta`.
- `components/member-avatar-stack`: overlapping avatars of up to three members plus a remainder count; `showNames` writes "Alex, Sam +3" beside them; `emptyLabel` replaces "Empty".
- `components/badge`: Badge chip: default, secondary, outline, and status tones success, warning, info, destructive; `dot` for a leading tone dot, `size` sm, md or lg (lg beside `icon-sm` buttons), `solid` fills a tone for the one item that stands out (a cycle's "Now"), `color` for an app's own categories (tint, dot and text from one colour). A processing badge is `info` with a spinning `Loader2`.
- `components/chip`: Chip, a removable pill for a picked value (`icon`, `onRemove`, `removeLabel`, `size` sm or default, `disabled`).
- `components/kbd`: Kbd and KbdGroup, keyboard key chips for shortcuts in text, menus and tooltips (`size` sm or default); keys are lucide icons (`Command`, `ArrowBigUp`, `CornerDownLeft`), never unicode glyphs.
- `components/status-dot`: StatusDot, a coloured dot and its label for a status (`tone` success, warning, destructive, info or neutral, `pulse` for live or processing; `size="lg"` for a headline status, a 10px dot with the label at the surrounding size; `color` for an app's own categories, such as `var(--color-turn-people)`); use it for statuses instead of a coloured chip.
- `components/meter`: Meter, a thin inline usage bar (`value` 0 to 100) with an optional `label` after it, for a table cell or under a Stat in a Card; `fill` stretches it to the full width (a sidebar usage card).
- `components/number-dot`: small count pill, renders nothing at zero; never beside a heading (a heading's count is `PageSection meta`).
- `components/labeled-field`: read-only label and value pair.
- `components/info-hint`: InfoHint, a small info icon whose tooltip explains a figure or term (hover, focus or tap); `label` names it.
- `components/description-list`: DescriptionList and DescriptionItem, label and value pairs separated by spacing: `layout` inline (a properties list, muted labels in one column and each value beside its label, for panels and sheets), stacked (label over value in as many columns as fit, for a record's details) or tiles (a few short facts side by side, one line each), also per row; `align="end"` right-aligns amounts and `total` sets the result row apart (a budget receipt); `frame` sets the list on the toolkit's panel (`panelClassName`), the same surface each tile sits on; `divided` (with `frame`, inline only) adds faint rules between rows of the toolkit's 36px row height (a menu item's h-9: a 20px line with 8px above and below, the rule included), for a contained panel of label and value pairs whose values sit far from their labels (a sheet's details, a receipt with `align="end"`), never on a page list or between sections; `wide` gives a stacked row the whole width; a row with an empty value is left out.
- `components/empty-state`: EmptyState with icon, title, description, an optional `action` and a quieter `secondaryAction` (`onClick`, or `href` so a Server Component can link; pass `renderLink` for the router Link, it must forward props and ref, which `next/link` does) and `meta`, a quiet line under them (a support reference, the signed-in account). It grows into the room its flex parent leaves and centres there, else it is its content's height; `frame={false}` drops the card inside something already framed, `frame="dashed"` marks an empty slot to fill; `tone="destructive"` for a load error; `size="page"` for a 404, error, maintenance or access-denied page (h1 title, body-size description on a 33rem measure, large actions), never framed.
- `components/card`: Card, the bordered surface for a group of content (a form, key facts, a stat), with CardHeader, CardTitle, CardDescription, CardAction and CardFooter; padding and gap built in; `asChild` makes a whole card a link; CardLink makes the card clickable while CardAction keeps its own menu; CardSection splits a card with full-width rules; `CardFooter fill` sets a decision's paired actions (Approve and Request changes) side by side in equal columns, main action first, stacking full width only when the card is too narrow.
- `components/record-card`: a record card in a grid (a campaign, a discovery request): RecordCard (a Card at record density, 16px padding), RecordCardHeader (`media`, `title` (a CardLink opens the whole card), `description` up to two lines, `action` a dots menu), RecordCardMark (`name` gives one letter for a client or brand, or an icon as children; `size` md/lg) for any record that is not a person, people take PersonAvatar (two letters), RecordCardTags (a plan Badge and a StatusDot), RecordCardFacts (`DescriptionItem`s label over value, two per row, ruled off and pinned to the bottom so a row of cards lines up), RecordCardMeter (`label` left, `valueLabel` right, `value` the bar) and RecordCardSkeleton (`tags`, `meter`, matching the loaded cards) for loading at the same height; all inside a `RecordCard`.
- `components/stat`: parts that give a figure its look, with no padding or surface: Stat (a column with a tight gap), StatLabel (muted; an InfoHint may follow the words), StatValue (tabular figure; `size` sm for a secondary figure, default a card figure, lg the one hero figure; `tone` success, warning or destructive colours the figure only, with the reason in a StatMeta), StatMeta (a subtle context line) and StatDelta (a coloured change with its arrow, up, down or flat, leading a StatMeta). Put them in a `Card` and lay the card out for its content: a Meter or MemberAvatarStack under the Stat, several Stats in a `Grid`, a Stat in a header's corner. Loading: a `Skeleton` with a width inside StatValue or StatMeta sits on the line at the text's height.
- `components/item`: Item rows (ItemMedia, ItemContent with ItemTitle and ItemDescription, ItemActions) inside an ItemGroup frame with dividers, for lists of people, files or settings; `frame={false}` for a list inside a dialog or sheet (rows separated by spacing, text lined up with the content); `disabled` greys out a row that cannot be picked (disable its control too); padding built in, `asChild` makes a row a link, a `label` or an `li`. ItemColumn lines a value up across rows and stacks on a phone, ItemControl holds a leading checkbox, ItemLink makes the row open the record while its controls stay clickable.
- `components/pagination`: Pagination (page pills, prev/next, ellipsis, "Showing 1–25 of 2,847"; `onPageChange`, or `getHref` with `renderLink`) and PaginationLoadMore (shown, total, onLoadMore, loading).
- `components/dropzone`: Dropzone and DropzoneFile, a keyboard-accessible file drop on `input type=file` (`onFiles(accepted, rejected)`, accept, maxSize, multiple, error, disabled); file rows show progress, uploaded, error with retry, and remove; `formatFileSize`.
- `components/prose`: Prose, typography for rendered markdown or HTML on the type roles; `asChild` for an `article`.
- `components/separator`: horizontal or vertical Separator; `size="sm"` is a 16px vertical rule centred between the items of a header or a floating bar.
- `components/carousel`: Embla Carousel, CarouselContent and CarouselItem.
- `components/collapsible-section`: animated CollapsibleSection. Use `CollapsibleHeader` (title, `meta`, `actions`) and `CollapsibleBody`; pick the look with `variant="card"` (a card surface), `divider` (line under the header, or none with equal spacing), `chevron="start"|"end"` and `size="sm"|"md"`, never with padding classes. `CollapsibleTrigger` and `CollapsibleContent` are the bare parts for a header the app draws itself.

### Feedback
- `components/alert`: Alert, AlertTitle, AlertDescription and AlertAction (default, info, success, warning, destructive); a toned alert sets icon, title and description in the tone, and a `secondary` Button in AlertAction takes the tone; the title wraps, `className="line-clamp-1"` keeps it to one line.
- `components/sonner`: Toaster for `sonner` toasts; mount once in the root layout.
- `components/spinner`: Spinner (pass `label` when it is the only sign of loading) and SectionSpinner for a panel whose layout is unknown (appears after 200ms).
- `components/skeleton`: Skeleton, a pulsing `bg-muted` bar; give it a height and width, `rounded-full` only for avatars and pills.
- `components/progress`: Progress bar.
- `components/platform-disclaimer`: dismissible notice whose dismissal is stored in a cookie.

### Navigation
- `components/app-nav`: sidebar navigation list driven by `items` and `renderLink`; `label` is the group overline, `count` on an item a right-aligned number, `items` on an item a collapsible sub-menu (`defaultOpen`), `trailing` a status (Spinner, StatusDot) and `actions` a row menu revealed on hover; on the group, `collapsible` + `defaultOpen` and `action` (a control beside the label). One AppNav per group.
- `components/nav-links`: NavLinks, the top bar's links (`items`, `renderLink`, `variant` pill or underline, `orientation`); a sliding indicator marks the active link.
- `components/nav-user`: user menu with name, email, avatar and dropdown; `theme` + `onThemeChange` add a Theme sub-menu, `onSignOut` the sign-out item; `variant` sidebar (collapses to the avatar) or avatar (top bar; `showName` adds the name and a chevron from md). The account menu holds account items only, never app content; NavUserMenu is its items, to open it from another trigger.
- `components/breadcrumb`: Breadcrumb from `links` + `page` (pass `renderLink` for the router Link); renderLink must return an element that forwards props and ref, which `next/link` does. It truncates the page title and collapses links into a … menu below `lg` and when there are more than 2 links.
- `components/tabs`: Tabs, TabsList (from a `tabs` array: a segmented control with a sliding thumb, or `variant="line"` underline tabs; tabs that do not fit collapse into a trailing "…" menu and the active tab always stays in the row; `wrap` for a second row instead; never put counts in tabs, show them in the section header) and TabsContent.
- `components/sidebar`: Sidebar primitives that AppShell is built from; apps do not use them directly.

### Overlays
- `components/dialog`: modal Dialog; `size` sm (28rem, the floor), md or lg; DialogBody scrolls long content between a fixed header and footer; `frame` scrolls it inside a bordered box lined up with the fields around it, for a list under a search.
- `components/alert-dialog`: AlertDialog for interrupting confirmations; `default` is Dialog `md` wide, `sm` Dialog `sm`.
- `components/destructive-action-dialog`: confirm step for destructive actions in the Dialog look, optionally typed; children add fields (a required reason) and `confirmDisabled` holds confirm until they are valid.
- `components/sheet`: side Sheet panel (right, left, bottom, top; `size`); SheetHeader is ruled off and padded like SheetBody, and with `showCloseButton` holds the close button centred on its first row; SheetBody scrolls under a sticky footer; SheetSection titles a part of the body (`aside` at the end), 32px apart, with no boxes or rules. A record's details drawer is a right Sheet. Compose a sheet or side panel as titled sections, one group each: a SheetSection title, then at most one framed `DescriptionList` (a card holds one framed panel too). Never box a single value: a status or a count is the section's `aside`, a progress bar sits under its title. Nothing trails the panels: "Requested by" is the last row of its group, a note is its own titled section.
- `components/popover`: Popover, with PopoverHeader, PopoverTitle, PopoverDescription and PopoverFooter for a filter or form popover.
- `components/dropdown-menu`: DropdownMenu; shortcuts as `Kbd` in DropdownMenuShortcut.
- `components/context-menu`: ContextMenu, the right-click menu, in the DropdownMenu look.
- `components/tooltip`: Tooltip and TooltipProvider.
- `components/portal-container`: PortalContainerProvider and usePortalContainer to portal overlays into a chosen element.

### Data
- `components/data-table`: DataTable driven by TanStack `columns` and `data` (one comfortable row height); `isLoading` (skeleton rows), `empty`, `error`, `stickyHeader`, column `meta.numeric` to right-align money and amounts (counts stay left), `meta.sticky` to freeze an identity column, `meta.hideBelow` to drop a column on phones; `getSelectionColumn()` adds row selection and DataTableSelectionBar shows the bulk actions.
- `components/data-table-selection-bar`: DataTableSelectionBar for selected rows: floating by default ("3 selected", actions, Clear), or `variant="inline"` above the list with `onSelectAll`, `totalCount` ("2 of 5 selected"), a `summary` line and the batch action.
- `components/data-table-shell`: the table's card frame (white, rounded, faint border) that scrolls a DataTable; while a table scrolls sideways a soft shadow shades each frame edge with more columns past it; holding an empty, no-results or error state it grows to the room left on the page; inside a Card it drops its frame, `frame={false}` for a dialog or section that already frames it.
- `components/data-table-sortable-header`: sortable column header for DataTable columns.
- `components/table`: Table, TableHeader, TableBody, TableRow, TableHead and TableCell primitives: the header is a tinted strip flush with the frame, rows run the full width separated by hairlines; `hideBelow` sm or md on head and cells drops a column on narrow screens; TableGroupRow (`colSpan`, `count`) is a subtle band titling a group of rows under the one header, one TableBody per group (never a table per group); TableCaption names the table (`sr-only` when a heading already says it), TableFooter holds totals; TableRowActions holds a row's actions, hidden until the row is hovered, focused or selected (always shown on touch).
- `components/load-more-sentinel`: invisible marker that triggers infinite loading.

### Layout
- `components/app-shell`: AppShell page frame. `layout="sidebar"` (default: sidebarHeader, sidebar, sidebarFooter, header) or `layout="topbar"` (topbarBrand, topbarNav, topbarActions; a menu sheet on phones); AppShellTitle (the app's name, the only identity at the top-left; `asChild` for the home link), and AppShellHeaderActions (`children` inline from md, `menu` items in a "…" menu below md).
- `components/page`: Page (body column, 24px padding; `size` default (fills up to 1536px), narrow (forms, a single-column settings page), medium (1024px, settings with a SettingsLayout nav, centred with its title) or full (no cap); `asChild` to render `main`; `size="centered"` (a column up to 36rem) with `footer` for sign-in, waiting, 404 and maintenance; `fill` lets the last child fill the remaining height and scroll inside, for boards and split views), PageHeader (`title`, `description`, `actions`, `back` for a detail page's parent link, `pager` for a PagePager ("2 of 3" with previous and next) on the back row, `media` for an avatar or logo beside the title, `meta` for status badges), PageToolbar (`sticky` filter bar; controls keep their default size, fields become pills), PageScroll (the scrolling region of a `fill` page, running to the window edge) and PageSection (optional `title`, `meta` (muted text after the title: a count, "20 profiles"), `description`, `actions`, then content). Page grows to the shell's height so an empty state fills the room under its header.
- `components/detail-layout`: DetailLayout inside Page: the main content beside a sticky side column from lg (`summary` first, `aside` after); on a phone summary, main, aside. Also a form with its summary (`aside` only). `asidePosition="start"` puts the column on the left; `variant="ruled"` goes around a Page instead, a full-height 320px column ruled off (a record's info column, Pool's creator profile), sliding over the content on a phone while `asideOpen`.
- `components/settings-layout`: SettingsLayout, a settings page with a grouped section nav (`groups`, `renderLink`) beside PageSections, inside `Page size="medium"`; a scrolling pill row on phones. A simple settings page without a nav is `Page size="narrow"` with PageSections.
- `components/layout`: Stack (one under the other), Inline (side by side, wraps; `justify="between"` for a toolbar) and Grid (equal columns that reflow; `min` sm, md or lg, or fixed `cols` 2, 3 or 4; `phoneCols={2}` keeps two columns on a phone; `stretch` lets a few cards fill the row), each with `gap` xs, sm, md, lg or xl and `asChild`.

### Hooks and lib
- `hooks/use-mobile`: `useIsMobile()` breakpoint hook.
- `lib/utils`: `cn()` class merging.
- `lib/easing`: `EASING_FUNCTION` curves shared with motion animations.
- `lib/initials`: `getInitials(name, fallback)`.
- `lib/surface`: `panelClassName`, the quiet near-white panel with a faint edge that framed and tiled DescriptionLists sit on; a tile of figures in a card (I&R's pay tiles: a Stat with padding) uses it too, never `bg-muted` or a second tint.

## Setup in an app

```css
/* src/app/globals.css */
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@fieldtripagency/ui/theme.css";
```

`next.config.ts`: `transpilePackages: ["@fieldtripagency/ui"]` (ui ships source; core and next ship compiled JS).
The template installs every peer the catalog needs.

## Look: neutral, Fieldtrip, or product-specific

Decide this when the app starts and record it under "Look" in the app's `AGENTS.md`, one line:
the choice plus, for product-specific, which tokens it overrides and why (`product-specific:
--primary, --radius and font-sans for a playful game feel`). The components are the same in all
three; only tokens and signature surfaces change.

- **Neutral** (default; dashboards and internal tools): `theme.css` alone.
- **Fieldtrip brand**: add `@import "@fieldtripagency/ui/fieldtrip.css";` after `theme.css`. It gives the
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
