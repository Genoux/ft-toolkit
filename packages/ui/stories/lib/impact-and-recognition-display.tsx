import { useState } from "react";
import { Button } from "../../src/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../src/components/dialog";
import { Field, FieldDescription, FieldLabel } from "../../src/components/field";
import { StatusDot } from "../../src/components/status-dot";
import { Textarea } from "../../src/components/textarea";
import {
  HOLDER_COLOR,
  type IrRequest,
  REQUEST_HOLDER,
  type RequestStatus,
  STATUS_LABEL,
} from "./impact-and-recognition-fixtures";

/** The status in words after a mark in the colour of whoever holds the request. */
export function HolderStatus({
  status,
  size,
  className,
}: {
  status: RequestStatus;
  size?: "default" | "lg";
  className?: string;
}) {
  // signature-surface: I&R's holder colours, the same mark on every list, receipt and step.
  return (
    <StatusDot
      color={HOLDER_COLOR[REQUEST_HOLDER[status]]}
      label={STATUS_LABEL[status]}
      size={size}
      className={className}
    />
  );
}

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
