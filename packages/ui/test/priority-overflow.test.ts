import { describe, expect, it } from "vitest";
import { fitItems } from "../src/internal/priority-overflow";

const FIVE_TABS = [60, 80, 70, 90, 50];
const GAP = 4;
const MORE = 40;

function visibleFor(availableWidth: number, pinnedIndex = 0) {
  return fitItems({
    itemWidths: FIVE_TABS,
    availableWidth,
    gap: GAP,
    moreWidth: MORE,
    pinnedIndex,
  });
}

describe("fitItems", () => {
  it("keeps every item when the whole row fits, without reserving room for More", () => {
    const fullRow = 60 + 80 + 70 + 90 + 50 + 4 * GAP;
    expect(visibleFor(fullRow)).toEqual([0, 1, 2, 3, 4]);
  });

  it("fills from the start and leaves room for the More trigger", () => {
    // 60 + 4 + 80 + 4 + 70 = 218 items, + 4 + 40 More = 262.
    expect(visibleFor(262)).toEqual([0, 1, 2]);
    expect(visibleFor(261)).toEqual([0, 1]);
  });

  it("keeps a pinned item from the end as the last visible one", () => {
    expect(visibleFor(262, 4)).toEqual([0, 1, 4]);
  });

  it("never hides the pinned item, even when nothing else fits", () => {
    expect(visibleFor(20, 3)).toEqual([3]);
  });

  it("can collapse every item into More when nothing is pinned", () => {
    expect(visibleFor(50, -1)).toEqual([]);
  });

  it("stops at the first item that does not fit instead of skipping ahead to a narrower one", () => {
    // 60 + 4 + 80 = 144; the third (70) does not fit, the fifth (50) would, but order is kept.
    expect(visibleFor(144 + GAP + MORE + 60)).toEqual([0, 1]);
  });
});
