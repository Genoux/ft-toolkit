import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MemberAvatarStack, memberSummary } from "../src/components/member-avatar-stack";

describe("memberSummary", () => {
  it("names the first two by first name and counts the rest", () => {
    const members = [
      { name: "Maya Chen" },
      { name: "Theo Grant" },
      { name: "Sam Lee" },
      { name: "Riley Park" },
    ];

    expect(memberSummary(members)).toBe("Maya, Theo +2");
  });

  it("falls back to the email's local part and counts members without either", () => {
    expect(memberSummary([{ name: null, email: "maya@inbeat.co" }, { name: null }])).toBe(
      "maya +1",
    );
  });

  it("is empty when nobody has a name or email", () => {
    expect(memberSummary([{ name: null }])).toBe("");
  });
});

describe("MemberAvatarStack", () => {
  it("says Empty without members, or the label the app gives", () => {
    expect(renderToStaticMarkup(<MemberAvatarStack members={[]} />)).toContain(">Empty<");
    expect(
      renderToStaticMarkup(<MemberAvatarStack members={null} emptyLabel="No team" />),
    ).toContain(">No team<");
  });
});
