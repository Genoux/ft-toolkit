import { EmptyState } from "@inbeat/ui/components/empty-state";
import { Page } from "@inbeat/ui/components/page";
import Link from "next/link";
import { ROUTES } from "@/shared/config/routes";

export default function NotFound() {
  return (
    <Page size="centered" asChild>
      <main>
        <EmptyState
          size="page"
          title="Page not found"
          action={{ label: "Back home", variant: "outline", href: ROUTES.home }}
          renderLink={(href, content) => <Link href={href}>{content}</Link>}
        />
      </main>
    </Page>
  );
}
