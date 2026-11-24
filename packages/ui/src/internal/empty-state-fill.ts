// An empty state takes the height its page leaves. Every flex column between the Page and the message
// (Tabs, a Stack, the settings content) grows while it holds one, or the room never reaches it.
export const growWithEmptyStateClassName =
  "has-[[data-slot=empty-state],[data-slot=data-table-status]]:grow";
