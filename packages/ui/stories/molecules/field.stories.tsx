import type { Meta, StoryObj } from "@storybook/react-vite";
import { type FormEvent, useState } from "react";
import { Button } from "../../src/components/button";
import { Checkbox } from "../../src/components/checkbox";
import { DatePicker } from "../../src/components/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../src/components/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldRow,
  FieldSet,
  FieldTitle,
} from "../../src/components/field";
import { Input } from "../../src/components/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../../src/components/input-group";
import { MultiSelectPopover } from "../../src/components/multi-select-popover";
import { RadioGroup, RadioGroupItem } from "../../src/components/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../src/components/select";
import { Textarea } from "../../src/components/textarea";
import {
  CYCLE_STEPS,
  DISCLAIMER_PLACEMENTS,
  REQUEST_KINDS,
  TIME_ZONES,
  WINDMILL_RATINGS,
} from "../lib/form-fixtures";
import { POOL_BRAND_INTERESTS, POOL_BRAND_TYPES } from "../lib/overlay-fixtures";

const meta = {
  title: "Molecules/Field",
  component: Field,
  args: { orientation: "vertical" },
  argTypes: {
    orientation: { control: "inline-radio", options: ["vertical", "horizontal", "responsive"] },
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every field state with copy from the apps: Pool's create client, Proof's client settings and rule dialogs, I&R's request form and invite dialog. */
export const AllStates: Story = {
  render: () => (
    <div className="grid w-3xl grid-cols-2 gap-x-10">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="all-name" required>
            Name
          </FieldLabel>
          <Input id="all-name" required placeholder="Acme Corp" />
        </Field>
        <Field>
          <FieldLabel htmlFor="all-client-name">Full client name</FieldLabel>
          <Input id="all-client-name" defaultValue="Oura" />
          <FieldDescription>The client&apos;s full name.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="all-note" optional>
            Note
          </FieldLabel>
          <Input id="all-note" placeholder="Optional note for the Agent" />
        </Field>
        <Field data-invalid>
          <FieldLabel htmlFor="all-code">Client code</FieldLabel>
          <Input
            id="all-code"
            aria-invalid
            aria-describedby="all-code-hint all-code-error"
            defaultValue="OUR"
            maxLength={4}
            className="font-mono uppercase"
          />
          <FieldDescription id="all-code-hint">
            Exactly four letters or digits, unique across clients.
          </FieldDescription>
          <FieldError id="all-code-error">Code must be exactly four letters or digits.</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="all-current-pay">Current pay</FieldLabel>
          <Input
            id="all-current-pay"
            readOnly
            defaultValue="CAD 78,000 per year"
            className="tabular-nums"
          />
          <FieldDescription>People adds the pay from Deel.</FieldDescription>
        </Field>
        <Field data-disabled>
          <FieldLabel htmlFor="all-email">Email</FieldLabel>
          <Input id="all-email" type="email" disabled placeholder="name@inbeat.agency" />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field orientation="horizontal">
          <Checkbox id="all-declared" defaultChecked />
          <FieldContent>
            <FieldLabel htmlFor="all-declared">Windmill reviews are complete</FieldLabel>
            <FieldDescription>
              Self-reflection, peer feedback and manager review, for this round.
            </FieldDescription>
          </FieldContent>
        </Field>
        <Field orientation="horizontal" data-invalid>
          <Checkbox id="all-declared-error" aria-invalid aria-describedby="all-declared-message" />
          <FieldContent>
            <FieldLabel htmlFor="all-declared-error">Windmill reviews are complete</FieldLabel>
            <FieldDescription>
              Self-reflection, peer feedback and manager review, for this round.
            </FieldDescription>
            <FieldError id="all-declared-message">
              Confirm the reviews are complete in Windmill.
            </FieldError>
          </FieldContent>
        </Field>
        <FieldSet>
          <FieldLegend variant="label">Placement</FieldLegend>
          <RadioGroup defaultValue="On screen">
            {DISCLAIMER_PLACEMENTS.map((placement) => (
              <Field key={placement} orientation="horizontal">
                <RadioGroupItem value={placement} id={`all-placement-${placement}`} />
                <FieldLabel htmlFor={`all-placement-${placement}`} className="font-normal">
                  {placement}
                </FieldLabel>
              </Field>
            ))}
          </RadioGroup>
        </FieldSet>
        <FieldSet>
          <FieldLegend variant="label">Request type</FieldLegend>
          <RequestKindCards />
        </FieldSet>
      </FieldGroup>
    </div>
  ),
};

function RequestKindCards({ disabled }: { disabled?: boolean }) {
  return (
    <RadioGroup defaultValue="promotion" className="grid-cols-2" disabled={disabled}>
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
  );
}

/** Pool's campaign dialog: the one required field marked. */
export const Vertical: Story = {
  render: (args) => (
    <Field {...args} className="w-96">
      <FieldLabel htmlFor="vertical-name" required>
        Campaign name
      </FieldLabel>
      <Input id="vertical-name" required placeholder="e.g. Brand X — Summer launch" />
    </Field>
  ),
};

/** A checkbox and a radio beside their labels: the control centres on the label's first line. */
export const Horizontal: Story = {
  render: () => (
    <FieldGroup className="w-md">
      <Field orientation="horizontal">
        <Checkbox id="horizontal-declared" />
        <FieldContent>
          <FieldLabel htmlFor="horizontal-declared">Windmill reviews are complete</FieldLabel>
          <FieldDescription>
            Self-reflection, peer feedback and manager review, for this round.
          </FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal">
        <FieldLabel htmlFor="horizontal-profiles">No. of profiles to source</FieldLabel>
        <Input
          id="horizontal-profiles"
          type="number"
          min={1}
          max={1000}
          defaultValue={40}
          className="w-28 tabular-nums"
        />
      </Field>
    </FieldGroup>
  ),
};

/** I&R's job description link: the hint stays, the error follows it with an icon. */
export const WithError: Story = {
  render: () => (
    <Field data-invalid className="w-md">
      <FieldLabel htmlFor="error-url">Job description</FieldLabel>
      <Input
        id="error-url"
        type="url"
        placeholder="https://"
        aria-invalid
        aria-describedby="error-url-hint error-url-error"
        defaultValue="notion.so/inbeat/senior-creative-strategist"
      />
      <FieldDescription id="error-url-hint">
        A link to the current description of the new role.
      </FieldDescription>
      <FieldError id="error-url-error">Use a full link, starting with https://.</FieldError>
    </Field>
  ),
};

/** Pool's collaboration Rates step: a legend with its description, then two fields in one row. */
export const FieldSetWithLegend: Story = {
  render: () => (
    <FieldSet className="w-lg">
      <FieldLegend>Rates</FieldLegend>
      <FieldDescription>Record what was delivered and paid.</FieldDescription>
      <FieldGroup>
        <FieldRow>
          <Field>
            <FieldLabel htmlFor="rates-pieces">Unique pieces of content</FieldLabel>
            <Input
              id="rates-pieces"
              type="number"
              min={1}
              placeholder="e.g. 3"
              className="tabular-nums"
            />
            <FieldDescription>Not counting hook variations</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="rates-paid">Total paid ($)</FieldLabel>
            <Input
              id="rates-paid"
              type="number"
              min={0}
              step={0.01}
              placeholder="e.g. 900"
              className="tabular-nums"
            />
          </Field>
        </FieldRow>
      </FieldGroup>
    </FieldSet>
  ),
};

/** I&R's promotion request: choice cards, then two-column rows that share the cards' columns. */
export const PromotionRequest: Story = {
  render: () => (
    <div className="w-2xl rounded-xl border border-border bg-card p-8">
      <FieldGroup>
        <FieldSet>
          <FieldLegend variant="label">Request type</FieldLegend>
          <RequestKindCards />
        </FieldSet>
        <FieldRow>
          <Field>
            <FieldLabel htmlFor="promotion-level">New level</FieldLabel>
            <Select defaultValue="L4">
              <SelectTrigger id="promotion-level" className="w-full">
                <SelectValue placeholder="Choose a level" />
              </SelectTrigger>
              <SelectContent>
                {["L4", "L5"].map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field data-invalid>
            <FieldLabel htmlFor="promotion-title">New title</FieldLabel>
            <Input id="promotion-title" aria-invalid aria-describedby="promotion-title-error" />
            <FieldError id="promotion-title-error">Add the new title.</FieldError>
          </Field>
        </FieldRow>
        <Field>
          <FieldLabel htmlFor="promotion-rating">Windmill rating</FieldLabel>
          <Select defaultValue={WINDMILL_RATINGS[3]}>
            <SelectTrigger id="promotion-rating" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WINDMILL_RATINGS.map((rating) => (
                <SelectItem key={rating} value={rating}>
                  {rating}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldDescription>
            Entered by you from Windmill; People verifies it there.
          </FieldDescription>
        </Field>
        <div className="flex flex-col gap-(--gap-sm)">
          <FieldRow>
            <Field>
              <FieldLabel htmlFor="promotion-increase">Increase</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="promotion-increase"
                  inputMode="decimal"
                  defaultValue="12"
                  className="tabular-nums"
                  aria-describedby="promotion-pay-hint"
                />
                <InputGroupAddon align="inline-end">%</InputGroupAddon>
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="promotion-proposed">Proposed pay</FieldLabel>
              <InputGroup>
                <InputGroupAddon>CAD</InputGroupAddon>
                <InputGroupInput
                  id="promotion-proposed"
                  inputMode="decimal"
                  defaultValue="87,360"
                  className="tabular-nums"
                  aria-describedby="promotion-pay-hint"
                />
                <InputGroupAddon align="inline-end">per year</InputGroupAddon>
              </InputGroup>
            </Field>
          </FieldRow>
          <FieldDescription id="promotion-pay-hint">
            Guidance is up to 15% for a promotion in the first tercile. Edit either field; the other
            follows.
          </FieldDescription>
        </div>
        <Field>
          <FieldLabel htmlFor="promotion-justification">Why this promotion?</FieldLabel>
          <Textarea
            id="promotion-justification"
            className="min-h-32"
            aria-describedby="promotion-justification-hint"
          />
          <FieldDescription id="promotion-justification-hint">
            What changed in their work and its impact. Above guidance, say why it is deserved.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </div>
  ),
};

type ClientErrors = Partial<Record<"interests" | "types", string>>;

function CreateClientForm() {
  const [name, setName] = useState("Glossier");
  const [interests, setInterests] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>(["DTC"]);
  const [errors, setErrors] = useState<ClientErrors>({
    interests: "Pick at least one brand interest",
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setErrors({
      interests: interests.length ? undefined : "Pick at least one brand interest",
      types: types.length ? undefined : "Pick at least one brand type",
    });
  };

  return (
    <Dialog open>
      <DialogContent
        size="sm"
        showCloseButton={false}
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Create client</DialogTitle>
          <DialogDescription>
            Clients group project projects. Add a charter name (e.g. from your project charter).
          </DialogDescription>
        </DialogHeader>
        <form id="create-client" onSubmit={submit} noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="client-name">Name</FieldLabel>
              <Input
                id="client-name"
                placeholder="Acme Corp"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="client-description" optional>
                Description
              </FieldLabel>
              <Textarea id="client-description" rows={3} />
            </Field>
            <Field data-invalid={errors.interests ? true : undefined}>
              <FieldLabel htmlFor="client-interests">Brand interests</FieldLabel>
              <MultiSelectPopover
                id="client-interests"
                aria-invalid={errors.interests ? true : undefined}
                aria-describedby="client-interests-error"
                placeholder="Select brand interests"
                options={POOL_BRAND_INTERESTS}
                selectedValues={interests}
                onChange={setInterests}
                triggerClassName="w-full max-w-none"
                contentClassName="w-(--radix-popover-trigger-width) overflow-hidden"
                renderLabel={(selected) => selected.map((option) => option.label).join(", ")}
              />
              <FieldError id="client-interests-error">{errors.interests}</FieldError>
            </Field>
            <Field data-invalid={errors.types ? true : undefined}>
              <FieldLabel htmlFor="client-types">Brand types</FieldLabel>
              <MultiSelectPopover
                id="client-types"
                aria-invalid={errors.types ? true : undefined}
                aria-describedby="client-types-error"
                placeholder="Select brand types"
                options={POOL_BRAND_TYPES}
                selectedValues={types}
                onChange={setTypes}
                triggerClassName="w-full max-w-none"
                contentClassName="w-(--radix-popover-trigger-width) overflow-hidden"
                renderLabel={(selected) => selected.map((option) => option.label).join(", ")}
              />
              <FieldError id="client-types-error">{errors.types}</FieldError>
            </Field>
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button type="submit" form="create-client" disabled={!name.trim()}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Pool's Create client dialog after a Create with no brand interest: the message sits under its field. */
export const Form: Story = {
  parameters: { layout: "fullscreen" },
  render: () => <CreateClientForm />,
};

const firstOutOfOrder = "edit_by";

/** I&R's New cycle dialog: the time zone, then six dates two per row; a date before the step above it says so under its own field. */
export const TwoColumnRows: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <Dialog open>
      <DialogContent
        size="lg"
        showCloseButton={false}
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>New cycle</DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="cycle-name">Name</FieldLabel>
            <Input id="cycle-name" defaultValue="H1 2027 cycle" maxLength={60} required />
          </Field>
          <Field>
            <FieldLabel htmlFor="cycle-zone">Time zone</FieldLabel>
            <Select defaultValue={TIME_ZONES[0]?.value}>
              <SelectTrigger id="cycle-zone" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_ZONES.map((zone) => (
                  <SelectItem key={zone.value} value={zone.value}>
                    {zone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <FieldRow>
            {CYCLE_STEPS.map((step) => {
              const invalid = step.key === firstOutOfOrder;
              return (
                <Field key={step.key} data-invalid={invalid ? true : undefined}>
                  <FieldLabel htmlFor={`cycle-${step.key}`}>{step.label}</FieldLabel>
                  <div className="grid grid-cols-[minmax(0,1fr)_7.5rem] gap-2">
                    <DatePicker
                      id={`cycle-${step.key}`}
                      value={invalid ? "2027-04-28" : step.date}
                      onChange={() => undefined}
                      aria-invalid={invalid ? true : undefined}
                      aria-describedby={invalid ? `cycle-${step.key}-error` : undefined}
                    />
                    {"time" in step ? (
                      <Select defaultValue={step.time}>
                        <SelectTrigger
                          aria-label={`${step.label} time`}
                          aria-invalid={invalid ? true : undefined}
                          className="w-full min-w-0"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["09:00", "17:00"].map((time) => (
                            <SelectItem key={time} value={time}>
                              {time === "09:00" ? "9:00 AM" : "5:00 PM"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : null}
                  </div>
                  {invalid ? (
                    <FieldError id={`cycle-${step.key}-error`}>
                      Must come after requests close
                    </FieldError>
                  ) : null}
                </Field>
              );
            })}
          </FieldRow>
        </FieldGroup>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button disabled>Create cycle</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
