"use client"

import * as React from "react"
import { AlertDialog as AlertDialogPrimitive } from "radix-ui"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "../lib/utils"
import { Button } from "./button"
import {
  dialogWidthClassName,
  overlayClassName,
  overlayPanelClassName,
  useOverlayMotion,
} from "../internal/overlay-motion"

const AlertDialogOpenContext = React.createContext(false)

function AlertDialog({
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(
    defaultOpen ?? false
  )
  const isOpen = controlledOpen ?? uncontrolledOpen

  const handleOpenChange = (next: boolean) => {
    setUncontrolledOpen(next)
    onOpenChange?.(next)
  }

  return (
    <AlertDialogOpenContext.Provider value={isOpen}>
      <AlertDialogPrimitive.Root
        data-slot="alert-dialog"
        open={isOpen}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </AlertDialogOpenContext.Provider>
  )
}

function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  )
}

function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  )
}

function AlertDialogContent({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
  size?: "default" | "sm"
}) {
  const isOpen = React.useContext(AlertDialogOpenContext)
  const motionProps = useOverlayMotion()

  return (
    <AlertDialogPortal forceMount>
      <AnimatePresence>
        {isOpen && (
          <AlertDialogPrimitive.Overlay
            data-slot="alert-dialog-overlay"
            asChild
            forceMount
          >
            <motion.div {...motionProps.overlay} className={overlayClassName} />
          </AlertDialogPrimitive.Overlay>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              {...motionProps.panel}
              className={cn(
                "pointer-events-auto w-full",
                dialogWidthClassName[size === "sm" ? "sm" : "md"]
              )}
            >
              <AlertDialogPrimitive.Content
                data-slot="alert-dialog-content"
                data-size={size}
                forceMount
                className={cn(
                  overlayPanelClassName,
                  "group/alert-dialog-content grid w-full gap-6 rounded-2xl p-7 outline-none data-[size=sm]:gap-5 data-[size=sm]:p-6",
                  className
                )}
                {...props}
              >
                {children}
              </AlertDialogPrimitive.Content>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AlertDialogPortal>
  )
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("grid grid-rows-[auto_1fr] place-items-center gap-1 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr] sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-cols-[auto_1fr]", className)}
      {...props}
    />
  )
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & { variant?: "default" | "destructive" }) {
  return (
    <div
      data-slot="alert-dialog-media"
      data-variant={variant}
      className={cn("bg-muted mb-2 inline-flex size-10 items-center justify-center rounded-lg text-foreground data-[variant=destructive]:bg-destructive/10 data-[variant=destructive]:text-destructive sm:group-data-[size=default]/alert-dialog-content:row-span-2 sm:group-data-[size=default]/alert-dialog-content:mb-0 sm:group-data-[size=default]/alert-dialog-content:self-center *:[svg:not([class*='size-'])]:size-5", className)}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("text-base font-semibold sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2", className)}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-muted-foreground *:[a]:hover:text-foreground text-sm text-pretty *:[a]:underline *:[a]:underline-offset-3", className)}
      {...props}
    />
  )
}

// Radix Action/Cancel must wrap Button (`asChild` → single `<Button>`). Never `Button asChild` → Action:
// Slot.children.only fails when those primitives are not the direct single child of Radix `asChild`.
function AlertDialogAction({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  const { asChild: _asChild, ...buttonProps } = props as typeof props & {
    asChild?: boolean
  }
  return (
    <AlertDialogPrimitive.Action asChild>
      <Button
        data-slot="alert-dialog-action"
        variant={variant}
        size={size}
        className={cn(className)}
        {...buttonProps}
      />
    </AlertDialogPrimitive.Action>
  )
}

function AlertDialogCancel({
  className,
  variant = "outline",
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  const { asChild: _asChild, ...buttonProps } = props as typeof props & {
    asChild?: boolean
  }
  return (
    <AlertDialogPrimitive.Cancel asChild>
      <Button
        data-slot="alert-dialog-cancel"
        variant={variant}
        size={size}
        className={cn(className)}
        {...buttonProps}
      />
    </AlertDialogPrimitive.Cancel>
  )
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
}
