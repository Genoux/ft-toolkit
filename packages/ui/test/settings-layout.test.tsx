import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SettingsLayout } from "../src/components/settings-layout";

describe("SettingsLayout", () => {
  it("labels each nav group and renders the content column", () => {
    const markup = renderToStaticMarkup(
      <SettingsLayout
        groups={[
          { label: "Account", items: [{ title: "Profile", isActive: true }] },
          { label: "Clients", items: [{ title: "Oura" }] },
        ]}
        renderLink={(item, content) => <a href={`/settings/${item.title}`}>{content}</a>}
      >
        <section>Profile form</section>
      </SettingsLayout>,
    );

    expect(markup).toContain('<nav aria-label="Settings"');
    expect(markup.match(/role="group"/g)).toHaveLength(2);
    expect(markup).toMatch(/<div id="([^"]+)"[^>]*>Account<\/div>/);
    expect(markup).toContain('data-slot="settings-content"');
    expect(markup).toContain("Profile form");
  });
});
