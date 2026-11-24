import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FieldLabel } from "../src/components/field";
import { MultiSelectPopover } from "../src/components/multi-select-popover";
import { RadioGroup, RadioGroupItem } from "../src/components/radio-group";
import { Select, SelectTrigger, SelectValue } from "../src/components/select";
import { Switch } from "../src/components/switch";

function attributesOf(markup: string, slot: string): string {
  return markup.match(new RegExp(`<[^>]*data-slot="${slot}"[^>]*>`))?.[0] ?? "";
}

function classesOf(markup: string, slot: string): string[] {
  return (attributesOf(markup, slot).match(/class="([^"]*)"/)?.[1] ?? "").split(" ");
}

function trigger(variant?: "default" | "ghost" | "badge") {
  return renderToStaticMarkup(
    <Select defaultValue="approved">
      <SelectTrigger variant={variant} aria-label="Status">
        <SelectValue />
      </SelectTrigger>
    </Select>,
  );
}

describe("SelectTrigger", () => {
  it("keeps the bordered field look by default", () => {
    const markup = trigger();

    expect(attributesOf(markup, "select-trigger")).toContain('data-variant="default"');
    expect(classesOf(markup, "select-trigger")).toContain("border-input");
  });

  it("draws a badge without the field border for variant badge", () => {
    const classes = classesOf(trigger("badge"), "select-trigger");

    expect(classes).toContain("bg-muted");
    expect(classes).toContain("text-xs");
    expect(classes).not.toContain("border-input");
    expect(classes).not.toContain("min-w-36");
  });

  it("draws no border or fill at rest for variant ghost", () => {
    const classes = classesOf(trigger("ghost"), "select-trigger");

    expect(classes).not.toContain("border-input");
    expect(classes).not.toContain("bg-card");
    expect(classes).toContain("hover:bg-muted");
  });
});

describe("MultiSelectPopover", () => {
  const render = (size?: "sm" | "default") =>
    renderToStaticMarkup(
      <MultiSelectPopover
        placeholder="Department"
        options={[{ value: "creative", label: "Creative" }]}
        selectedValues={[]}
        onChange={() => {}}
        size={size}
      />,
    );

  it("matches form and toolbar controls unless asked", () => {
    expect(render()).toContain('data-size="default"');
  });

  it("takes the compact height with size sm", () => {
    expect(render("sm")).toContain('data-size="sm"');
  });
});

describe("FieldLabel", () => {
  it("marks a required field without announcing the asterisk", () => {
    const markup = renderToStaticMarkup(<FieldLabel required>Work email</FieldLabel>);

    expect(attributesOf(markup, "field-required")).toContain('aria-hidden="true"');
  });

  it("adds no marker by default", () => {
    expect(renderToStaticMarkup(<FieldLabel>Work email</FieldLabel>)).not.toContain(
      "field-required",
    );
  });
});

describe("Switch", () => {
  it("exposes its size and role", () => {
    const markup = renderToStaticMarkup(<Switch size="sm" aria-label="Slack updates" />);

    expect(attributesOf(markup, "switch")).toContain('data-size="sm"');
    expect(attributesOf(markup, "switch")).toContain('role="switch"');
  });
});

describe("RadioGroup", () => {
  it("renders radios inside a radiogroup", () => {
    const markup = renderToStaticMarkup(
      <RadioGroup defaultValue="increase" aria-label="Request type">
        <RadioGroupItem value="increase" aria-label="Increase" />
        <RadioGroupItem value="promotion" aria-label="Promotion" />
      </RadioGroup>,
    );

    expect(attributesOf(markup, "radio-group")).toContain('role="radiogroup"');
    expect(markup.match(/role="radio"/g)).toHaveLength(2);
    expect(markup).toContain('aria-checked="true"');
  });
});
