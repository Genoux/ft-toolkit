import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link2, Search } from "lucide-react";
import { useState } from "react";
import { FieldError } from "../../src/components/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "../../src/components/input-group";
import { Spinner } from "../../src/components/spinner";
import { CONTROL_STATES, SIMULATED_STATE_CLASS, stateProps } from "../lib/control-states";
import { VariantGrid } from "../lib/variant-grid";

const COLUMNS = ["icon", "prefix and suffix"] as const;

const INVALID_MESSAGE: Record<(typeof COLUMNS)[number], string> = {
  icon: "TikTok URL is invalid.",
  "prefix and suffix": "Enter a pay increase.",
};

const meta = {
  title: "Molecules/InputGroup",
  component: InputGroup,
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const narrow: Story["decorators"] = [
  (Story) => (
    <div className="w-80">
      <Story />
    </div>
  ),
];

function StatefulGroup({
  state,
  column,
}: {
  state: (typeof CONTROL_STATES)[number];
  column: (typeof COLUMNS)[number];
}) {
  const { className, ...controlProps } = stateProps(state);
  const groupClassName =
    state === "hover"
      ? SIMULATED_STATE_CLASS.hover
      : state === "focus-visible"
        ? SIMULATED_STATE_CLASS.focus
        : className;
  return (
    <div className="flex w-64 flex-col gap-1.5">
      <InputGroup className={groupClassName}>
        {column === "icon" && (
          <>
            <InputGroupAddon>
              <Link2 />
            </InputGroupAddon>
            <InputGroupInput
              {...controlProps}
              type="url"
              aria-label={`${state} ${column}`}
              placeholder="https://tiktok.com/@creator"
            />
          </>
        )}
        {column === "prefix and suffix" && (
          <>
            <InputGroupAddon>
              <InputGroupText>CAD</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              {...controlProps}
              aria-label={`${state} ${column}`}
              className="tabular-nums"
              defaultValue="87,360"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupText>per year</InputGroupText>
            </InputGroupAddon>
          </>
        )}
      </InputGroup>
      {state === "invalid" && <FieldError>{INVALID_MESSAGE[column]}</FieldError>}
    </div>
  );
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <VariantGrid
        rows={CONTROL_STATES}
        columns={COLUMNS}
        renderCell={(state, column) => <StatefulGroup state={state} column={column} />}
      />
      <VariantGrid
        rows={["loading"] as const}
        columns={["icon"] as const}
        renderCell={() => (
          <InputGroup className="w-64">
            <InputGroupAddon>
              <Spinner className="text-subtle-foreground" label="Checking handle" />
            </InputGroupAddon>
            <InputGroupInput aria-label="loading" defaultValue="@sofiareyes" />
          </InputGroup>
        )}
      />
    </div>
  ),
};

export const Default: Story = {
  decorators: narrow,
  render: () => (
    <InputGroup>
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupInput aria-label="Search creators" placeholder="Search creators" />
    </InputGroup>
  ),
};

/** I&R's Increase field: the unit as a suffix. */
export const WithText: Story = {
  decorators: narrow,
  render: () => (
    <InputGroup>
      <InputGroupInput
        aria-label="Increase"
        inputMode="decimal"
        defaultValue="8"
        className="tabular-nums"
      />
      <InputGroupAddon align="inline-end">
        <InputGroupText>%</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
};

/** Proof's session instruction: the character count under the text, inside the frame. */
export const WithTextarea: Story = {
  decorators: narrow,
  render: () => {
    const [instruction, setInstruction] = useState("");
    return (
      <InputGroup>
        <InputGroupTextarea
          aria-label="Session instruction"
          placeholder="Add context or an area to focus on"
          maxLength={500}
          value={instruction}
          onChange={(event) => setInstruction(event.target.value)}
        />
        <InputGroupAddon align="block-end" className="justify-end tabular-nums">
          <InputGroupText>{instruction.length} / 500</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <VariantGrid
      rows={["sm", "default"] as const}
      columns={["icon", "prefix and suffix"] as const}
      renderCell={(size, column) => (
        <InputGroup size={size} className="w-64">
          {column === "icon" ? (
            <>
              <InputGroupAddon>
                <Link2 />
              </InputGroupAddon>
              <InputGroupInput
                aria-label={`${size} ${column}`}
                placeholder="https://tiktok.com/@creator"
              />
            </>
          ) : (
            <>
              <InputGroupAddon>
                <InputGroupText>CAD</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput aria-label={`${size} ${column}`} defaultValue="87,360" />
              <InputGroupAddon align="inline-end">
                <InputGroupText>per year</InputGroupText>
              </InputGroupAddon>
            </>
          )}
        </InputGroup>
      )}
    />
  ),
};
