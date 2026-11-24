"use client";

import * as React from "react";

type OverflowMeasurement = {
  itemWidths: number[];
  availableWidth: number;
  gap: number;
  moreWidth: number;
  /** The item that must stay visible (the active one); -1 for none. */
  pinnedIndex: number;
};

/**
 * Priority+ fit: every item when they all fit, otherwise the pinned item plus as many items from the
 * start as fit beside a More trigger. Indices come back in their original order: a pinned item from
 * the end shows as the last visible one (Primer's UnderlineNav swap), never moved to the front.
 */
export function fitItems({
  itemWidths,
  availableWidth,
  gap,
  moreWidth,
  pinnedIndex,
}: OverflowMeasurement) {
  const rowWidth = (indices: number[]) =>
    indices.reduce((total, index) => total + gap + (itemWidths[index] ?? 0), -gap);
  const allIndices = itemWidths.map((_, index) => index);
  if (rowWidth(allIndices) <= availableWidth) return allIndices;

  const budget = availableWidth - moreWidth - gap;
  const byPriority =
    pinnedIndex >= 0
      ? [pinnedIndex, ...allIndices.filter((index) => index !== pinnedIndex)]
      : allIndices;
  const firstOverflowing = byPriority.findIndex(
    (_, position) => rowWidth(byPriority.slice(0, position + 1)) > budget,
  );
  const fitCount = Math.max(firstOverflowing, pinnedIndex >= 0 ? 1 : 0);
  return byPriority.slice(0, fitCount).sort((first, second) => first - second);
}

function sameIndices(previous: number[] | null, next: number[]) {
  return (
    previous?.length === next.length &&
    previous.every((index, position) => index === next[position])
  );
}

/**
 * Measures a hidden copy of the row (`measureRef`: one child per item, then the More trigger, with the
 * row's own gap and inline padding) against the width of `frameRef`. The copy stays in flow so the frame
 * keeps asking its parent for the full row's width, which is how it notices when room comes back; its
 * More trigger is positioned out of flow so that width never includes it. The frame never shrinks below
 * the pinned item plus More, so a squeezed row overflows its parent rather than hiding the active item.
 * `visibleIndices` is null until the first measurement, which runs before paint, so the full row never
 * flashes on the client.
 */
export function usePriorityOverflow({
  pinnedIndex,
  enabled,
}: {
  pinnedIndex: number;
  enabled: boolean;
}) {
  const frameRef = React.useRef<HTMLDivElement>(null);
  const measureRef = React.useRef<HTMLDivElement>(null);
  const [visibleIndices, setVisibleIndices] = React.useState<number[] | null>(null);

  React.useLayoutEffect(() => {
    const frame = frameRef.current;
    const measureRow = measureRef.current;
    if (!frame) return;
    frame.style.minWidth = "";
    if (!enabled || !measureRow) {
      setVisibleIndices(null);
      return;
    }
    const measure = () => {
      const widths = Array.from(
        measureRow.children,
        (child) => child.getBoundingClientRect().width,
      );
      const moreWidth = widths.pop() ?? 0;
      const rowStyle = getComputedStyle(measureRow);
      const inlinePadding =
        Number.parseFloat(rowStyle.paddingLeft) + Number.parseFloat(rowStyle.paddingRight);
      const inlineMargin =
        Number.parseFloat(rowStyle.marginLeft) + Number.parseFloat(rowStyle.marginRight);
      const gap = Number.parseFloat(rowStyle.columnGap) || 0;
      const pinnedWidth = widths[pinnedIndex] ?? 0;
      frame.style.minWidth =
        widths.length > 1
          ? `${inlineMargin + inlinePadding + (pinnedWidth ? pinnedWidth + gap : 0) + moreWidth}px`
          : "";
      const next = fitItems({
        itemWidths: widths,
        availableWidth: frame.clientWidth - inlineMargin - inlinePadding,
        gap,
        moreWidth,
        pinnedIndex,
      });
      setVisibleIndices((previous) => (sameIndices(previous, next) ? previous : next));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    observer.observe(measureRow);
    return () => observer.disconnect();
  }, [enabled, pinnedIndex]);

  return { frameRef, measureRef, visibleIndices };
}
