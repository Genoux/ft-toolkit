"use client";

import type { ReactNode } from "react";
import { useId, useState } from "react";
import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Field } from "./field";
import { Input } from "./input";
import { Label } from "./label";

interface DestructiveActionDialogBaseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  onConfirm: () => void;
  isPending?: boolean;
  cancelLabel?: string;
  confirmLabel?: string;
  pendingLabel?: string;
  /** Fields the action needs, such as a required reason, between the description and the buttons. */
  children?: ReactNode;
  confirmDisabled?: boolean;
}

export type DestructiveActionDialogProps =
  | (DestructiveActionDialogBaseProps & {
      variant?: "simple";
      resourceName?: never;
    })
  | (DestructiveActionDialogBaseProps & {
      variant: "typed";
      resourceName: string;
    });

/**
 * The confirm button does not close the dialog: the caller closes it through `onOpenChange`
 * once the action succeeds, so a pending or failed action keeps it open.
 */
export function DestructiveActionDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  isPending = false,
  cancelLabel = "Cancel",
  confirmLabel = "Delete",
  pendingLabel = "Deleting...",
  children,
  confirmDisabled = false,
  variant = "simple",
  resourceName,
}: DestructiveActionDialogProps) {
  const typedInputId = useId();
  const [typed, setTyped] = useState("");
  const requiredPhrase = variant === "typed" ? `DELETE ${resourceName}` : "";
  const canConfirm =
    !isPending && !confirmDisabled && (variant === "simple" || typed === requiredPhrase);

  function handleOpenChange(next: boolean) {
    if (!next && isPending) return;
    if (!next) setTyped("");
    onOpenChange(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {/* Same semantics as AlertDialog: a click outside never dismisses a destructive step. */}
      <DialogContent role="alertdialog" onInteractOutside={(event) => event.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        {variant === "typed" ? (
          <Field>
            <Label htmlFor={typedInputId} className="text-muted-foreground">
              Type{" "}
              <span className="font-mono font-semibold tracking-wide text-foreground">
                {requiredPhrase}
              </span>{" "}
              to confirm
            </Label>
            <Input
              id={typedInputId}
              autoCapitalize="off"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={requiredPhrase}
              autoComplete="off"
              spellCheck={false}
              className="text-foreground"
              onPointerDown={(e) => e.stopPropagation()}
            />
          </Field>
        ) : null}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              {cancelLabel}
            </Button>
          </DialogClose>
          <Button disabled={!canConfirm} onClick={onConfirm}>
            {isPending ? pendingLabel : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
