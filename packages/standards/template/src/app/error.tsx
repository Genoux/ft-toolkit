"use client";

import { Button } from "@inbeat/ui/components/button";
import { Stack } from "@inbeat/ui/components/layout";
import { Page } from "@inbeat/ui/components/page";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

// `error.message` is never rendered: in production it is Next's generic copy, and in dev it can
// carry internals. The digest is enough for support to find the server log.
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <Page size="narrow" className="min-h-screen items-center justify-center text-center" asChild>
      <main>
        <Stack gap="sm" align="center">
          <h1 className="text-2xl font-medium">Something went wrong</h1>
          {error.digest ? (
            <p className="font-mono text-xs text-muted-foreground">{error.digest}</p>
          ) : null}
        </Stack>
        <Button type="button" variant="outline" onClick={reset}>
          Try again
        </Button>
      </main>
    </Page>
  );
}
