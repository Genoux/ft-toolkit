import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  Combobox,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxLimitedValue,
  ComboboxList,
  ComboboxSelectTrigger,
  ComboboxValue,
  useComboboxAnchor,
} from "../../src/components/combobox";
import { FieldError } from "../../src/components/field";
import { POOL_CLIENTS } from "../lib/app-fixtures";
import { CONTROL_STATES, SIMULATED_STATE_CLASS } from "../lib/control-states";
import { CONTENT_FORMATS, PLATFORMS } from "../lib/form-fixtures";
import { VariantGrid } from "../lib/variant-grid";
import { CLIENT_PROJECTS } from "../screens/pool/fixtures";

function FormatList() {
  return (
    <>
      <ComboboxEmpty>No formats match.</ComboboxEmpty>
      <ComboboxList>
        {(format: string) => (
          <ComboboxItem key={format} value={format}>
            {format}
          </ComboboxItem>
        )}
      </ComboboxList>
    </>
  );
}

function SingleCombobox({
  state = "default",
  size = "default",
  defaultValue,
  defaultOpen,
}: {
  state?: (typeof CONTROL_STATES)[number];
  size?: "sm" | "default";
  defaultValue?: string;
  defaultOpen?: boolean;
}) {
  return (
    <div className="flex w-64 flex-col gap-1.5">
      <Combobox items={CONTENT_FORMATS} defaultValue={defaultValue} defaultOpen={defaultOpen}>
        <ComboboxInput
          size={size}
          aria-label={`${state} ${size} format`}
          placeholder="Select format"
          showClear
          disabled={state === "disabled"}
          aria-invalid={state === "invalid" || undefined}
          className={
            state === "hover"
              ? SIMULATED_STATE_CLASS.hover
              : state === "focus-visible"
                ? SIMULATED_STATE_CLASS.focus
                : undefined
          }
        />
        <ComboboxContent>
          <FormatList />
        </ComboboxContent>
      </Combobox>
      {state === "invalid" && <FieldError>Select at least one content format.</FieldError>}
    </div>
  );
}

function MultipleCombobox({ initialValues }: { initialValues: string[] }) {
  const [values, setValues] = useState(initialValues);
  const anchor = useComboboxAnchor();
  return (
    <div className="w-80">
      <Combobox
        items={PLATFORMS}
        multiple
        value={values}
        onValueChange={(value) => setValues(value as string[])}
      >
        <ComboboxChips ref={anchor}>
          <ComboboxLimitedValue values={values} />
          <ComboboxChipsInput
            aria-label="Platforms"
            placeholder={values.length ? "" : "Platforms"}
          />
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>No platforms match.</ComboboxEmpty>
          <ComboboxList>
            {(platform: string) => (
              <ComboboxItem key={platform} value={platform}>
                {platform}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

const meta = {
  title: "Molecules/Combobox",
  component: Combobox,
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStates: Story = {
  render: () => (
    <VariantGrid
      rows={CONTROL_STATES}
      columns={["empty", "filled"] as const}
      renderCell={(state, column) => (
        <SingleCombobox state={state} defaultValue={column === "filled" ? "Unboxing" : undefined} />
      )}
    />
  ),
};

export const Single: Story = { render: () => <SingleCombobox /> };

/** Pool's Add to campaign: the client picker, searchable inside the popup. */
export const Open: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex h-96 justify-center pt-4">
      <div className="w-64">
        <Combobox items={POOL_CLIENTS} defaultOpen defaultValue="Glossier">
          <ComboboxSelectTrigger>
            <ComboboxValue placeholder="Select a client" />
          </ComboboxSelectTrigger>
          <ComboboxContent>
            <ComboboxInput showTrigger={false} placeholder="Search clients..." />
            <ComboboxEmpty>No clients found.</ComboboxEmpty>
            <ComboboxList>
              {(client: string) => (
                <ComboboxItem key={client} value={client}>
                  {client}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    </div>
  ),
};

const ALREADY_IN = "Holiday gifting UGC";

/** Pool's Add to campaign: the campaign picker, where a campaign the creator is on is disabled. */
export const WithDisabledItem: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex h-96 justify-center pt-4">
      <div className="w-72">
        <Combobox items={CLIENT_PROJECTS.map((project) => project.name)} defaultOpen>
          <ComboboxSelectTrigger>
            <ComboboxValue placeholder="Select a campaign" />
          </ComboboxSelectTrigger>
          <ComboboxContent>
            <ComboboxInput showTrigger={false} placeholder="Search campaigns..." />
            <ComboboxEmpty>No campaigns found.</ComboboxEmpty>
            <ComboboxList>
              {(campaign: string) => (
                <ComboboxItem key={campaign} value={campaign} disabled={campaign === ALREADY_IN}>
                  {campaign}
                  {campaign === ALREADY_IN ? (
                    <span className="text-muted-foreground">(Already in)</span>
                  ) : null}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    </div>
  ),
};

export const Multiple: Story = {
  render: () => <MultipleCombobox initialValues={["TikTok", "Instagram"]} />,
};

export const MultipleOverflow: Story = {
  render: () => <MultipleCombobox initialValues={PLATFORMS.slice(0, 5)} />,
};

export const Sizes: Story = {
  render: () => (
    <VariantGrid
      rows={["sm", "default"] as const}
      columns={["placeholder", "filled"] as const}
      renderCell={(size, column) => (
        <SingleCombobox size={size} defaultValue={column === "filled" ? "Unboxing" : undefined} />
      )}
    />
  ),
};
