"use client";

import { XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Dialog as DialogPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "../lib/utils";
import {
  dialogWidthClassName,
  overlayClassName,
  overlayPanelClassName,
  useOverlayMotion,
} from "../internal/overlay-motion";
import { PortalContainerProvider } from "./portal-container";

const DialogOpenContext = React.createContext(false);

function Dialog({
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false);
  const isOpen = controlledOpen ?? uncontrolledOpen;

  const handleOpenChange = (next: boolean) => {
    setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  return (
    <DialogOpenContext.Provider value={isOpen}>
      <DialogPrimitive.Root
        data-slot="dialog"
        open={isOpen}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </DialogOpenContext.Provider>
  );
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function focusPanelOnTouch(event: Event) {
  if (!window.matchMedia("(pointer: coarse)").matches) return;
  event.preventDefault();
  (event.currentTarget as HTMLElement | null)?.focus();
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  size = "md",
  dismissible = true,
  onOpenAutoFocus,
  onPointerDownOutside,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
  size?: keyof typeof dialogWidthClassName;
  /** `false` keeps the dialog open on a click outside it; Escape and the close button still close it. Pass it when the dialog holds input the user would lose. */
  dismissible?: boolean;
}) {
  const isOpen = React.useContext(DialogOpenContext);
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null);
  const motionProps = useOverlayMotion();

  return (
    <DialogPortal data-slot="dialog-portal" forceMount>
      <AnimatePresence>
        {isOpen && (
          <DialogPrimitive.Overlay data-slot="dialog-overlay" asChild forceMount>
            <motion.div {...motionProps.overlay} className={overlayClassName} />
          </DialogPrimitive.Overlay>
        )}
      </AnimatePresence>

      {/* Center with flex: a transform on the portal host breaks Select/Popover positioning. */}
      <AnimatePresence>
        {isOpen && (
          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
            <DialogPrimitive.Content
              data-slot="dialog-content"
              forceMount
              asChild
              onOpenAutoFocus={(event) => {
                onOpenAutoFocus?.(event);
                if (!event.defaultPrevented) focusPanelOnTouch(event);
              }}
              onPointerDownOutside={(event) => {
                onPointerDownOutside?.(event);
                if (!dismissible) event.preventDefault();
              }}
              {...props}
            >
              <motion.div
                {...motionProps.panel}
                data-size={size}
                data-close-button={showCloseButton}
                className={cn(
                  overlayPanelClassName,
                  "group/dialog pointer-events-auto relative flex max-h-full w-full flex-col overflow-hidden rounded-2xl p-7 outline-none",
                  dialogWidthClassName[size],
                  className,
                )}
              >
                {/* Inside the content node so the modal scroll lock lets nested lists scroll; fixed
                    children escape the panel's overflow once the entrance transform settles to none. */}
                <div
                  ref={setPortalContainer}
                  className="pointer-events-none fixed inset-0 z-60 *:pointer-events-auto"
                />
                <PortalContainerProvider container={portalContainer}>
                  <div
                    data-slot="dialog-body"
                    className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-6 *:data-[slot=field-group]:gap-6"
                  >
                    {children}
                  </div>
                  {showCloseButton && (
                    <DialogPrimitive.Close
                      data-slot="dialog-close"
                      className="absolute top-6 right-6 z-10 flex size-8 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors duration-(--duration-fast) ease-out-expo hover:bg-muted hover:text-foreground focus-visible:focus-ring disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                    >
                      <XIcon />
                      <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>
                  )}
                </PortalContainerProvider>
              </motion.div>
            </DialogPrimitive.Content>
          </div>
        )}
      </AnimatePresence>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "flex flex-col gap-1.5 text-left group-data-[close-button=true]/dialog:pe-8",
        className,
      )}
      {...props}
    />
  );
}

type DialogBodyProps = React.ComponentProps<"div"> & {
  /** Scrolls the content inside a bordered box lined up with the fields around it: for a list that
   * scrolls under a search, where the box is the edge the rows pass behind. */
  frame?: boolean;
};

/** The part of a tall dialog that scrolls while its header and footer stay put. */
function DialogBody({ frame = false, className, ...props }: DialogBodyProps) {
  return (
    <div
      data-slot="dialog-scroll-body"
      data-frame={frame || undefined}
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain *:shrink-0",
        frame
          ? "gap-1 rounded-xl border border-border p-1"
          : "-mx-7 -my-1 gap-5 px-7 py-1",
        className,
      )}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-base font-semibold", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-pretty text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
