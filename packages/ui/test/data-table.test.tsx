import type { ColumnDef } from "@tanstack/react-table";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DataTable, getSelectionColumn } from "../src/components/data-table";
import { DataTableSelectionBar } from "../src/components/data-table-selection-bar";
import { DataTableShell } from "../src/components/data-table-shell";
import { Table, TableBody, TableCell, TableGroupRow } from "../src/components/table";

type Creator = { id: string; name: string; followers: number };

const CREATORS: Creator[] = [
  { id: "maya", name: "Maya Okafor", followers: 284_000 },
  { id: "lucas", name: "Lucas Ferreira", followers: 1_240_000 },
];

const COLUMNS: ColumnDef<Creator>[] = [
  getSelectionColumn<Creator>(),
  { accessorKey: "name", header: "Creator", meta: { sticky: "start" } },
  { accessorKey: "followers", header: "Followers", meta: { numeric: true } },
  { id: "actions", header: "Actions", meta: { sticky: "end" } },
];

describe("DataTable", () => {
  it("freezes columns with each start column offset by the frozen columns before it", () => {
    const markup = renderToStaticMarkup(<DataTable columns={COLUMNS} data={CREATORS} />);

    expect(markup).toMatch(
      /data-sticky="start"[^>]*style="width:48px;min-width:48px;max-width:48px"/,
    );
    expect(markup).toMatch(/data-sticky="start"[^>]*style="--table-sticky-offset:48px"/);
    expect(markup).not.toContain('data-state="false"');
    expect(markup).toContain('data-sticky="end"');
    expect(markup).toContain('data-numeric="true"');
  });

  it("renders skeleton rows under the header while loading", () => {
    const markup = renderToStaticMarkup(
      <DataTable columns={COLUMNS} data={[]} isLoading loadingRowCount={3} />,
    );

    expect(markup).toContain('aria-busy="true"');
    expect(markup.match(/data-placeholder="true"/g)).toHaveLength(3);
    expect(markup).toContain(">Creator</th>");
    expect(markup).not.toContain("No results.");
  });

  it("shows the error in place of the rows and of the empty message", () => {
    const markup = renderToStaticMarkup(
      <DataTable columns={COLUMNS} data={CREATORS} error="Couldn't load creators" />,
    );

    expect(markup).toContain("Couldn&#x27;t load creators");
    expect(markup).not.toContain("Maya Okafor");
  });

  it("renders a custom empty state when there are no rows", () => {
    const markup = renderToStaticMarkup(
      <DataTable
        columns={COLUMNS}
        data={[]}
        empty={<button type="button">Clear filters</button>}
      />,
    );

    expect(markup).toContain('data-slot="data-table-status"');
    expect(markup).toContain("Clear filters");
  });

  it("replaces the table, header included, with the empty or error state", () => {
    const empty = renderToStaticMarkup(<DataTable columns={COLUMNS} data={[]} />);
    const failed = renderToStaticMarkup(
      <DataTable columns={COLUMNS} data={CREATORS} error="Couldn't load creators" />,
    );

    expect(empty).not.toContain("<table");
    expect(failed).not.toContain("<table");
  });

  it("makes rows focusable targets when onRowClick is set", () => {
    const markup = renderToStaticMarkup(
      <DataTable columns={COLUMNS} data={CREATORS} onRowClick={() => {}} />,
    );

    expect(markup.match(/<tr[^>]*tabindex="0"/g)).toHaveLength(CREATORS.length);
  });
});

describe("column hiding", () => {
  it("drops a column below its breakpoint in the header and every cell", () => {
    const markup = renderToStaticMarkup(
      <DataTable
        columns={[
          { accessorKey: "name", header: "Creator" },
          { accessorKey: "followers", header: "Followers", meta: { hideBelow: "md" } },
        ]}
        data={CREATORS}
      />,
    );

    expect(markup.match(/max-md:hidden/g)).toHaveLength(CREATORS.length + 1);
  });
});

describe("TableGroupRow", () => {
  it("titles a group of rows with a header cell that spans the row", () => {
    const markup = renderToStaticMarkup(
      <Table>
        <TableBody>
          <TableGroupRow colSpan={4} count={3}>
            Negotiating
          </TableGroupRow>
          <tr>
            <TableCell>Maya Okafor</TableCell>
          </tr>
        </TableBody>
      </Table>,
    );

    expect(markup).toMatch(
      /<tr data-slot="table-group-row"><th scope="rowgroup" colSpan="4"[^>]*><span[^>]*>Negotiating<span[^>]*>3<\/span><\/span><\/th><\/tr>/,
    );
  });
});

describe("DataTableSelectionBar", () => {
  it("stays above the list while nothing is selected and counts against the total", () => {
    const bar = (selectedCount: number) =>
      renderToStaticMarkup(
        <DataTableSelectionBar
          variant="inline"
          selectedCount={selectedCount}
          totalCount={5}
          onSelectAll={() => undefined}
          onClear={() => undefined}
          summary="$4,080 a year"
        />,
      );

    expect(bar(0)).toContain("None selected");
    expect(bar(2)).toContain("2 of 5 selected");
    expect(bar(2)).toContain('aria-checked="mixed"');
    expect(bar(5)).toContain('aria-checked="true"');
    expect(bar(2)).toContain("$4,080 a year");
  });

  it("renders only its empty live region while floating with no selection", () => {
    expect(
      renderToStaticMarkup(<DataTableSelectionBar selectedCount={0} onClear={() => undefined} />),
    ).toBe('<span aria-live="polite" class="sr-only"></span>');
  });
});

describe("DataTableShell", () => {
  it("frames the table by default and drops the frame when asked", () => {
    const framed = renderToStaticMarkup(<DataTableShell />);
    const bare = renderToStaticMarkup(<DataTableShell frame={false} />);

    expect(framed).toContain('data-frame="true"');
    expect(framed).toContain("border-border");
    expect(bare).not.toContain("data-frame");
    expect(bare).not.toContain("border");
  });
});

describe("DataTableShell height", () => {
  it("grows into the page's room only while it holds an empty, no-results or error state", () => {
    const markup = renderToStaticMarkup(<DataTableShell />);

    expect(markup).toContain("has-data-[slot=data-table-status]:grow");
    expect(markup).toContain("*:shrink-0");
  });

  it("drops its frame and surface while it holds one, so the message sits on the page", () => {
    const markup = renderToStaticMarkup(<DataTableShell />);

    expect(markup).toContain("has-data-[slot=data-table-status]:border-0");
    expect(markup).toContain("has-data-[slot=data-table-status]:bg-transparent");
  });
});
