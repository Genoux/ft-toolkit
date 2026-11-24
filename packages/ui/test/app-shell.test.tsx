import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AppShell, AppShellHeaderActions, AppShellNav } from "../src/components/app-shell";
import { TooltipProvider } from "../src/components/tooltip";

describe("AppShell", () => {
  it("keeps the sidebar layout by default", () => {
    const markup = renderToStaticMarkup(
      <AppShell sidebarHeader="Pool" sidebar={null}>
        Page
      </AppShell>,
    );

    expect(markup).toContain('data-slot="sidebar"');
    expect(markup).not.toContain('data-layout="topbar"');
  });

  it("renders the top bar without a sidebar, its links inline from md", () => {
    const markup = renderToStaticMarkup(
      <AppShell
        layout="topbar"
        topbarBrand="inBeat"
        topbarNav={
          <AppShellNav
            items={[{ title: "Clients", isActive: true }, { title: "Database" }]}
            renderLink={(item, content) => <a href={`/${item.title}`}>{content}</a>}
          />
        }
        topbarActions={<button type="button">Account</button>}
      >
        Page
      </AppShell>,
    );

    expect(markup).toContain('data-layout="topbar"');
    expect(markup).not.toContain('data-slot="sidebar"');
    expect(markup).toMatch(/<nav aria-label="Main" class="hidden[^"]*md:flex/);
    expect(markup).toMatch(/data-slot="nav-links" data-orientation="horizontal"/);
    expect(markup).toContain("Open menu");
  });

  it("shows header actions inline from md and a menu trigger below it", () => {
    const markup = renderToStaticMarkup(
      <TooltipProvider>
        <AppShellHeaderActions menu={null}>
          <button type="button">Language</button>
        </AppShellHeaderActions>
      </TooltipProvider>,
    );

    expect(markup).toMatch(
      /<div class="hidden[^"]*md:flex"><button type="button">Language<\/button><\/div>/,
    );
    expect(markup).toMatch(/<button[^>]*class="[^"]*md:hidden"[^>]*aria-label="More actions"/);
  });
});
