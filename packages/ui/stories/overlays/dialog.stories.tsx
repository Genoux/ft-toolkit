import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../src/components/button";
import {
  Dialog,
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
import { Textarea } from "../../src/components/textarea";

function DialogDemo({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <Dialog defaultOpen={defaultOpen}>
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription>Supporting description.</DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="dialog-name">Name</FieldLabel>
            <Input id="dialog-name" placeholder="Placeholder" />
          </Field>
          <Field>
            <FieldLabel htmlFor="dialog-note">Note</FieldLabel>
            <Textarea id="dialog-note" aria-describedby="dialog-note-hint" />
            <FieldDescription id="dialog-note-hint">Supporting description.</FieldDescription>
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const meta = {
  title: "Overlays/Dialog",
  component: Dialog,
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DialogDemo /> };

// The header keeps the fields' left edge on phones, and header, fields and footer share one gap.
export const Mobile: Story = {
  render: () => <DialogDemo defaultOpen />,
  globals: { viewport: { value: "mobile2", isRotated: false } },
};
