import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { Card, CardHeader, CardSection, CardTitle } from "../../src/components/card";
import { RecordCardSkeleton } from "../../src/components/record-card";
import { Skeleton } from "../../src/components/skeleton";
import { AnnotationCaption } from "../lib/state-annotation";

const meta = {
  title: "Atoms/Skeleton",
  component: Skeleton,
  args: { className: "h-3 w-48" },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

function Labelled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <AnnotationCaption>{label}</AnnotationCaption>
      {children}
    </div>
  );
}

/** A page header while a record's name loads: a bar on the title's line and one on the description's, at their line heights. */
function PageHeaderSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-2">
      <div className="flex h-10 items-center">
        <Skeleton className="h-5 w-72" />
      </div>
      <div className="flex h-6 items-center">
        <Skeleton className="h-3 w-96" />
      </div>
    </div>
  );
}

/** Rows of a list: one calm bar per row, the row's own height and rule. */
function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div aria-hidden className="divide-y divide-border rounded-xl border border-border bg-card">
      {Array.from({ length: rows }, (_, row) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: placeholder rows have no identity
        <div key={row} className="flex h-14 items-center px-(--item-padding-x)">
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
  );
}

/** A detail panel: the card title stays (it is known), each fact is a short label bar over a full-width value bar. */
function DetailSkeleton() {
  return (
    <Card aria-hidden>
      <CardHeader>
        <CardTitle>Budget impact</CardTitle>
      </CardHeader>
      <CardSection className="grid grid-cols-2 gap-x-6 gap-y-5">
        {["first", "second", "third", "fourth"].map((fact) => (
          <div key={fact} className="flex flex-col gap-2">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </CardSection>
    </Card>
  );
}

/** A paragraph: full-width lines, the last one shorter where the text would end. */
function TextSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-2.5">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

/** The compositions the apps need, from the one bar: a page header, a list, record cards, a detail panel and text. Every bar is `bg-muted`, `rounded-md` and pulses in step; only avatars and pills take `rounded-full`. Tables use `DataTable isLoading`. */
export const AllStates: Story = {
  render: () => (
    <div className="grid w-6xl grid-cols-2 items-start gap-x-8 gap-y-8">
      <Labelled label="page header">
        <PageHeaderSkeleton />
      </Labelled>
      <Labelled label="text">
        <TextSkeleton />
      </Labelled>
      <Labelled label="list">
        <ListSkeleton />
      </Labelled>
      <Labelled label="detail panel">
        <DetailSkeleton />
      </Labelled>
      <Labelled label="record cards · RecordCardSkeleton">
        <div className="grid grid-cols-2 gap-4">
          <RecordCardSkeleton />
          <RecordCardSkeleton tags meter />
        </div>
      </Labelled>
    </div>
  ),
};

export const Default: Story = {};

/** Avatars and pills are the only round bars. */
export const Circle: Story = { args: { className: "size-10 rounded-full" } };
