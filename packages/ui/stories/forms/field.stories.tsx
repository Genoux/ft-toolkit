import type { Meta, StoryObj } from "@storybook/react-vite";
import { Search } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../../src/components/field";
import { Input } from "../../src/components/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../../src/components/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../src/components/select";
import { Textarea } from "../../src/components/textarea";
import { OPTIONS } from "../lib/fixtures";

type FieldStoryArgs = { label: string; description: string; error: string };

const meta = {
  title: "Forms/Field",
  component: Field,
  args: { label: "Label", description: "Supporting description.", error: "" },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Field> & { args: FieldStoryArgs };

export default meta;
type Story = StoryObj<FieldStoryArgs>;

export const Default: Story = {
  render: ({ label, description, error }) => (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor="field-input">{label}</FieldLabel>
      <Input id="field-input" aria-invalid={Boolean(error)} />
      {description && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError errors={[{ message: error }]} />}
    </Field>
  ),
};

export const WithError: Story = { ...Default, args: { error: "Error message" } };

// Every control in one form shares one corner radius.
export const Form: Story = {
  render: () => (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="form-name">Name</FieldLabel>
        <Input id="form-name" placeholder="Placeholder" />
      </Field>
      <Field>
        <FieldLabel htmlFor="form-option">Option</FieldLabel>
        <Select>
          <SelectTrigger id="form-option" className="w-full">
            <SelectValue placeholder="Pick one" />
          </SelectTrigger>
          <SelectContent>
            {OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel htmlFor="form-search">Search</FieldLabel>
        <InputGroup>
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput id="form-search" placeholder="Search" />
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="form-note">Note</FieldLabel>
        <Textarea id="form-note" />
      </Field>
    </FieldGroup>
  ),
};
