import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "../../src/components/field";
import { RadioGroup, RadioGroupItem } from "../../src/components/radio-group";
import { CONTROL_STATES, stateProps } from "../lib/control-states";
import { COLLABORATION_RATINGS, DISCLAIMER_PLACEMENTS, REQUEST_KINDS } from "../lib/form-fixtures";
import { VariantGrid } from "../lib/variant-grid";

const meta = {
  title: "Atoms/RadioGroup",
  component: RadioGroup,
  args: { defaultValue: "On screen", disabled: false },
  render: (args) => (
    <RadioGroup {...args} aria-label="Placement" className="w-64">
      {DISCLAIMER_PLACEMENTS.map((placement) => (
        <Field key={placement} orientation="horizontal">
          <RadioGroupItem value={placement} id={`placement-${placement}`} />
          <FieldLabel htmlFor={`placement-${placement}`} className="font-normal">
            {placement}
          </FieldLabel>
        </Field>
      ))}
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStates: Story = {
  render: () => (
    <VariantGrid
      rows={CONTROL_STATES}
      columns={["unselected", "selected"] as const}
      renderCell={(state, column) => {
        const { className, disabled, ...itemProps } = stateProps(state);
        return (
          <RadioGroup
            aria-label={`${state} ${column}`}
            defaultValue={column === "selected" ? "on" : undefined}
            disabled={disabled}
          >
            <RadioGroupItem value="on" className={className} {...itemProps} />
          </RadioGroup>
        );
      }}
    />
  ),
};

export const Default: Story = {};

export const WithDescriptions: Story = {
  render: () => (
    <FieldSet className="w-80">
      <FieldLegend variant="label">Add custom rule</FieldLegend>
      <RadioGroup defaultValue="text">
        {[
          { value: "text", title: "Text", hint: "Write a short rule in plain text" },
          {
            value: "url",
            title: "Public URL",
            hint: "Link to an external custom rule source",
            disabled: true,
          },
          { value: "document", title: "Document", hint: "Upload PDF" },
        ].map((option) => (
          <Field key={option.value} orientation="horizontal" data-disabled={option.disabled}>
            <RadioGroupItem
              value={option.value}
              id={`rights-${option.value}`}
              disabled={option.disabled}
            />
            <FieldContent>
              <FieldLabel htmlFor={`rights-${option.value}`}>{option.title}</FieldLabel>
              <FieldDescription>{option.hint}</FieldDescription>
            </FieldContent>
          </Field>
        ))}
      </RadioGroup>
    </FieldSet>
  ),
};

export const ChoiceCards: Story = {
  render: () => (
    <FieldSet className="w-md">
      <FieldLegend variant="label">Request type</FieldLegend>
      <RadioGroup defaultValue="increase" className="grid-cols-2">
        {REQUEST_KINDS.map((kind) => (
          <FieldLabel key={kind.value} htmlFor={`kind-${kind.value}`}>
            <Field orientation="horizontal">
              <RadioGroupItem value={kind.value} id={`kind-${kind.value}`} />
              <FieldContent>
                <FieldTitle>{kind.label}</FieldTitle>
                <FieldDescription>{kind.hint}</FieldDescription>
              </FieldContent>
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
    </FieldSet>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="On screen" aria-label="Placement" className="flex gap-5">
      {DISCLAIMER_PLACEMENTS.map((placement) => (
        <Field key={placement} orientation="horizontal" className="w-auto">
          <RadioGroupItem value={placement} id={`inline-${placement}`} />
          <FieldLabel htmlFor={`inline-${placement}`} className="font-normal">
            {placement}
          </FieldLabel>
        </Field>
      ))}
    </RadioGroup>
  ),
};

export const Invalid: Story = {
  render: () => (
    <FieldSet className="w-72" data-invalid>
      <FieldLegend variant="label">Visual Quality</FieldLegend>
      <RadioGroup aria-invalid aria-describedby="deliverable-error">
        {COLLABORATION_RATINGS.map((deliverable) => (
          <Field key={deliverable} orientation="horizontal">
            <RadioGroupItem value={deliverable} id={`deliverable-${deliverable}`} aria-invalid />
            <FieldLabel htmlFor={`deliverable-${deliverable}`} className="font-normal capitalize">
              {deliverable}
            </FieldLabel>
          </Field>
        ))}
      </RadioGroup>
      <FieldError id="deliverable-error">Rate the visual quality.</FieldError>
    </FieldSet>
  ),
};
