"use client";

import { EmptyState } from "@inbeat/ui/components/empty-state";
import { Page } from "@inbeat/ui/components/page";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

// `error.message` is never rendered: in production it is Next's generic copy, and in dev it can
// carry internals. The digest is enough for support to find the server log.
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <Page size="centered" asChild>
      <main>
        <EmptyState
          size="page"
          title="Something went wrong"
          action={{ label: "Try again", variant: "outline", onClick: reset }}
          meta={
            error.digest ? <span className="font-mono text-xs">{error.digest}</span> : undefined
          }
        />
      </main>
    </Page>
  );
}
