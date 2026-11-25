import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AppShell, AppShellHeaderActions, AppShellNav } from "../src/components/app-shell";
import { Badge } from "../src/components/badge";
import { NavUser } from "../src/components/nav-user";
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

  it("sizes every topbar piece from the one control-sm height", () => {
    const markup = renderToStaticMarkup(
      <TooltipProvider>
        <AppShell
          layout="topbar"
          topbarBrand="The Album"
          topbarNav={
            <AppShellNav
              items={[{ title: "Mission", isActive: true }]}
              renderLink={(item, content) => <a href={`/${item.title}`}>{content}</a>}
            />
          }
          topbarActions={
            <>
              <Badge size="lg">5 / 19</Badge>
              <NavUser
                variant="avatar"
                name="Ana Ferreira"
                email="ana@example.com"
                onSignOut={() => {}}
              />
            </>
          }
        >
          Page
        </AppShell>
      </TooltipProvider>,
    );

    expect(markup).toMatch(/data-slot="nav-link"[^>]*class="[^"]*\bh-control-sm\b/);
    expect(markup).toMatch(/data-slot="badge"[^>]*class="[^"]*\bh-control-sm\b/);
    expect(markup).toMatch(/data-slot="avatar"[^>]*class="[^"]*\bsize-control-sm\b/);
    expect(markup).not.toMatch(/\b(?:h|size)-9\b/);
  });
});
