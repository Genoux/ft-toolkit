import { Button } from "@inbeat/ui/components/button";
import { Stack } from "@inbeat/ui/components/layout";
import { Page } from "@inbeat/ui/components/page";
import Link from "next/link";
import { ROUTES } from "@/shared/config/routes";

export default function NotFound() {
  return (
    <Page size="narrow" className="min-h-screen items-center justify-center text-center" asChild>
      <main>
        <Stack gap="lg" align="center">
          <h1 className="text-2xl font-medium">Page not found</h1>
          <Button variant="outline" asChild>
            <Link href={ROUTES.home}>Back home</Link>
          </Button>
        </Stack>
      </main>
    </Page>
  );
}
