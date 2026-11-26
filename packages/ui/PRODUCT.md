# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Builders**: Fieldtrip developers and their coding agents, building internal apps from the `ft-ui` skill (`packages/standards/skills/ft-ui`). They compose screens from the catalog; they do not design components.
- **App users**: two audiences use the apps built on the kit.
  - Fieldtrip / inBeat staff running daily operations (Impact & Recognition, Pool's back office). Trained, repeat users who work in the apps for long stretches.
  - External creators who use some screens (Pool). Occasional users with no training, often arriving from a link.

## Product Purpose

`@fieldtripagency/ui` is the one set of tokens and components every Fieldtrip app is built from. It exists so that apps share the same patterns (shell, page frame, tables, forms, dialogs, states) instead of each app reinventing them. Success: a new or existing app gets consistent, solid plumbing by importing the kit, without losing the layout and identity it already has.

## Positioning

The kit is enforced, not suggested. It ships as source, the `ft` CLI (`ft check`) fails builds on other UI libraries, hand-set colours, spacing lengths and type sizes, and the agent standard tells coding agents exactly which component, variant and page pattern to use. Consistency comes from the rules and the checker, not from people remembering a style guide.

## Operating Context

- Consumed by Next.js App Router apps created from `packages/standards/template` (`ft create`).
- Reviewed in Storybook (`packages/ui/stories`): atoms, molecules, organisms and generic page patterns (list, detail, form, settings, overview, with their loading, empty and error states), filled with the apps' real data shapes.
- Changes to the kit are released as versions and picked up by the apps; the component and pattern stories are the regression baseline (`bun run visual`, `bun run align`), and a change is judged in the real apps through `bun run sync` before release.
- Each app records its own UI decisions in its `AGENTS.md` ("This app"); the kit holds no copies of app pages.
- Apps it serves: Pool (ugc-hub), Impact & Recognition and Proof. None runs on the kit yet; each migrates in its own repo.

## Capabilities and Constraints

- Stack: React 19, Radix and Base UI primitives, Tailwind v4 tokens, `lucide-react` icons, `motion` for animation, `sonner` toasts, TanStack Table.
- Three looks share the same components: neutral (default, `theme.css`), Fieldtrip brand (`fieldtrip.css`), or product-specific token overrides in the app's `globals.css`. Only tokens and signature surfaces differ between apps.
- Apps never copy, fork or restyle a kit component. A missing piece is composed in the app and marked `// toolkit-gap:`; it moves into the kit once a second app needs it.
- The kit swaps components; it does not redesign an app's layout. Each app's existing layout is preserved unless its owner asks otherwise.
- Type, spacing, radius and control heights are set by role tokens, never raw values.

## Brand Commitments

- Fieldtrip is the parent brand; the logo is the serif `FIELDTRIP` wordmark (`.github/assets/fieldtrip-logo.svg`, `fieldtrip-logo-light.svg`). The old star mark is retired.
- Faces: Geist for all interface text; Diplomat (`font-serif`) only for sparing statements; SwissNow (`font-brand`) for a wordmark or brand headline. Font files ship with the package.
- Fieldtrip brand palette is exposed as `--color-fieldtrip-*` tokens in `fieldtrip.css`.
- App identity is the app's name only in the shell (`AppShellTitle`): no logo tile, no wordmark.
- Interface copy follows the Fieldtrip voice in its interface register: outcome first, active voice, sentence case, verbs on buttons, no em dashes or exclamation marks.

## Evidence on Hand

- Real data shapes from Pool, Impact & Recognition and Proof in `packages/ui/stories/lib` (`*-fixtures.ts`), used by the component and pattern stories.
- Former Storybook copies of the apps' pages (removed 2026-11-26): last version in commit `c50169a`, screenshots kept outside the repo.
- README cover: `.github/assets/ui-cover.png`, from the `Showcase/Component Grid → Cover` story.
- No user research, usage metrics or testimonials exist. Do not invent stats, records or columns in stories; use the apps' real data shapes.

## Product Principles

1. Never regress an app. A kit change is judged on the real app screens it lands in, not on an isolated demo.
2. Unify plumbing, preserve identity. Shared patterns live in the kit; what makes a product itself stays in the app.
3. Rules over taste. A decision worth keeping becomes a token, a variant or an `ft check` rule so agents cannot drift from it.
4. Serve both audiences. Staff need dense, fast, scannable tools; creators need screens that explain themselves on first use.

## Accessibility & Inclusion

- Type scale is capped so browser zoom still reaches 200%.
- All animation respects `prefers-reduced-motion`.
- Icon-only buttons always carry a label (tooltip and `aria-label`).
- No WCAG conformance level has been formally committed to yet.
