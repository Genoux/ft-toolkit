/**
 * The quiet panel a few facts sit on inside a card: near white with a faint edge. Framed and tiled
 * DescriptionLists use it; give it padding for a tile of figures, such as I&R's pay tiles.
 */
// The edge is mixed from the foreground so it holds in dark mode. The tint stays near white on a
// card in light mode (owner, 2026-11-24); dark mode needs a stronger mix of muted to read as a
// surface at all.
export const panelClassName = "rounded-xl border border-foreground/7 bg-muted/30 dark:bg-muted/60";
