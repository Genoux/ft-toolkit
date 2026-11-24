import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps, useState } from "react";
import { Badge } from "../../src/components/badge";
import { Button } from "../../src/components/button";
import { Checkbox } from "../../src/components/checkbox";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../src/components/dialog";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../../src/components/field";
import { Input } from "../../src/components/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemControl,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "../../src/components/item";
import { MultiSelectPopover } from "../../src/components/multi-select-popover";
import { PersonAvatar } from "../../src/components/person-identity";
import { SearchInput } from "../../src/components/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../src/components/select";
import { Textarea } from "../../src/components/textarea";
import { IR_ROLES, POOL_BRAND_INTERESTS, POOL_BRAND_TYPES } from "../lib/overlay-fixtures";
import { ApprovalDialog } from "../screens/impact-and-recognition/approval-dialog";
import { FINANCE_QUEUE } from "../screens/impact-and-recognition/fixtures";
import { CREATORS, photoUrl } from "../screens/pool/fixtures";

type DialogSize = NonNullable<ComponentProps<typeof DialogContent>["size"]>;

/** Pool, features/clients/components/create-client-dialog.tsx. */
function CreateClientDialog({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [interests, setInterests] = useState(["Beauty", "Personal Care"]);
  const [types, setTypes] = useState(["DTC"]);
  return (
    <Dialog defaultOpen={defaultOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add client</Button>
      </DialogTrigger>
      <DialogContent dismissible={false}>
        <DialogHeader>
          <DialogTitle>Create client</DialogTitle>
          <DialogDescription>
            Clients group project projects. Add a charter name (e.g. from your project charter).
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="client-name">Name</FieldLabel>
            <Input id="client-name" placeholder="Acme Corp" defaultValue="Lumen Skincare" />
          </Field>
          <Field>
            <FieldLabel htmlFor="client-description">Description (optional)</FieldLabel>
            <Textarea
              id="client-description"
              rows={3}
              defaultValue="Clean skincare, DTC and retail."
            />
          </Field>
          <Field>
            <FieldLabel>Brand interests</FieldLabel>
            <MultiSelectPopover
              placeholder="Select brand interests"
              options={POOL_BRAND_INTERESTS}
              selectedValues={interests}
              onChange={setInterests}
              renderLabel={(selected) => selected.map((option) => option.label).join(", ")}
              triggerClassName="w-full max-w-none"
              contentClassName="w-(--radix-popover-trigger-width) overflow-hidden"
            />
          </Field>
          <Field>
            <FieldLabel>Brand types</FieldLabel>
            <MultiSelectPopover
              placeholder="Select brand types"
              options={POOL_BRAND_TYPES}
              selectedValues={types}
              onChange={setTypes}
              renderLabel={(selected) => selected.map((option) => option.label).join(", ")}
              triggerClassName="w-full max-w-none"
              contentClassName="w-(--radix-popover-trigger-width) overflow-hidden"
            />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** I&R, features/access/components/invite-dialog.tsx. */
function InviteDialog({
  defaultOpen = false,
  size,
  trigger = "Invite",
}: {
  defaultOpen?: boolean;
  size?: DialogSize;
  trigger?: string;
}) {
  return (
    <Dialog defaultOpen={defaultOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{trigger}</Button>
      </DialogTrigger>
      <DialogContent size={size} dismissible={false}>
        <DialogHeader>
          <DialogTitle>Invite</DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={`invite-email-${size}`}>Email</FieldLabel>
            <Input id={`invite-email-${size}`} type="email" placeholder="name@inbeat.agency" />
          </Field>
          <Field>
            <FieldLabel htmlFor={`invite-role-${size}`}>Role</FieldLabel>
            <Select>
              <SelectTrigger id={`invite-role-${size}`} className="w-full">
                <SelectValue placeholder="Choose a role" />
              </SelectTrigger>
              <SelectContent>
                {IR_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Invite</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Finance's batch in I&R's design gallery: Aisha, Ava and Marta. */
const APPROVAL_BATCH = FINANCE_QUEUE.map((row) => row.request).filter((request) =>
  ["Aisha Grant", "Ava Lindqvist", "Marta Ruiz"].includes(request.person.name),
);

function ApproveBatchDialog() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Approve selected</Button>
      <ApprovalDialog requests={APPROVAL_BATCH} open={open} onOpenChange={setOpen} />
    </>
  );
}

const ON_CAMPAIGN = new Set(["c-03", "c-07"]);

type PoolCreator = (typeof CREATORS)[number];

/** One creator in the picker: a label row, so a click anywhere on it toggles the checkbox. A
 * creator already on the campaign is a disabled row with a disabled checkbox. */
function CreatorOption({
  creator,
  checked,
  onCheckedChange,
}: {
  creator: PoolCreator;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  const onCampaign = ON_CAMPAIGN.has(creator.id);
  const checkboxId = `pick-${creator.id}`;
  return (
    <Item asChild selected={checked} disabled={onCampaign}>
      <label htmlFor={checkboxId}>
        <ItemControl>
          <Checkbox
            id={checkboxId}
            checked={checked}
            disabled={onCampaign}
            onCheckedChange={(next) => onCheckedChange(next === true)}
            aria-label={onCampaign ? `${creator.fullName}, on campaign` : undefined}
          />
        </ItemControl>
        <ItemMedia>
          <PersonAvatar
            name={creator.fullName}
            imageUrl={photoUrl(creator.photoSeed, 80)}
            size="md"
            decorative
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{creator.fullName}</ItemTitle>
          <ItemDescription>{creator.country}</ItemDescription>
        </ItemContent>
        {onCampaign ? (
          <ItemActions>
            <Badge variant="secondary">On campaign</Badge>
          </ItemActions>
        ) : null}
      </label>
    </Item>
  );
}

/** Pool, shared/components/blocks/creator-picker-dialog.tsx as "Invite from Pool". */
function InviteFromPoolDialog({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(["c-01", "c-04"]);
  const visible = CREATORS.filter((creator) =>
    creator.fullName.toLowerCase().includes(query.trim().toLowerCase()),
  );
  return (
    <Dialog defaultOpen={defaultOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Invite from Pool</Button>
      </DialogTrigger>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Invite from Pool</DialogTitle>
          <DialogDescription>
            Quick add joined creators. Use the database for advanced search and filters.
          </DialogDescription>
        </DialogHeader>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search by name…"
          className="w-full"
        />
        <DialogBody frame>
          <ItemGroup frame={false} role="group" aria-label="Creators">
            {visible.map((creator) => (
              <CreatorOption
                key={creator.id}
                creator={creator}
                checked={selected.includes(creator.id)}
                onCheckedChange={(checked) =>
                  setSelected((current) =>
                    checked ? [...current, creator.id] : current.filter((id) => id !== creator.id),
                  )
                }
              />
            ))}
          </ItemGroup>
        </DialogBody>
        <DialogFooter className="sm:items-center">
          <span className="text-sm text-muted-foreground tabular-nums sm:mr-auto">
            {selected.length} selected
          </span>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button disabled={selected.length === 0}>Attach to campaign</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const meta = {
  title: "Organisms/Dialog",
  component: Dialog,
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStates: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pool's Create client dialog at the default `md` size: title, muted description, fields, and actions on the right. The close button reserves room in the header. It holds a form, so `dismissible={false}` keeps a backdrop click from discarding it; Esc and the close button still close it.",
      },
    },
  },
  render: () => <CreateClientDialog defaultOpen />,
};

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: "I&R's Invite dialog at `sm`, `md` and `lg`." } },
  },
  render: () => (
    <div className="flex gap-2">
      {(["sm", "md", "lg"] as const).map((size) => (
        <InviteDialog key={size} size={size} trigger={`Invite (${size})`} />
      ))}
    </div>
  ),
};

export const Confirmation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "I&R Finance approving three requests: a title, one line of description, Cancel and Approve. Nothing to fill in, so a backdrop click closes it.",
      },
    },
  },
  render: () => <ApproveBatchDialog />,
};

export const LongContent: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pool's Invite from Pool picker: an unframed ItemGroup of label rows (checkbox, photo, name, country; On campaign rows are `disabled`: muted, no hover, checkbox off), selected rows tinted. DialogBody scrolls the list while the header, search and footer stay put; the panel never grows past the viewport.",
      },
    },
  },
  render: () => <InviteFromPoolDialog defaultOpen />,
};

export const WithoutCloseButton: Story = {
  parameters: {
    docs: { description: { story: "Proof's Rename language dialog, without the close button." } },
  },
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant="outline">Rename</Button>
      </DialogTrigger>
      <DialogContent size="sm" showCloseButton={false} dismissible={false}>
        <DialogHeader>
          <DialogTitle>Rename language</DialogTitle>
        </DialogHeader>
        <Field>
          <FieldLabel htmlFor="rename-language">Language</FieldLabel>
          <Input id="rename-language" defaultValue="French (Canada)" />
        </Field>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WithHelperText: Story = {
  parameters: {
    docs: { description: { story: "Proof's Rename session dialog, with the character count." } },
  },
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant="outline">Rename</Button>
      </DialogTrigger>
      <DialogContent size="sm" dismissible={false}>
        <DialogHeader>
          <DialogTitle>Rename session</DialogTitle>
          <DialogDescription>Make changes to this session name.</DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel htmlFor="rename-session">Name</FieldLabel>
          <Input
            id="rename-session"
            maxLength={50}
            defaultValue="Holiday UGC round 2"
            aria-describedby="rename-session-count"
          />
          <FieldDescription id="rename-session-count">19 / 50 characters</FieldDescription>
        </Field>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Mobile: Story = {
  render: () => <CreateClientDialog defaultOpen />,
  globals: { viewport: { value: "mobile2", isRotated: false } },
};
