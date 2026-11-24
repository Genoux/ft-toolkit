"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "../lib/utils";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { overlayPanelClassName, useOverlayMotion } from "../internal/overlay-motion";
import { Separator } from "./separator";

export type DataTableSelectionBarProps = {
  selectedCount: number;
  onClear: () => void;
  /** The bulk actions: ghost `sm` Buttons when floating, the batch action Button when inline. */
  children?: ReactNode;
  clearLabel?: string;
  /** Positions the bar; floats at the bottom centre of the viewport by default. */
  className?: string;
  /** `floating` appears over the page once something is selected; `inline` sits above the list and stays, with select-all and a summary. */
  variant?: "floating" | "inline";
  /** How many rows can be selected, for "2 of 5 selected". */
  totalCount?: number;
  /** Adds a select-all checkbox to the inline bar; checking it again once all are selected clears. */
  onSelectAll?: () => void;
  selectAllLabel?: string;
  /** A line under the count, such as what the selection adds up to. */
  summary?: ReactNode;
};

function getCountLabel(selectedCount: number, totalCount: number | undefined) {
  if (selectedCount === 0) return "None selected";
  return totalCount === undefined
    ? `${selectedCount} selected`
    : `${selectedCount} of ${totalCount} selected`;
}

function InlineSelectionBar({
  selectedCount,
  onClear,
  children,
  clearLabel,
  className,
  totalCount,
  onSelectAll,
  selectAllLabel,
  summary,
}: DataTableSelectionBarProps) {
  const allSelected = totalCount !== undefined && totalCount > 0 && selectedCount >= totalCount;
  return (
    <div
      role="toolbar"
      aria-label="Bulk actions"
      data-slot="data-table-selection-bar"
      data-variant="inline"
      className={cn(
        "flex min-w-0 flex-wrap items-center gap-x-(--gap-md) gap-y-(--gap-sm) rounded-xl border border-border bg-card px-5 py-3.5",
        className,
      )}
    >
      {onSelectAll ? (
        <Checkbox
          aria-label={selectAllLabel}
          checked={allSelected ? true : selectedCount > 0 ? "indeterminate" : false}
          disabled={totalCount === 0}
          onCheckedChange={(checked) => (checked === true ? onSelectAll() : onClear())}
        />
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span aria-live="polite" className="text-sm font-medium whitespace-nowrap tabular-nums">
          {getCountLabel(selectedCount, totalCount)}
        </span>
        {summary ? <span className="text-sm text-pretty text-muted-foreground">{summary}</span> : null}
      </div>
      {!onSelectAll && selectedCount > 0 ? (
        <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={onClear}>
          {clearLabel}
        </Button>
      ) : null}
      {children ? (
        <div className="flex items-center gap-(--gap-sm) max-sm:w-full max-sm:*:flex-1">{children}</div>
      ) : null}
    </div>
  );
}

function FloatingSelectionBar({
  selectedCount,
  onClear,
  children,
  clearLabel,
  className,
  totalCount,
}: DataTableSelectionBarProps) {
  const { panel } = useOverlayMotion();
  const countLabel = getCountLabel(selectedCount, totalCount);

  // The live region stays mounted outside the animated bar: a region announces changes to content
  // it already had, so one created with the first "1 selected" would never read it.
  return (
    <>
      <span aria-live="polite" className="sr-only">
        {selectedCount > 0 ? countLabel : ""}
      </span>
      <AnimatePresence>
      {selectedCount > 0 ? (
        <div
          key="data-table-selection-bar"
          className={cn(
            "pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4",
            className,
          )}
        >
          <motion.div
            role="toolbar"
            aria-label="Bulk actions"
            data-slot="data-table-selection-bar"
            data-variant="floating"
            {...panel}
            className={cn(
              "pointer-events-auto flex h-12 items-center gap-1.5 rounded-full py-1.5 pr-1.5 pl-5",
              overlayPanelClassName,
            )}
          >
            <span className="pr-2 text-sm font-medium whitespace-nowrap tabular-nums">
              {countLabel}
            </span>
            {children ? (
              <>
                <Separator orientation="vertical" size="sm" />
                <div className="flex items-center gap-0.5 px-1">{children}</div>
              </>
            ) : null}
            <Separator orientation="vertical" size="sm" />
            <Button variant="ghost" size="sm" className="ml-1 text-muted-foreground" onClick={onClear}>
              {clearLabel}
            </Button>
          </motion.div>
        </div>
      ) : null}
      </AnimatePresence>
    </>
  );
}

export function DataTableSelectionBar({
  variant = "floating",
  clearLabel = "Clear",
  selectAllLabel = "Select all",
  ...props
}: DataTableSelectionBarProps) {
  const barProps = { clearLabel, selectAllLabel, ...props };
  return variant === "inline" ? (
    <InlineSelectionBar {...barProps} />
  ) : (
    <FloatingSelectionBar {...barProps} />
  );
}
