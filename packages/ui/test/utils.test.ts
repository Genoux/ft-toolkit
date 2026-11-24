import { describe, expect, it } from "vitest";
import { cn } from "../src/lib/utils";

describe("cn", () => {
  it("keeps a type role next to a text colour", () => {
    for (const role of [
      "text-3xs",
      "text-2xs",
      "text-table",
      "text-title",
      "text-stat",
      "text-display",
    ]) {
      expect(cn(role, "text-muted-foreground")).toBe(`${role} text-muted-foreground`);
    }
  });

  it("lets a later type role or shadow replace an earlier one", () => {
    expect(cn("text-sm", "text-table")).toBe("text-table");
    expect(cn("shadow-hairline", "shadow-none")).toBe("shadow-none");
    expect(cn("shadow-raised", "shadow-elevated")).toBe("shadow-elevated");
    expect(cn("ease-out", "ease-out-expo")).toBe("ease-out-expo");
  });
});
