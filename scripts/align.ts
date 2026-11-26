import { chromium } from "playwright";
import { openStory, storybook, storyIds } from "./storybook";

// Alignment check for @fieldtripagency/ui: opens every Storybook story at 1440 wide and measures the
// DOM for the misalignments a reviewer otherwise catches by eye. Exits 1 when it finds one.
//   bun run align                      build Storybook and check every story
//   --url http://localhost:6006        check a running Storybook instead of building one
//   --filter molecules-item            only stories whose id contains the text
//
// Rules (all in CSS pixels):
//   centre  an icon, badge, dot, avatar or checkbox next to text shares the text line's centre (±1)
//   touch   text, badges and icons side by side in a row keep 4px apart unless both are controls
//   gap     repeated siblings (rows, cards, fields) sit at one gap (±1 of the median)
//   inset   content in a framed box starts as far from the left edge as it ends from the right (±1)
//   tint    a full-width tint inside a frame stays inside the frame and its rounded corners
//   clip    text is not cut by its container, unless it ends in an ellipsis or the box scrolls

type Rule = "centre" | "touch" | "gap" | "inset" | "tint" | "clip";
type Finding = { rule: Rule; selector: string; detail: string };
type Ignore = { story: string; rule: Rule; selector: string; reason: string };

// Deliberate cases. `story` matches the story id and `selector` the reported selector or detail, both
// by substring, so keep them specific.
const IGNORE: Ignore[] = [
  {
    story: "",
    rule: "touch",
    selector: "[data-slot=field-required]",
    reason: "the required asterisk is set tight against its label, like a superscript",
  },
  {
    story: "",
    rule: "centre",
    selector: "[data-slot=page-header-media]",
    reason:
      "the header avatar is level with the top of the title, not centred on title and description (owner, 2026-11-26)",
  },
  {
    story: "showcase-component-grid--cover",
    rule: "inset",
    selector: "",
    reason: "story-only: the README cover's component grid runs off the frame by design",
  },
  {
    story: "showcase-component-grid--cover",
    rule: "clip",
    selector: "",
    reason: "story-only: the README cover's component grid runs off the frame by design",
  },
  {
    story: "atoms-tooltip--open",
    rule: "gap",
    selector: "tooltip-trigger",
    reason: "story-only: triggers spread across the canvas to show each side, not a list",
  },
  {
    story: "atoms-infohint--all-states",
    rule: "touch",
    selector: "[data-slot=info-hint]",
    reason: "owner decision: the hover fill of InfoHint's -m-1 hit area comes 2px from the label",
  },
  {
    story: "",
    rule: "inset",
    selector: '"Delete clientPermanently delete',
    reason: "owner decision: ItemMedia's min-w-8 column puts a 16px icon 8px past the row padding",
  },
];

const VIEWPORT = { width: 1440, height: 900 };

function measure(): Finding[] {
  const TOLERANCE = 1;
  const MIN_SPACE = 4;
  // Taller graphics (a skeleton block, a thumbnail) are layout, not something on a text line.
  const INLINE_GRAPHIC_MAX_HEIGHT = 64;
  // Framed boxes up to this tall are controls and pills, not containers of rows.
  const CONTAINER_MIN_HEIGHT = 48;
  const GRAPHIC_SLOTS = new Set([
    "avatar",
    "avatar-group",
    "badge",
    "badge-dot",
    "checkbox",
    "chip",
    "kbd",
    "member-avatar-stack",
    "number-dot",
    "radio-group-item",
    "spinner",
    "status-dot",
    "switch",
  ]);
  const GRAPHIC_TAGS = new Set(["svg", "img", "video", "canvas"]);
  const CONTROL = "button, a[href], [role=button], [role=combobox], [role=tab]";
  const FIELD = "input, select, textarea";
  // Story captions (AnnotationCaption) label the canvas; they are not part of the UI under test.
  const STORY_CAPTION = "[data-annotation]";
  const OVERLAPPING = "[data-slot=avatar-group], [data-slot=member-avatar-stack]";
  const EQUAL_GAP_SLOTS = new Set([
    "item-group",
    "field-group",
    "description-list",
    "grid",
    "stack",
  ]);
  const SEPARATOR = "[data-slot$=separator], hr, [role=separator]";

  const findings: Finding[] = [];
  const round = (value: number) => Math.round(value * 10) / 10;
  const style = (element: Element) => getComputedStyle(element);
  const centre = (box: DOMRect) => box.top + box.height / 2;

  const describe = (node: Node): string => {
    const segments: string[] = [];
    let element = node instanceof Element ? node : node.parentElement;
    let slots = 0;
    const root = document.getElementById("storybook-root");
    while (
      element &&
      element !== document.body &&
      element !== root &&
      segments.length < 4 &&
      slots < 2
    ) {
      const slot = element.getAttribute("data-slot");
      const parent: Element | null = element.parentElement;
      const sameTag = parent
        ? [...parent.children].filter((child) => child.tagName === element?.tagName)
        : [];
      const position = sameTag.length > 1 ? `:nth-of-type(${sameTag.indexOf(element) + 1})` : "";
      segments.unshift(
        slot ? `[data-slot=${slot}]${position}` : `${element.tagName.toLowerCase()}${position}`,
      );
      if (slot) slots += 1;
      element = parent;
    }
    const text = (node.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 32);
    return `${segments.join(" > ")}${text ? ` "${text}"` : ""}`;
  };

  const isRendered = (element: Element) => {
    if (!element.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return false;
    if (element.closest(STORY_CAPTION)) return false;
    const box = element.getBoundingClientRect();
    if (box.width === 0 && box.height === 0) return false;
    // sr-only text is a 1px clipped box: present for screen readers, absent on screen.
    return !(style(element).position === "absolute" && (box.width <= 1 || box.height <= 1));
  };

  const textRects = (text: Text) => {
    if (!text.data.trim() || !text.parentElement || !isRendered(text.parentElement)) return [];
    const range = document.createRange();
    range.selectNodeContents(text);
    return [...range.getClientRects()].filter((rect) => rect.width > 0 && rect.height > 0);
  };

  const union = (boxes: DOMRect[]) => {
    if (boxes.length === 0) return null;
    const left = Math.min(...boxes.map((box) => box.left));
    const top = Math.min(...boxes.map((box) => box.top));
    const right = Math.max(...boxes.map((box) => box.right));
    const bottom = Math.max(...boxes.map((box) => box.bottom));
    return new DOMRect(left, top, right - left, bottom - top);
  };

  const hasPaint = (element: Element) => {
    const computed = style(element);
    const background = computed.backgroundColor;
    const painted =
      computed.backgroundImage !== "none" ||
      !(background === "transparent" || background.endsWith(", 0)"));
    const bordered = ["Top", "Right", "Bottom", "Left"].some(
      (side) =>
        Number.parseFloat(computed.getPropertyValue(`border-${side.toLowerCase()}-width`)) > 0 &&
        !computed.getPropertyValue(`border-${side.toLowerCase()}-color`).endsWith(", 0)"),
    );
    return painted || bordered;
  };

  const isOutOfFlow = (element: Element) => ["absolute", "fixed"].includes(style(element).position);

  const innerBox = (element: Element) => {
    const box = element.getBoundingClientRect();
    const computed = style(element);
    const left = box.left + Number.parseFloat(computed.borderLeftWidth);
    const right = box.right - Number.parseFloat(computed.borderRightWidth);
    const top = box.top + Number.parseFloat(computed.borderTopWidth);
    const bottom = box.bottom - Number.parseFloat(computed.borderBottomWidth);
    return new DOMRect(left, top, right - left, bottom - top);
  };

  const contentBox = (element: Element) => {
    const box = innerBox(element);
    const computed = style(element);
    const left = box.left + Number.parseFloat(computed.paddingLeft);
    const right = box.right - Number.parseFloat(computed.paddingRight);
    return new DOMRect(left, box.top, right - left, box.height);
  };

  // A truncated text run is longer than what shows: an ellipsis ends it inside the content box, a
  // plain clip at the padding box.
  const clipToAncestors = (box: DOMRect, element: Element) => {
    let { left, right } = box;
    for (let ancestor: Element | null = element; ancestor; ancestor = ancestor.parentElement) {
      const computed = style(ancestor);
      if (computed.overflowX === "visible") continue;
      const clip = computed.textOverflow === "ellipsis" ? contentBox(ancestor) : innerBox(ancestor);
      left = Math.max(left, clip.left);
      right = Math.min(right, clip.right);
    }
    return new DOMRect(left, box.top, Math.max(right - left, 0), box.height);
  };

  // An icon's drawing, not its square: a chevron's ink starts a few pixels inside its box.
  const iconInk = (svg: SVGGraphicsElement) => {
    const matrix = svg.getScreenCTM();
    const bounds = svg.getBBox();
    if (!matrix || bounds.width === 0) return svg.getBoundingClientRect();
    // Corners mapped one by one, since a rotated icon (an open chevron) flips the axes.
    const corners = [
      [bounds.x, bounds.y],
      [bounds.x + bounds.width, bounds.y + bounds.height],
    ].map(([x, y]) => new DOMPoint(x, y).matrixTransform(matrix));
    const xs = corners.map((point) => point.x);
    const ys = corners.map((point) => point.y);
    const left = Math.min(...xs);
    const top = Math.min(...ys);
    return new DOMRect(left, top, Math.max(...xs) - left, Math.max(...ys) - top);
  };

  const textBox = (text: Text) => {
    const box = union(textRects(text));
    return box && text.parentElement ? clipToAncestors(box, text.parentElement) : box;
  };

  const isGraphic = (element: Element) =>
    GRAPHIC_TAGS.has(element.tagName.toLowerCase()) ||
    GRAPHIC_SLOTS.has(element.getAttribute("data-slot") ?? "") ||
    ["checkbox", "switch", "radio"].includes(element.getAttribute("role") ?? "");

  const visibleText = (element: Element) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const texts: Text[] = [];
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (node instanceof Text && textRects(node).length > 0) texts.push(node);
    }
    return texts;
  };

  // What the eye sees of a node: the glyphs, icons and painted shapes in it. A painted box that holds
  // text (a tinted cell, a filled button) is its edge; a bare wrapper is the union of what it holds.
  const inkBox = (node: Node): DOMRect | null => {
    if (node instanceof Text) return textBox(node);
    if (!(node instanceof Element) || !isRendered(node) || isOutOfFlow(node)) return null;
    if (node instanceof SVGSVGElement) return iconInk(node);
    if (
      isGraphic(node) ||
      (hasPaint(node) && (node.matches(CONTROL) || visibleText(node).length === 0))
    ) {
      return node.getBoundingClientRect();
    }
    return union([...node.childNodes].map(inkBox).filter((box): box is DOMRect => box !== null));
  };

  const sameBox = (a: DOMRect, b: DOMRect | null) =>
    b !== null &&
    Math.abs(a.left - b.left) <= TOLERANCE &&
    Math.abs(a.right - b.right) <= TOLERANCE &&
    Math.abs(a.top - b.top) <= TOLERANCE &&
    Math.abs(a.bottom - b.bottom) <= TOLERANCE;

  // A shape is paint without text or icon (a bar segment, a skeleton): it sits on a line like an icon
  // but may butt against its neighbours.
  type Part = {
    node: Node;
    kind: "graphic" | "shape" | "text" | "control" | "field";
    box: DOMRect;
  };

  const kindOf = (node: Node): Part["kind"] => {
    if (node instanceof Text) return "text";
    const element = node as Element;
    if (element.matches(FIELD)) return "field";
    if (isGraphic(element)) return "graphic";
    const control = element.matches(CONTROL) ? element : element.querySelector(CONTROL);
    if (control && hasPaint(control) && sameBox(control.getBoundingClientRect(), inkBox(element))) {
      return "control";
    }
    if (visibleText(element).length > 0) return "text";
    return element.querySelector("svg, img, video, canvas") ? "graphic" : "shape";
  };

  // Children as the layout sees them: a run of adjacent text nodes is one anonymous item ("+" and "2"
  // from `+{count}`), and display: contents children lend their own children.
  const partsOf = (container: Element): Part[] => {
    const parts: Part[] = [];
    let previousText = false;
    for (const node of container.childNodes) {
      if (node instanceof Element && style(node).display === "contents") {
        parts.push(...partsOf(node));
        previousText = false;
        continue;
      }
      if (node instanceof Element && (!isRendered(node) || isOutOfFlow(node))) continue;
      if (!(node instanceof Element || node instanceof Text)) continue;
      const box = inkBox(node);
      const last = parts.at(-1);
      if (node instanceof Text && previousText && last && box) {
        last.box = union([last.box, box]) as DOMRect;
        continue;
      }
      previousText = node instanceof Text && box !== null;
      if (box) parts.push({ node, kind: kindOf(node), box });
    }
    return parts;
  };

  const sameRow = (a: DOMRect, b: DOMRect) =>
    Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 0 &&
    (a.right <= b.left + 0.5 || b.right <= a.left + 0.5);

  const horizontalDistance = (a: DOMRect, b: DOMRect) =>
    Math.max(b.left - a.right, a.left - b.right, 0);

  // A graphic beside text sits on the text's first line; beside a stack of lines (a name over an
  // email, a label over a figure) on the stack's middle or on one of its lines. One wrapped run of
  // text is not a stack: only its first line counts.
  const textAnchors = (part: Part) => {
    const texts = part.node instanceof Text ? [part.node] : visibleText(part.node as Element);
    const lines = texts.map((text) => textRects(text)[0] as DOMRect);
    const firstLine = centre(lines[0] as DOMRect);
    const stacked = new Set(lines.map((line) => Math.round(line.top))).size > 1;
    // The element's own middle: a filled tile's, or a stack's line boxes (a 36px title's glyphs sit
    // lower in its line than a 14px meta line's).
    const ownBox = part.node instanceof Element ? [centre(part.node.getBoundingClientRect())] : [];
    const tile = part.node instanceof Element && hasPaint(part.node) ? ownBox : [];
    return stacked
      ? [firstLine, centre(part.box), ...lines.map(centre), ...ownBox]
      : [firstLine, ...tile];
  };

  const rowContainers = [...document.body.querySelectorAll("*")].filter((element) => {
    if (!isRendered(element) || isGraphic(element)) return false;
    const computed = style(element);
    if (computed.display === "table-row") return true;
    const flexRow = computed.display.endsWith("flex") && computed.flexDirection.startsWith("row");
    return flexRow || computed.display.endsWith("grid");
  });

  for (const container of rowContainers) {
    const parts = partsOf(container);
    const texts = parts.filter((part) => part.kind === "text");
    const inline = parts.filter(
      (part) =>
        ["graphic", "shape"].includes(part.kind) && part.box.height <= INLINE_GRAPHIC_MAX_HEIGHT,
    );
    for (const graphic of inline) {
      const beside = texts.filter((text) => sameRow(graphic.box, text.box));
      const nearest = Math.min(...beside.map((text) => horizontalDistance(graphic.box, text.box)));
      // Texts at the same distance are one column (a grid's title over its description): a stack.
      const column = beside.filter(
        (text) => horizontalDistance(graphic.box, text.box) <= nearest + TOLERANCE,
      );
      const neighbour = column[0];
      if (!neighbour) continue;
      const anchors =
        column.length > 1
          ? [
              centre(union(column.map((text) => text.box)) as DOMRect),
              ...column.flatMap(textAnchors),
            ]
          : textAnchors(neighbour);
      const offset = anchors
        .map((anchor) => centre(graphic.box) - anchor)
        .reduce((best, value) => (Math.abs(value) < Math.abs(best) ? value : best));
      if (Math.abs(offset) > TOLERANCE) {
        findings.push({
          rule: "centre",
          selector: describe(graphic.node),
          detail: `${round(offset)}px ${offset > 0 ? "below" : "above"} the centre of ${describe(neighbour.node)}`,
        });
      }
    }

    // Table cells keep their own padding; overlapping avatars are a stack on purpose.
    if (style(container).display === "table-row" || container.matches(OVERLAPPING)) continue;
    const ordered = parts
      .filter((part) => part.kind !== "field" && part.kind !== "shape")
      .sort((a, b) => a.box.left - b.box.left);
    for (const [index, part] of ordered.entries()) {
      const next = ordered[index + 1];
      if (!next || !sameRow(part.box, next.box)) continue;
      if (part.kind === "control" && next.kind === "control") continue;
      const space = next.box.left - part.box.right;
      if (space < MIN_SPACE) {
        findings.push({
          rule: "touch",
          selector: describe(part.node),
          detail: `${round(space)}px from ${describe(next.node)}`,
        });
      }
    }
  }

  const gapContainers = [...document.body.querySelectorAll("*")].filter((element) => {
    if (!isRendered(element)) return false;
    const display = style(element).display;
    return (
      display.endsWith("flex") ||
      display.endsWith("grid") ||
      EQUAL_GAP_SLOTS.has(element.getAttribute("data-slot") ?? "")
    );
  });

  const signature = (element: Element) =>
    element.getAttribute("data-slot") ?? `${element.tagName}.${element.className}`;

  for (const container of gapContainers) {
    const children = [...container.children].filter(
      (child) => isRendered(child) && !isOutOfFlow(child),
    );
    const counts = new Map<string, number>();
    for (const child of children) {
      if (!child.matches(SEPARATOR))
        counts.set(signature(child), (counts.get(signature(child)) ?? 0) + 1);
    }
    const [repeated, count] = [...counts].sort((a, b) => b[1] - a[1])[0] ?? ["", 0];
    if (count < 3) continue;

    // Runs of the repeated sibling, separators allowed between; anything else starts a new run.
    const runs: Element[][] = [[]];
    for (const child of children) {
      if (signature(child) === repeated) (runs.at(-1) as Element[]).push(child);
      else if (!child.matches(SEPARATOR)) runs.push([]);
    }

    const rowGaps: number[] = [];
    const columnGaps: number[] = [];
    for (const run of runs) {
      const boxes = run.map((child) => child.getBoundingClientRect());
      const lines: DOMRect[][] = [];
      for (const box of boxes) {
        // One line holds boxes that overlap vertically: a shorter item centred on the line (an
        // ellipsis between page numbers) has its own top.
        const line = lines.find((candidate) =>
          candidate.some(
            (other) => Math.min(other.bottom, box.bottom) - Math.max(other.top, box.top) > 0,
          ),
        );
        if (line) line.push(box);
        else lines.push([box]);
      }
      for (const [index, line] of lines.entries()) {
        const sorted = [...line].sort((a, b) => a.left - b.left);
        sorted.slice(1).forEach((box, position) => {
          columnGaps.push(box.left - (sorted[position] as DOMRect).right);
        });
        const next = lines[index + 1];
        if (next) {
          rowGaps.push(
            Math.min(...next.map((box) => box.top)) - Math.max(...line.map((box) => box.bottom)),
          );
        }
      }
    }

    for (const [axis, gaps] of [
      ["row", rowGaps],
      ["column", columnGaps],
    ] as const) {
      if (gaps.length < 2) continue;
      const median = [...gaps].sort((a, b) => a - b)[Math.floor(gaps.length / 2)] as number;
      if (gaps.some((gap) => Math.abs(gap - median) > TOLERANCE)) {
        findings.push({
          rule: "gap",
          selector: describe(container).replace(/ ".*$/, ""),
          detail: `${axis} gaps between ${repeated.split(".")[0]} differ: ${gaps.map(round).join(", ")}`,
        });
      }
    }
  }

  const isFrame = (element: Element) => {
    if (GRAPHIC_TAGS.has(element.tagName.toLowerCase()) || !isRendered(element)) return false;
    const computed = style(element);
    const sideBorder = (side: string) =>
      Number.parseFloat(computed.getPropertyValue(`border-${side}-width`)) > 0 &&
      !computed.getPropertyValue(`border-${side}-color`).endsWith(", 0)");
    if (sideBorder("left") && sideBorder("right")) return true;
    const background = computed.backgroundColor;
    const tinted = !(background === "transparent" || background.endsWith(", 0)"));
    return tinted && Number.parseFloat(computed.borderTopLeftRadius) >= 4;
  };

  type Leaf = { box: DOMRect; endAligned: boolean };

  // A control's box (its hover fill shows it, ghost or not), trimmed to its parent's content box:
  // a hit area that reaches past the edge on purpose (InfoHint's -m-1) is not where it sits.
  const controlBox = (control: Element) => {
    const box = control.getBoundingClientRect();
    if (!control.parentElement) return box;
    const parent = contentBox(control.parentElement);
    const left = Math.max(box.left, parent.left);
    const right = Math.min(box.right, parent.right);
    return new DOMRect(left, box.top, Math.max(right - left, 0), box.height);
  };

  // The glyphs, shapes, controls and nested frames inside a frame, stopping at nested frames. A
  // borderless field (in an InputGroup) counts from where its text starts.
  const leavesOf = (frame: Element): Leaf[] =>
    [...frame.childNodes].flatMap((node): Leaf[] => {
      if (node instanceof Text) {
        const align = node.parentElement ? style(node.parentElement).textAlign : "left";
        return textRects(node).map((box) => ({
          box,
          endAligned: ["right", "end", "center"].includes(align),
        }));
      }
      if (!(node instanceof Element) || !isRendered(node) || isOutOfFlow(node)) return [];
      if (node.matches(FIELD) && !hasPaint(node))
        return [{ box: contentBox(node), endAligned: true }];
      if (node.matches(CONTROL)) return [{ box: controlBox(node), endAligned: true }];
      if (isGraphic(node) || isFrame(node) || hasPaint(node)) {
        return [{ box: node.getBoundingClientRect(), endAligned: true }];
      }
      return leavesOf(node);
    });

  // Containers only: a control or pill takes less padding on its icon side on purpose (optical
  // balance), and a table cell's padding belongs to its column.
  const frames = [...document.body.querySelectorAll("*")].filter(
    (element) =>
      isFrame(element) &&
      !element.matches(`${CONTROL}, ${FIELD}, td, th`) &&
      !isGraphic(element) &&
      element.getBoundingClientRect().height > CONTAINER_MIN_HEIGHT,
  );

  for (const frame of frames) {
    if (style(frame).overflowX !== "visible" && frame.scrollWidth > frame.clientWidth) continue;
    const inner = innerBox(frame);
    const leaves = leavesOf(frame);
    const ends = leaves.filter((leaf) => leaf.endAligned);
    if (ends.length === 0) continue;
    const left = Math.min(...leaves.map((leaf) => leaf.box.left)) - inner.left;
    const right = inner.right - Math.max(...ends.map((leaf) => leaf.box.right));
    // A right inset well past twice the left one is content that stops short, not an edge.
    if (left < 0 || right < 0 || right > 2 * left + TOLERANCE) continue;
    if (Math.abs(left - right) > TOLERANCE) {
      findings.push({
        rule: "inset",
        selector: describe(frame),
        detail: `content starts ${round(left)}px from the left edge, ends ${round(right)}px from the right`,
      });
    }
  }

  const clippedWithin = (element: Element, frame: Element) => {
    for (let box = element.parentElement; box && box !== frame; box = box.parentElement) {
      if (style(box).overflowX !== "visible" || style(box).overflowY !== "visible") return true;
    }
    return false;
  };

  // Tints: a painted row at least half the frame's width, inside a frame that does not clip it.
  const CORNERS = [
    { radius: "borderTopLeftRadius", x: "left", y: "top", sx: 1, sy: 1 },
    { radius: "borderTopRightRadius", x: "right", y: "top", sx: -1, sy: 1 },
    { radius: "borderBottomLeftRadius", x: "left", y: "bottom", sx: 1, sy: -1 },
    { radius: "borderBottomRightRadius", x: "right", y: "bottom", sx: -1, sy: -1 },
  ] as const;
  for (const frame of document.body.querySelectorAll("*")) {
    if (!isFrame(frame)) continue;
    const computed = style(frame);
    if (computed.overflowX !== "visible" || computed.overflowY !== "visible") continue;
    const inner = innerBox(frame);
    const border = Number.parseFloat(computed.borderLeftWidth);
    for (const row of frame.querySelectorAll("*")) {
      if (!isRendered(row) || isGraphic(row) || row.matches(`${CONTROL}, ${FIELD}`)) continue;
      if (clippedWithin(row, frame)) continue;
      const background = style(row).backgroundColor;
      if (background === "transparent" || background.endsWith(", 0)")) continue;
      const box = row.getBoundingClientRect();
      if (box.width < inner.width / 2) continue;
      const outside = Math.max(
        inner.left - box.left,
        box.right - inner.right,
        inner.top - box.top,
        box.bottom - inner.bottom,
      );
      // Each tint corner, pulled in along the diagonal by its own rounding, must stay inside the
      // frame's inner arc.
      const pastCorner = Math.max(
        0,
        ...CORNERS.map((corner) => {
          // A 9999px pill radius renders as half the shorter side.
          const used = (value: string, box: DOMRect) =>
            Math.min(Number.parseFloat(value), box.width / 2, box.height / 2);
          const frameRadius = Math.max(used(computed[corner.radius], inner) - border, 0);
          const rowInset = used(style(row)[corner.radius], box) * (1 - Math.SQRT1_2);
          const dx =
            corner.sx *
            (box[corner.x] + corner.sx * rowInset - (inner[corner.x] + corner.sx * frameRadius));
          const dy =
            corner.sy *
            (box[corner.y] + corner.sy * rowInset - (inner[corner.y] + corner.sy * frameRadius));
          return dx < 0 && dy < 0 ? Math.hypot(dx, dy) - frameRadius : 0;
        }),
      );
      if (outside > TOLERANCE || pastCorner > TOLERANCE) {
        findings.push({
          rule: "tint",
          selector: describe(row).replace(/ ".*$/, ""),
          detail:
            outside > TOLERANCE
              ? `tint crosses ${describe(frame).replace(/ ".*$/, "")} by ${round(outside)}px`
              : `tint corner pokes ${round(pastCorner)}px past the rounded corner of ${describe(frame).replace(/ ".*$/, "")}`,
        });
      }
    }
  }

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const clipped = new Set<Element>();
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!(node instanceof Text)) continue;
    const rects = textRects(node);
    const owner = node.parentElement;
    if (rects.length === 0 || !owner || clipped.has(owner)) continue;
    let text = union(rects) as DOMRect;
    for (let box: Element | null = owner; box && box !== document.body; box = box.parentElement) {
      const computed = style(box);
      const scrolls = ["auto", "scroll"];
      if (scrolls.includes(computed.overflowX) || scrolls.includes(computed.overflowY)) break;
      const cuts = (axis: string) => ["hidden", "clip"].includes(axis);
      if (!cuts(computed.overflowX) && !cuts(computed.overflowY)) continue;
      const clip = innerBox(box);
      const overlaps =
        text.right > clip.left &&
        text.left < clip.right &&
        text.bottom > clip.top &&
        text.top < clip.bottom;
      // Wholly outside is hidden on purpose (a closed collapsible, an off-screen slide).
      if (!overlaps) break;
      const ellipsis = computed.textOverflow === "ellipsis";
      const clamped = computed.webkitLineClamp !== "none";
      const cutX =
        cuts(computed.overflowX) && !ellipsis
          ? Math.max(clip.left - text.left, text.right - clip.right)
          : 0;
      const cutY =
        cuts(computed.overflowY) && !clamped
          ? Math.max(clip.top - text.top, text.bottom - clip.bottom)
          : 0;
      if (cutX > TOLERANCE || cutY > TOLERANCE) {
        clipped.add(owner);
        findings.push({
          rule: "clip",
          selector: describe(owner),
          detail: `text cut ${round(Math.max(cutX, cutY))}px ${cutX >= cutY ? "horizontally" : "vertically"} by ${describe(box).replace(/ ".*$/, "")}`,
        });
        break;
      }
      // What an ellipsis or a line clamp shortened ends at this box for the boxes further out.
      const left = ellipsis ? Math.max(text.left, clip.left) : text.left;
      const right = ellipsis ? Math.min(text.right, clip.right) : text.right;
      const top = clamped ? Math.max(text.top, clip.top) : text.top;
      const bottom = clamped ? Math.min(text.bottom, clip.bottom) : text.bottom;
      text = new DOMRect(left, top, right - left, bottom - top);
    }
  }

  const unique = new Map(
    findings.map((finding) => [`${finding.rule}|${finding.selector}|${finding.detail}`, finding]),
  );
  return [...unique.values()];
}

const ignored = (story: string, finding: Finding) =>
  IGNORE.some(
    (entry) =>
      story.includes(entry.story) &&
      entry.rule === finding.rule &&
      `${finding.selector} ${finding.detail}`.includes(entry.selector),
  );

const { baseUrl, stop } = storybook();
const ids = await storyIds(baseUrl);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: 1 });
await page.emulateMedia({ reducedMotion: "reduce" });

let total = 0;
const perRule = new Map<Rule, number>();
for (const id of ids) {
  await openStory(page, baseUrl, id);
  const findings = (await page.evaluate(measure)).filter((finding) => !ignored(id, finding));
  if (findings.length === 0) continue;
  console.log(`\n${id}`);
  for (const finding of findings) {
    console.log(`  ${finding.rule.padEnd(6)} ${finding.selector}\n         ${finding.detail}`);
    perRule.set(finding.rule, (perRule.get(finding.rule) ?? 0) + 1);
  }
  total += findings.length;
}
await browser.close();
stop();

const summary = [...perRule].map(([rule, count]) => `${rule} ${count}`).join(", ");
console.log(
  total === 0
    ? `\nNo misalignment in ${ids.length} stories.`
    : `\n${total} misalignments (${summary}) in ${ids.length} stories.`,
);
process.exit(total === 0 ? 0 : 1);
