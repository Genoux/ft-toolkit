import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Pagination, PaginationLoadMore } from "../../src/components/pagination";

const meta = {
  title: "Molecules/Pagination",
  component: Pagination,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="w-3xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj;

const CASES = [
  { label: "first page", page: 1, total: 2847 },
  { label: "middle", page: 57, total: 2847 },
  { label: "last page", page: 114, total: 2847 },
  { label: "few pages", page: 2, total: 120 },
  { label: "one page", page: 1, total: 18 },
  { label: "no results", page: 1, total: 0 },
];

/** Start, middle and end of a long list, a short one, a single page and nothing; then load more idle, loading and done. */
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {CASES.map((example) => (
        <div key={example.label} className="flex flex-col gap-2">
          <code className="text-xs text-muted-foreground">{example.label}</code>
          <Pagination
            page={example.page}
            pageSize={25}
            total={example.total}
            onPageChange={() => {}}
          />
        </div>
      ))}
      <div className="grid grid-cols-3 gap-4 border-t border-border pt-6">
        <PaginationLoadMore shown={25} total={2847} onLoadMore={() => {}} />
        <PaginationLoadMore shown={50} total={2847} onLoadMore={() => {}} loading />
        <PaginationLoadMore shown={2847} total={2847} onLoadMore={() => {}} />
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  render: function InteractiveStory() {
    const [page, setPage] = useState(1);
    return <Pagination page={page} pageSize={25} total={2847} onPageChange={setPage} />;
  },
};

/** `getHref` renders links, for paging through search params in a Server Component. */
export const Links: Story = {
  render: () => (
    <Pagination page={3} pageSize={25} total={2847} getHref={(page) => `?page=${page}`} />
  ),
};

export const LoadMore: Story = {
  render: function LoadMoreStory() {
    const [shown, setShown] = useState(25);
    const [loading, setLoading] = useState(false);
    return (
      <PaginationLoadMore
        shown={shown}
        total={112}
        loading={loading}
        onLoadMore={() => {
          setLoading(true);
          setTimeout(() => {
            setShown((count) => Math.min(count + 25, 112));
            setLoading(false);
          }, 800);
        }}
      />
    );
  },
};
