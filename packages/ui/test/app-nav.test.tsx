import { Building2, Users } from "lucide-react";
import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AppNav } from "../src/components/app-nav";
import { SidebarProvider } from "../src/components/sidebar";

const renderLink = (item: { title: string }, content: ReactNode) => (
  <a href={`/${item.title.toLowerCase()}`}>{content}</a>
);

function anchorTag(markup: string, href: string) {
  return markup.match(new RegExp(`<a[^>]*href="${href}"[^>]*>`))?.[0] ?? "";
}

function nav(clientsProps: { defaultOpen?: boolean; activeClient?: string } = {}) {
  return renderToStaticMarkup(
    <SidebarProvider>
      <AppNav
        renderLink={renderLink}
        items={[
          { title: "Members", icon: Users, isActive: !clientsProps.activeClient, count: 12 },
          {
            title: "Clients",
            icon: Building2,
            defaultOpen: clientsProps.defaultOpen,
            items: ["Nutramax", "Oura"].map((title) => ({
              title,
              isActive: title === clientsProps.activeClient,
            })),
          },
        ]}
      />
    </SidebarProvider>,
  );
}

describe("AppNav", () => {
  it("marks the active link as the current page and keeps the count", () => {
    const markup = nav();

    expect(anchorTag(markup, "/members")).toContain('aria-current="page"');
    expect(markup).toContain('data-slot="app-nav-count"');
  });

  it("renders a row with items as a closed toggle, not a link", () => {
    const markup = nav();

    expect(markup).toMatch(/<button[^>]*data-slot="app-nav-parent"[^>]*aria-expanded="false"/);
    expect(markup).not.toContain('href="/clients"');
    expect(markup).not.toContain('href="/nutramax"');
  });

  it("opens the sub-menu while one of its items is active", () => {
    const markup = nav({ activeClient: "Oura" });

    expect(markup).toContain('aria-expanded="true"');
    expect(anchorTag(markup, "/oura")).toContain('aria-current="page"');
    expect(markup).toContain('href="/nutramax"');
  });

  it("lets defaultOpen override the active sub-item", () => {
    expect(nav({ defaultOpen: true })).toContain('href="/nutramax"');
    expect(nav({ defaultOpen: false, activeClient: "Oura" })).not.toContain('href="/oura"');
  });

  it("keeps row actions outside the link and the trailing status inside it", () => {
    const markup = renderToStaticMarkup(
      <SidebarProvider>
        <AppNav
          renderLink={renderLink}
          items={[
            {
              title: "Launch",
              icon: Users,
              trailing: <span data-status="processing" />,
              actions: <button type="button">Actions</button>,
            },
          ]}
        />
      </SidebarProvider>,
    );

    expect(markup).toMatch(/<a[^>]*>.*data-status="processing".*<\/a>/);
    expect(markup).toMatch(/<\/a><div data-slot="app-nav-actions"[^>]*><button/);
  });

  it("folds a collapsible group under its label and keeps the label action beside it", () => {
    const group = (defaultOpen?: boolean) =>
      renderToStaticMarkup(
        <SidebarProvider>
          <AppNav
            label="Products"
            collapsible
            defaultOpen={defaultOpen}
            action={<button type="button">Add product</button>}
            renderLink={renderLink}
            items={[{ title: "Oura Ring", icon: Users }]}
          />
        </SidebarProvider>,
      );

    expect(group()).toMatch(/<button[^>]*aria-expanded="true"[^>]*>.*Products/);
    expect(group()).toContain('href="/oura ring"');
    expect(group(false)).not.toContain('href="/oura ring"');
    expect(group(false)).toContain('data-slot="app-nav-group-action"');
  });
});
