import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Ban,
  FileText,
  Info,
  Languages,
  Megaphone,
  MoreHorizontal,
  Package,
  Plus,
  Settings2,
  Star,
  Trash2,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { AppNav } from "../../../src/components/app-nav";
import { AppShell } from "../../../src/components/app-shell";
import { Badge } from "../../../src/components/badge";
import { Button } from "../../../src/components/button";
import { DestructiveActionDialog } from "../../../src/components/destructive-action-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../src/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../src/components/dropdown-menu";
import { Dropzone } from "../../../src/components/dropzone";
import { EmptyState } from "../../../src/components/empty-state";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../../../src/components/field";
import { IconButton } from "../../../src/components/icon-button";
import { Input } from "../../../src/components/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "../../../src/components/item";
import { Inline } from "../../../src/components/layout";
import { Page, PageBackLink, PageHeader, PageSection } from "../../../src/components/page";
import { Spinner } from "../../../src/components/spinner";
import { TextLink } from "../../../src/components/text-link";
import {
  CLIENT,
  CLIENT_LANGUAGES,
  CUSTOM_RULES,
  type CustomRule,
  NEVER_SAY_RULES,
  PRODUCTS,
} from "./fixtures";

const COMPLIANCE_SECTIONS = [
  { title: "Say this (instead of)", icon: Megaphone },
  { title: "Never say", icon: Ban },
  { title: "Disclaimers", icon: Info },
  { title: "Custom rules", icon: FileText },
];

const CLIENT_SECTIONS = [
  { title: "General", icon: Settings2 },
  { title: "Languages", icon: Languages },
  ...COMPLIANCE_SECTIONS,
];

const PRODUCT_SECTIONS = ["General", ...COMPLIANCE_SECTIONS.map((section) => section.title)];

const productKey = (product: string, section: string) => `${product} · ${section}`;

function SettingsSidebar({
  activeKey,
  onSelect,
}: {
  activeKey: string;
  onSelect: (key: string) => void;
}) {
  const renderLink = (key: string, content: ReactNode) => (
    <a
      href={`#${key}`}
      onClick={(event) => {
        event.preventDefault();
        onSelect(key);
      }}
    >
      {content}
    </a>
  );
  return (
    <>
      <AppNav
        label={
          <>
            <TextLink href="#clients">Clients</TextLink>
            <span aria-hidden className="px-1">
              /
            </span>
            <span className="text-foreground">{CLIENT.name}</span>
          </>
        }
        items={CLIENT_SECTIONS.map((section) => ({
          ...section,
          isActive: section.title === activeKey,
        }))}
        renderLink={(item, content) => renderLink(item.title, content)}
      />
      <AppNav
        label="Products"
        action={
          <IconButton label="Add product" variant="ghost" size="icon-xs">
            <Plus />
          </IconButton>
        }
        items={PRODUCTS.map((product) => ({
          title: product,
          icon: Package,
          items: PRODUCT_SECTIONS.map((section) => ({
            title: section,
            key: productKey(product, section),
            isActive: productKey(product, section) === activeKey,
          })),
        }))}
        renderLink={(item, content) => renderLink("key" in item ? item.key : item.title, content)}
      />
    </>
  );
}

function AutosaveStatus({ saving = false }: { saving?: boolean }) {
  return (
    <Inline justify="end" gap="sm" className="min-h-6 text-xs text-muted-foreground">
      {saving ? <Spinner /> : null}
      {saving ? "Saving…" : `Last updated ${CLIENT.updated}`}
    </Inline>
  );
}

function LanguagePicker({ includeAllLanguages = false }: { includeAllLanguages?: boolean }) {
  const [value, setValue] = useState(includeAllLanguages ? "all" : "en-us");
  const options = [
    ...(includeAllLanguages ? [{ id: "all", label: "All languages" }] : []),
    ...CLIENT_LANGUAGES,
  ];
  const label = options.find((option) => option.id === value)?.label;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm">
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={value} onValueChange={setValue}>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.id} value={option.id}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Plus />
          Add language
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AddButton({ label }: { label: string }) {
  return (
    <IconButton label={label} size="icon-sm">
      <Plus />
    </IconButton>
  );
}

function RowMenu({ label, canChangeScope = false }: { label: string; canChangeScope?: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="dots" aria-label={label}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Edit</DropdownMenuItem>
        {canChangeScope ? <DropdownMenuItem>Change scope</DropdownMenuItem> : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function RuleRow({
  title,
  description,
  href,
  menu,
}: {
  title: string;
  description?: string;
  href?: string;
  menu: ReactNode;
}) {
  return (
    <Item data-row>
      <ItemContent>
        <ItemTitle>
          {href ? (
            <TextLink tone="default" href={href}>
              {title}
            </TextLink>
          ) : (
            title
          )}
        </ItemTitle>
        {description ? <ItemDescription>{description}</ItemDescription> : null}
      </ItemContent>
      <ItemActions>{menu}</ItemActions>
    </Item>
  );
}

function ClientCodeField({ error }: { error?: string }) {
  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor="client-code">Client code</FieldLabel>
      <Input
        id="client-code"
        defaultValue={CLIENT.code}
        placeholder="ACME"
        maxLength={4}
        autoComplete="off"
        className="font-mono uppercase"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "client-code-error" : undefined}
      />
      {error ? <FieldError id="client-code-error">{error}</FieldError> : null}
      <FieldDescription>Exactly four letters or digits, unique across clients.</FieldDescription>
    </Field>
  );
}

function GeneralSection({ codeError }: { codeError?: string }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  return (
    <>
      <PageHeader
        title="General"
        description="How this client appears in settings and session selection."
      />
      <FieldGroup className="max-w-md">
        <Field>
          <FieldLabel htmlFor="client-name">Full client name</FieldLabel>
          <Input id="client-name" defaultValue={CLIENT.name} maxLength={200} autoComplete="off" />
          <FieldDescription>The client&apos;s full name.</FieldDescription>
        </Field>
        <ClientCodeField error={codeError} />
      </FieldGroup>
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
              <Button variant="ghost" size="sm" onClick={() => setDeleteOpen(true)}>
                Delete
              </Button>
            </ItemActions>
          </Item>
        </ItemGroup>
      </PageSection>
      <DestructiveActionDialog
        variant="typed"
        resourceName={CLIENT.name}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete ${CLIENT.name}?`}
        description="This permanently deletes the client and everything attached. This cannot be undone."
        confirmLabel="Delete client"
        onConfirm={() => setDeleteOpen(false)}
      />
    </>
  );
}

function LanguagesSection() {
  return (
    <>
      <PageHeader
        title="Languages"
        description="Each language has its own source-of-truth rules."
        actions={<AddButton label="Add language" />}
      />
      <ItemGroup>
        {CLIENT_LANGUAGES.map((language) => (
          <Item key={language.id}>
            <ItemMedia>
              <Languages aria-hidden />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{language.label}</ItemTitle>
            </ItemContent>
            <ItemActions>
              {language.isDefault ? (
                <Badge variant="secondary">
                  <Star aria-hidden />
                  Default
                </Badge>
              ) : null}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="dots" aria-label={`Actions for ${language.label}`}>
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Rename</DropdownMenuItem>
                  {language.isDefault ? null : (
                    <>
                      <DropdownMenuItem>Set as default</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    </>
  );
}

const customRuleHref = (rule: CustomRule) => (rule.kind === "text" ? undefined : `#${rule.id}`);

function CustomRulesSection({ rules }: { rules: CustomRule[] }) {
  return (
    <>
      <AutosaveStatus />
      <PageHeader
        title="Custom rules"
        description="These rules apply to every language, including languages added later."
        actions={
          <>
            <LanguagePicker includeAllLanguages />
            <AddButton label="Add custom rule: All languages" />
          </>
        }
      />
      {rules.length > 0 ? (
        <ItemGroup>
          {rules.map((rule) => (
            <RuleRow
              key={rule.id}
              title={rule.title}
              description={rule.description}
              href={customRuleHref(rule)}
              menu={<RowMenu label="Custom rule actions" canChangeScope />}
            />
          ))}
        </ItemGroup>
      ) : (
        <EmptyState
          title="No all-language rules yet"
          description="Add a text rule or PDF that applies across this client’s languages."
        />
      )}
    </>
  );
}

function ProductNeverSaySection() {
  return (
    <>
      <AutosaveStatus saving />
      <PageHeader
        title="Never say"
        description="Banned phrasing the Agent should flag when it appears in creative."
        actions={<AddButton label="Add" />}
      />
      <ItemGroup>
        {NEVER_SAY_RULES.map((rule) => (
          <RuleRow
            key={rule.id}
            title={rule.term}
            description={rule.note}
            menu={<RowMenu label="Rule actions" />}
          />
        ))}
      </ItemGroup>
    </>
  );
}

function DisclaimersEmptySection() {
  return (
    <>
      <AutosaveStatus />
      <PageHeader
        title="Disclaimers"
        description="Required disclaimers that must appear on screen, in captions, or spoken."
        actions={
          <>
            <LanguagePicker />
            <AddButton label="Add" />
          </>
        }
      />
      <EmptyState
        title="No disclaimers yet"
        description="Add a disclaimer that must appear in creative."
      />
    </>
  );
}

function ClientSettingsShell({
  initialKey,
  children,
}: {
  initialKey: string;
  children: ReactNode;
}) {
  const [activeKey, setActiveKey] = useState(initialKey);
  return (
    <AppShell
      sidebarWidth="240px"
      headerVariant="plain"
      sidebarHeader={
        <div className="px-2.5 py-1.5">
          <PageBackLink href="#sessions">Back to app</PageBackLink>
        </div>
      }
      sidebar={<SettingsSidebar activeKey={activeKey} onSelect={setActiveKey} />}
    >
      <Page size="narrow">{children}</Page>
    </AppShell>
  );
}

const meta = {
  title: "Screens/Proof Agent/Client settings",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The client's General section: name and code save on blur, then the danger zone (delete opens the typed confirmation). */
export const Default: Story = {
  render: () => (
    <ClientSettingsShell initialKey="General">
      <GeneralSection />
    </ClientSettingsShell>
  ),
};

/** All-language custom rules: a document, two text rules and a link the review cannot read, under the language picker and autosave status. */
export const CustomRules: Story = {
  render: () => (
    <ClientSettingsShell initialKey="Custom rules">
      <CustomRulesSection rules={CUSTOM_RULES} />
    </ClientSettingsShell>
  ),
};

/** Adding a document rule, after choosing PDF in the source picker. */
export const AddDocumentRule: Story = {
  render: () => (
    <ClientSettingsShell initialKey="Custom rules">
      <CustomRulesSection rules={CUSTOM_RULES} />
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New document rule</DialogTitle>
            <DialogDescription>Applies to: All languages</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel>File</FieldLabel>
              <Dropzone
                accept="application/pdf"
                maxSize={25 * 1024 * 1024}
                title="Drop a PDF or click to choose"
                description="PDF · up to 25 MB"
                onFiles={() => undefined}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="rule-title">Title</FieldLabel>
              <Input id="rule-title" placeholder="Rule title" />
            </Field>
            <Field>
              <FieldLabel htmlFor="rule-note">Note (optional)</FieldLabel>
              <Input id="rule-note" placeholder="Optional note for the Agent" />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button disabled>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ClientSettingsShell>
  ),
};

/** The client's languages, the default one starred. */
export const LanguagesList: Story = {
  render: () => (
    <ClientSettingsShell initialKey="Languages">
      <LanguagesSection />
    </ClientSettingsShell>
  ),
};

/** A product's Never say rules in the nested sidebar group, saving after an edit; products have no languages, so no picker. */
export const ProductNeverSay: Story = {
  render: () => (
    <ClientSettingsShell initialKey={productKey("Oura Ring 4", "Never say")}>
      <ProductNeverSaySection />
    </ClientSettingsShell>
  ),
};

/** A section with nothing in it yet. */
export const Empty: Story = {
  render: () => (
    <ClientSettingsShell initialKey="Disclaimers">
      <DisclaimersEmptySection />
    </ClientSettingsShell>
  ),
};

/** A client code another client already uses: the field reverts and says why. */
export const CodeTaken: Story = {
  render: () => (
    <ClientSettingsShell initialKey="General">
      <GeneralSection codeError="Another client already uses that code." />
    </ClientSettingsShell>
  ),
};

/** The settings route while it loads, as the app's loading.tsx renders it. */
export const Loading: Story = {
  render: () => (
    <ClientSettingsShell initialKey="General">
      <Inline justify="center" className="py-16">
        <Spinner label="Loading settings" />
      </Inline>
    </ClientSettingsShell>
  ),
};
