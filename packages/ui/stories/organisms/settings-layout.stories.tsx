import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Ban,
  FileText,
  Info,
  Languages,
  Megaphone,
  Package,
  Settings2,
  Trash2,
} from "lucide-react";
import { Button } from "../../src/components/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../../src/components/field";
import { Input } from "../../src/components/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "../../src/components/item";
import { Page, PageHeader, PageSection } from "../../src/components/page";
import { SettingsLayout } from "../../src/components/settings-layout";
import { useActiveTitle } from "../lib/app-fixtures";
import { CLIENT, PRODUCTS } from "../screens/proof-agent/fixtures";

const CLIENT_SECTIONS = [
  { title: "General", icon: Settings2 },
  { title: "Languages", icon: Languages },
  { title: "Say this (instead of)", icon: Megaphone },
  { title: "Never say", icon: Ban },
  { title: "Disclaimers", icon: Info },
  { title: "Custom rules", icon: FileText },
];

const GROUPS = [
  { label: CLIENT.name, items: CLIENT_SECTIONS },
  { label: "Products", items: PRODUCTS.map((product) => ({ title: product, icon: Package })) },
];

/** Proof's client General settings: name and code save on blur, so there is no Save button. */
function GeneralSection({ codeError }: { codeError?: string }) {
  return (
    <>
      <PageSection
        title="General"
        description="How this client appears in settings and session selection."
        actions={
          <span className="text-xs text-muted-foreground">Last updated {CLIENT.updated}</span>
        }
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="settings-client-name">Full client name</FieldLabel>
            <Input id="settings-client-name" defaultValue={CLIENT.name} maxLength={200} />
            <FieldDescription>The client&apos;s full name.</FieldDescription>
          </Field>
          <Field data-invalid={codeError ? true : undefined}>
            <FieldLabel htmlFor="settings-client-code">Client code</FieldLabel>
            <Input
              id="settings-client-code"
              defaultValue={codeError ? "OUR" : CLIENT.code}
              placeholder="ACME"
              maxLength={4}
              autoComplete="off"
              className="font-mono uppercase"
              aria-invalid={codeError ? true : undefined}
              aria-describedby="settings-client-code-hint settings-client-code-error"
            />
            <FieldDescription id="settings-client-code-hint">
              Exactly four letters or digits, unique across clients.
            </FieldDescription>
            <FieldError id="settings-client-code-error">{codeError}</FieldError>
          </Field>
        </FieldGroup>
      </PageSection>
      <PageSection title="Danger zone">
        <ItemGroup>
          <Item>
            <ItemMedia>
              <Trash2 aria-hidden />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Delete client</ItemTitle>
              <ItemDescription>
                Permanently delete this client and all attached data.
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="outline" size="sm">
                Delete
              </Button>
            </ItemActions>
          </Item>
        </ItemGroup>
      </PageSection>
    </>
  );
}

function ProductGeneralSection({ product }: { product: string }) {
  return (
    <PageSection
      title="General"
      description="How this product appears in settings and session selection."
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="settings-product-name">Name</FieldLabel>
          <Input id="settings-product-name" defaultValue={product} />
          <FieldDescription>How the product appears throughout Proof.</FieldDescription>
        </Field>
      </FieldGroup>
    </PageSection>
  );
}

function SettingsPage({
  initialTitle = "General",
  codeError,
}: {
  initialTitle?: string;
  codeError?: string;
}) {
  const { activeTitle, markActive, renderLink } = useActiveTitle(initialTitle);
  const isProduct = PRODUCTS.includes(activeTitle);
  return (
    <Page size="medium">
      <PageHeader
        title="Settings"
        description={`${CLIENT.name}'s rules, languages and products.`}
      />
      <SettingsLayout
        groups={GROUPS.map((group) => ({ ...group, items: markActive(group.items) }))}
        renderLink={renderLink}
      >
        {isProduct ? (
          <ProductGeneralSection product={activeTitle} />
        ) : (
          <GeneralSection codeError={codeError} />
        )}
      </SettingsLayout>
    </Page>
  );
}

const meta = {
  title: "Organisms/SettingsLayout",
  parameters: { layout: "fullscreen" },
  globals: { viewport: { value: "desktop", isRotated: false } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Nav states in one frame: an unlabelled group, labelled groups, active and disabled links. */
export const AllStates: Story = {
  render: () => {
    function AllStatesPreview() {
      const { markActive, renderLink } = useActiveTitle("General");
      const groups = [
        { label: CLIENT.name, items: CLIENT_SECTIONS.slice(0, 2) },
        {
          label: "Products",
          items: PRODUCTS.map((product, index) => ({
            title: product,
            icon: Package,
            disabled: index === PRODUCTS.length - 1,
          })),
        },
      ];
      return (
        <Page size="medium">
          <SettingsLayout
            groups={groups.map((group) => ({ ...group, items: markActive(group.items) }))}
            renderLink={renderLink}
          >
            <GeneralSection codeError="Code must be exactly four letters or digits." />
          </SettingsLayout>
        </Page>
      );
    }
    return <AllStatesPreview />;
  },
};

/** Proof's client settings: one group for the client's sections, one for its products. Stacked fields stop at 28rem. */
export const Default: Story = { render: () => <SettingsPage /> };

/** A product's own General section, marked in the Products group. */
export const ClientSection: Story = { render: () => <SettingsPage initialTitle={PRODUCTS[0]} /> };

/** A code that fails validation on blur: the message sits under its hint. */
export const WithError: Story = {
  render: () => <SettingsPage codeError="Another client already uses that code." />,
};

/** On a phone the nav becomes one scrolling pill row, scrolled to the active link. */
export const Mobile: Story = {
  globals: { viewport: { value: "mobile2", isRotated: false } },
  render: () => <SettingsPage />,
};
