import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useState } from "react";

type TokenPair = readonly [token: string, textToken?: string];

const COLOR_GROUPS: ReadonlyArray<{ title: string; tokens: readonly TokenPair[] }> = [
  {
    title: "Surfaces",
    tokens: [
      ["background", "foreground"],
      ["card", "card-foreground"],
      ["popover", "popover-foreground"],
      ["muted", "muted-foreground"],
    ],
  },
  {
    title: "Actions",
    tokens: [
      ["primary", "primary-foreground"],
      ["secondary", "secondary-foreground"],
      ["accent", "accent-foreground"],
    ],
  },
  { title: "Text", tokens: [["foreground"], ["muted-foreground"], ["subtle-foreground"]] },
  { title: "Highlight", tokens: [["highlight", "highlight-foreground"]] },
  { title: "Lines", tokens: [["border"], ["input"], ["ring"]] },
  {
    title: "Sidebar",
    tokens: [
      ["sidebar", "sidebar-foreground"],
      ["sidebar-accent", "sidebar-accent-foreground"],
      ["sidebar-border"],
    ],
  },
];

const STATUS_TONES = ["success", "warning", "info", "destructive"] as const;

const RADII = [
  ["rounded-sm", "Checkbox"],
  ["rounded-md", "Small chip, table row"],
  ["rounded-lg", "Menu item, textarea, tooltip"],
  ["rounded-xl", "Card, menu panel, table frame"],
  ["rounded-2xl", "Dialog, hero card"],
  ["rounded-full", "Controls, badges, avatars"],
] as const;

const ELEVATIONS = [
  ["border", "Card: a faint line, no shadow"],
  ["shadow-hairline", "Inputs and outline buttons"],
  ["shadow-raised", "Active pill, selected nav item"],
  ["shadow-subtle", "Hover lift"],
  ["shadow-elevated", "Menus, popovers, dialogs, sheets"],
] as const;

const TYPE_ROLES = [
  ["text-display", "2,184", "Fluid 40–56px. The one hero figure or statement on a page"],
  ["text-title", "Creators", "Fluid 28–36px. Page title"],
  ["text-stat", "1,412", "Fluid 28–32px. A card figure"],
  ["text-title-sm", "Account settings", "Fluid 24–28px. Form and settings page title"],
  ["text-stat-sm", "$4,200", "20px. A secondary figure"],
  ["text-lead", "The paragraph under a hero", "18px. The paragraph under a hero"],
  ["text-heading", "Card, dialog and section title", "16px semibold. Card, dialog, sheet, section"],
  ["text-base", "Reading text and a page description", "16px. Reading text"],
  ["text-item", "A list row's title", "15px. A list row's title"],
  ["text-sm", "Body, controls and menu items", "14px. Default"],
  ["text-table", "Table cells", "13.5px. Rows in a table"],
  ["text-xs", "Meta, captions, badges, table head", "13px. Secondary"],
  ["text-2xs", "Workspace", "11px. Nav group overline (uppercase)"],
  ["text-3xs", "AM", "9px. Initials in an xs avatar"],
] as const;

const GAPS = [
  ["--gap-xs", "A label and its hint"],
  ["--gap-sm", "An icon and its text, a group of buttons"],
  ["--gap-md", "Items of a list"],
  ["--gap-lg", "Blocks inside a card or form"],
  ["--gap-xl", "Groups of blocks"],
] as const;

const DURATIONS = [
  ["--duration-fast", "Hover, press"],
  ["--duration-base", "Menus, popovers, tabs"],
  ["--duration-slow", "Sheets, height changes"],
] as const;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-sm font-medium">{title}</h3>
      {children}
    </section>
  );
}

function Swatch({ token, textToken }: { token: string; textToken?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="flex h-16 w-40 items-end rounded-lg border p-2 text-xs font-medium"
        style={{
          background: `var(--${token})`,
          color: textToken ? `var(--${textToken})` : undefined,
        }}
      >
        {textToken ? "Aa" : null}
      </div>
      <code className="text-xs text-muted-foreground">--{token}</code>
    </div>
  );
}

const meta = {
  title: "Foundations",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {COLOR_GROUPS.map(({ title, tokens }) => (
        <Section key={title} title={title}>
          <div className="flex flex-wrap gap-4">
            {tokens.map(([token, textToken]) => (
              <Swatch key={token} token={token} textToken={textToken} />
            ))}
          </div>
        </Section>
      ))}
      <Section title="Status: the base marks dots and icons, -foreground is text on a tint">
        <div className="flex flex-wrap gap-4">
          {STATUS_TONES.map((tone) => (
            <div key={tone} className="flex w-40 flex-col gap-1.5">
              <div
                className="flex h-16 flex-col justify-end gap-1 rounded-lg p-2 text-xs font-medium"
                style={{
                  background: `color-mix(in oklch, var(--${tone}) 12%, transparent)`,
                  color: `var(--${tone}-foreground)`,
                }}
              >
                <span className="size-1.5 rounded-full" style={{ background: `var(--${tone})` }} />
                {tone}
              </div>
              <code className="text-xs text-muted-foreground">
                --{tone} · --{tone}-foreground
              </code>
            </div>
          ))}
        </div>
      </Section>
    </div>
  ),
};

export const Typography: Story = {
  render: () => (
    <div className="flex flex-col divide-y">
      {TYPE_ROLES.map(([role, sample, use]) => (
        <div key={role} className="grid grid-cols-[8rem_1fr_14rem] items-baseline gap-6 py-4">
          <code className="text-xs text-muted-foreground">{role}</code>
          <span
            className={`${role} tabular-nums ${role === "text-2xs" ? "tracking-wider text-subtle-foreground uppercase" : ""}`}
          >
            {sample}
          </span>
          <span className="text-xs text-subtle-foreground">{use}</span>
        </div>
      ))}
    </div>
  ),
};

export const Radius: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-6">
        {RADII.map(([radius, use]) => (
          <div key={radius} className="flex w-32 flex-col items-center gap-2 text-center">
            <div className={`size-20 border border-border bg-card ${radius}`} />
            <code className="text-xs text-muted-foreground">{radius}</code>
            <span className="text-xs text-subtle-foreground">{use}</span>
          </div>
        ))}
      </div>
      <Section title="Nesting: inner radius = outer radius − padding (rounded-xl panel, p-1, rounded-lg items)">
        <div className="flex w-56 flex-col rounded-xl border border-border bg-popover p-1 shadow-elevated">
          {["Edit", "Duplicate", "Archive"].map((label, index) => (
            <div
              key={label}
              className={`rounded-lg px-3 py-2 text-sm ${index === 0 ? "bg-muted" : ""}`}
            >
              {label}
            </div>
          ))}
        </div>
      </Section>
    </div>
  ),
};

export const Elevation: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      {ELEVATIONS.map(([elevation, use]) => (
        <div key={elevation} className="flex w-36 flex-col items-center gap-2 text-center">
          <div
            className={`size-24 rounded-xl bg-card ${elevation === "border" ? "border border-border" : elevation}`}
          />
          <code className="text-xs text-muted-foreground">{elevation}</code>
          <span className="text-xs text-subtle-foreground">{use}</span>
        </div>
      ))}
    </div>
  ),
};

export const Spacing: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {GAPS.map(([gap, use]) => (
        <div key={gap} className="grid grid-cols-[8rem_6rem_1fr] items-center gap-6">
          <code className="text-xs text-muted-foreground">{gap}</code>
          <div className="h-4 rounded-sm bg-highlight" style={{ width: `var(${gap})` }} />
          <span className="text-xs text-subtle-foreground">{use}</span>
        </div>
      ))}
    </div>
  ),
};

export const Motion: Story = {
  render: function MotionDemo() {
    const [moved, setMoved] = useState(false);
    return (
      <div className="flex flex-col gap-6">
        <button
          type="button"
          onClick={() => setMoved((value) => !value)}
          className="w-fit rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground"
        >
          Play
        </button>
        {DURATIONS.map(([duration, use]) => (
          <div key={duration} className="grid grid-cols-[9rem_20rem_1fr] items-center gap-6">
            <code className="text-xs text-muted-foreground">{duration}</code>
            <div className="h-8 rounded-full bg-muted p-1">
              <div
                className="size-6 rounded-full bg-card shadow-raised transition-transform ease-out-expo"
                style={{
                  transitionDuration: `var(${duration})`,
                  transform: moved ? "translateX(18rem)" : "none",
                }}
              />
            </div>
            <span className="text-xs text-subtle-foreground">{use}</span>
          </div>
        ))}
        <p className="max-w-prose text-xs text-subtle-foreground">
          Easing is ease-out-expo: fast start, soft landing. Elements enter from an already-visible
          state (fade with a 2–4px shift or a 0.97 scale), never a bounce. Reduced motion clamps
          every duration.
        </p>
      </div>
    );
  },
};
