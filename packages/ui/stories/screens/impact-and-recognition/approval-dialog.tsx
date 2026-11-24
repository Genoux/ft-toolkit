import { useState } from "react";
import { Button } from "../../../src/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../src/components/dialog";
import { Field, FieldDescription, FieldLabel } from "../../../src/components/field";
import { Textarea } from "../../../src/components/textarea";
import type { IrRequest } from "./fixtures";

/** I&R, features/requests/components/approval-dialog.tsx: Finance confirms one request or a batch.
 * No per-request figures: the decision was made in the queue, and Finance settles the money. */
export function ApprovalDialog({
  requests,
  open,
  onOpenChange,
  exception = false,
}: {
  requests: IrRequest[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exception?: boolean;
}) {
  const [reason, setReason] = useState("");
  const subject = requests.length === 1 ? requests[0]?.person.name : `${requests.length} requests`;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve {subject}</DialogTitle>
          <DialogDescription>Each request is checked again when you confirm.</DialogDescription>
        </DialogHeader>
        {exception ? (
          <Field>
            <FieldLabel htmlFor="exception-reason">Why approve over budget</FieldLabel>
            <Textarea
              id="exception-reason"
              rows={3}
              required
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
            <FieldDescription>Saved with the approval as a documented exception.</FieldDescription>
          </Field>
        ) : null}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button disabled={exception && !reason.trim()}>
            {exception ? "Approve as exception" : "Approve"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
