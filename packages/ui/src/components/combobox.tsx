"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react"
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react"

import { cn } from "../lib/utils"
import { Button } from "./button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./input-group"
import {
  type ControlSize,
  baseUiPanelMotionClassName,
  chipClassName,
  chipRemoveClassName,
  fieldRadiusClassName,
  listboxIndicatorClassName,
  listboxItemClassName,
  listboxLabelClassName,
  listboxPanelClassName,
  listboxSeparatorClassName,
} from "../internal/control-styles"
import { usePortalContainer } from "./portal-container"
import { selectTriggerClassName } from "./select"

const VISIBLE_CHIP_LIMIT = 3

// The popup anchors to the whole input group (not the inner <input>), so it is as wide as the field.
const ComboboxAnchorContext = React.createContext<{
  inputAnchor: HTMLDivElement | null
  setInputAnchor: (element: HTMLDivElement | null) => void
} | null>(null)
const ComboboxInPopupContext = React.createContext(false)

function Combobox<Value, Multiple extends boolean | undefined = false, Item = Value>(
  props: ComboboxPrimitive.Root.Props<Value, Multiple, Item>
) {
  const [inputAnchor, setInputAnchor] = React.useState<HTMLDivElement | null>(null)
  const anchorContext = React.useMemo(() => ({ inputAnchor, setInputAnchor }), [inputAnchor])
  return (
    <ComboboxAnchorContext.Provider value={anchorContext}>
      <ComboboxPrimitive.Root {...props} />
    </ComboboxAnchorContext.Provider>
  )
}

function ComboboxValue({ ...props }: ComboboxPrimitive.Value.Props) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />
}

function ComboboxTrigger({
  className,
  children,
  ...props
}: ComboboxPrimitive.Trigger.Props) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn("[&_svg:not([class*='size-'])]:size-4", className)}
      {...props}
    >
      {children}
      <ChevronDownIcon
        data-slot="combobox-trigger-icon"
        className="pointer-events-none size-4 text-subtle-foreground"
      />
    </ComboboxPrimitive.Trigger>
  )
}

function ComboboxSelectTrigger({
  children,
  size = "default",
}: {
  children: React.ReactNode
  size?: ControlSize
}) {
  return (
    <ComboboxTrigger
      render={
        <button
          type="button"
          data-size={size}
          className={selectTriggerClassName({ className: "w-full" })}
        />
      }
    >
      {children}
    </ComboboxTrigger>
  )
}

function ComboboxClear({ className, ...props }: ComboboxPrimitive.Clear.Props) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      aria-label="Clear selection"
      render={<InputGroupButton variant="ghost" size="icon-xs" />}
      className={cn(className)}
      {...props}
    >
      <XIcon className="pointer-events-none" />
    </ComboboxPrimitive.Clear>
  )
}

function ComboboxInput({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  size,
  ...props
}: Omit<ComboboxPrimitive.Input.Props, "size"> & {
  showTrigger?: boolean
  showClear?: boolean
  size?: ControlSize
}) {
  const anchorContext = React.useContext(ComboboxAnchorContext)
  const isInPopup = React.useContext(ComboboxInPopupContext)
  return (
    <InputGroup
      ref={isInPopup ? undefined : anchorContext?.setInputAnchor}
      size={size}
      className={cn("w-auto", className)}
    >
      <ComboboxPrimitive.Input
        render={<InputGroupInput disabled={disabled} />}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        {showTrigger && (
          <InputGroupButton
            size="icon-xs"
            variant="ghost"
            asChild
            data-slot="input-group-button"
            className="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent"
            disabled={disabled}
          >
            <ComboboxTrigger />
          </InputGroupButton>
        )}
        {showClear && <ComboboxClear disabled={disabled} />}
      </InputGroupAddon>
      {children}
    </InputGroup>
  )
}

function ComboboxContent({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  anchor,
  ...props
}: ComboboxPrimitive.Popup.Props &
  Pick<
    ComboboxPrimitive.Positioner.Props,
    "side" | "align" | "sideOffset" | "alignOffset" | "anchor"
  >) {
  const portalContainer = usePortalContainer()
  const inputAnchor = React.useContext(ComboboxAnchorContext)?.inputAnchor

  return (
    <ComboboxPrimitive.Portal container={portalContainer ?? undefined}>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor ?? inputAnchor ?? undefined}
        className="isolate z-50"
      >
        <ComboboxInPopupContext.Provider value>
          <ComboboxPrimitive.Popup
            data-slot="combobox-content"
            data-chips={!!anchor}
            className={cn(
              listboxPanelClassName,
              baseUiPanelMotionClassName,
              "group/combobox-content relative max-h-96 outline-none w-(--anchor-width) max-w-(--available-width) min-w-(--anchor-width) origin-(--transform-origin) overflow-hidden *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:h-9 *:data-[slot=input-group]:rounded-lg *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:border-transparent *:data-[slot=input-group]:bg-muted *:data-[slot=input-group]:shadow-none",
              className
            )}
            {...props}
          />
        </ComboboxInPopupContext.Provider>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  )
}

function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn(
        "max-h-[min(calc(--spacing(96)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:hidden",
        className
      )}
      {...props}
    />
  )
}

function ComboboxItem({
  className,
  children,
  ...props
}: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        listboxItemClassName,
        "pr-9 data-highlighted:bg-muted data-highlighted:text-foreground",
        className
      )}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator
        data-slot="combobox-item-indicator"
        render={
          <span className={listboxIndicatorClassName} />
        }
      >
        <CheckIcon className="pointer-events-none size-4 pointer-coarse:size-5" />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  )
}

function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props) {
  return (
    <ComboboxPrimitive.Group
      data-slot="combobox-group"
      className={cn(className)}
      {...props}
    />
  )
}

function ComboboxLabel({
  className,
  ...props
}: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-label"
      className={cn(
        listboxLabelClassName,
        "pointer-coarse:text-sm",
        className
      )}
      {...props}
    />
  )
}

function ComboboxCollection({ ...props }: ComboboxPrimitive.Collection.Props) {
  return (
    <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />
  )
}

function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        "flex w-full justify-center px-3 py-6 text-center text-sm text-muted-foreground empty:hidden",
        className
      )}
      {...props}
    />
  )
}

function ComboboxSeparator({
  className,
  ...props
}: ComboboxPrimitive.Separator.Props) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      className={cn(listboxSeparatorClassName, className)}
      {...props}
    />
  )
}

function ComboboxChips({
  className,
  size = "default",
  ...props
}: React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> &
  ComboboxPrimitive.Chips.Props & { size?: ControlSize }) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      data-size={size}
      className={cn(
        fieldRadiusClassName,
        "flex min-h-10 data-[size=sm]:min-h-9 data-[size=sm]:py-px flex-wrap items-center gap-1 border border-input bg-card bg-clip-padding px-4 py-0.5 text-sm shadow-hairline transition-[color,border-color,box-shadow] duration-(--duration-fast) ease-out-expo hover:border-ring/60 has-[input:focus-visible]:focus-ring has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 has-data-[slot=combobox-chip]:pl-0.5 dark:bg-input/30 dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

function ComboboxChip({
  className,
  children,
  showRemove = true,
  ...props
}: ComboboxPrimitive.Chip.Props & {
  showRemove?: boolean
}) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        chipClassName,
        "h-7 w-fit justify-center gap-0.5 px-3 text-xs has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 has-data-[slot=combobox-chip-remove]:pr-0.5",
        className
      )}
      {...props}
    >
      {children}
      {showRemove && (
        <ComboboxPrimitive.ChipRemove
          render={<Button variant="ghost" size="icon-xs" />}
          aria-label={typeof children === "string" ? `Remove ${children}` : "Remove"}
          className={cn("size-6", chipRemoveClassName)}
          data-slot="combobox-chip-remove"
        >
          <XIcon className="pointer-events-none" />
        </ComboboxPrimitive.ChipRemove>
      )}
    </ComboboxPrimitive.Chip>
  )
}

function ComboboxChipsInput({
  className,
  children,
  ...props
}: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chip-input"
      className={cn("h-7 min-w-16 flex-1 bg-transparent outline-none placeholder:text-muted-foreground", className)}
      {...props}
    />
  )
}

function ComboboxLimitedValue({
  values,
  limit = VISIBLE_CHIP_LIMIT,
}: {
  values: string[]
  limit?: number
}) {
  const visibleValues = values.slice(0, limit)
  const hiddenCount = values.length - visibleValues.length

  return (
    <ComboboxValue>
      {visibleValues.map((value) => (
        <ComboboxChip key={value}>{value}</ComboboxChip>
      ))}
      {hiddenCount > 0 && <ComboboxChip showRemove={false}>+{hiddenCount}</ComboboxChip>}
    </ComboboxValue>
  )
}

function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null)
}

export {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxSeparator,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxLimitedValue,
  ComboboxSelectTrigger,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
}
