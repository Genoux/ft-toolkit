import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus } from "lucide-react";
import { Badge } from "../../src/components/badge";
import { Button } from "../../src/components/button";
import { Card } from "../../src/components/card";
import { DataTableShell } from "../../src/components/data-table-shell";
import { EmptyState } from "../../src/components/empty-state";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../../src/components/field";
import { Input } from "../../src/components/input";
import { LabeledField } from "../../src/components/labeled-field";
import { Page, PageHeader, PageSection } from "../../src/components/page";
import { PersonIdentity } from "../../src/components/person-identity";
import { SearchInput } from "../../src/components/search-input";
import { Separator } from "../../src/components/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../src/components/table";
import { Tabs, TabsContent, TabsList } from "../../src/components/tabs";
import { Textarea } from "../../src/components/textarea";
import { PEOPLE } from "../lib/fixtures";

// The page patterns of the ib-ui skill, one story each. Apps copy the composition, not the data.

const meta = {
  title: "Layout/Page",
  component: Page,
  parameters: { layout: "fullscreen" },
  globals: { viewport: { value: "desktop", isRotated: false } },
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

function PeopleTable() {
  return (
    <DataTableShell>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {PEOPLE.map((person) => (
            <TableRow key={person.id}>
              <TableCell>
                <PersonIdentity name={person.name} imageUrl={person.imageUrl} />
              </TableCell>
              <TableCell>
                <Badge variant="secondary">Active</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">Apr 30, 2027</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DataTableShell>
  );
}

export const ListPage: Story = {
  render: () => (
    <Page>
      <PageHeader
        title="Creators"
        description="Everyone who applied to a campaign."
        actions={
          <Button size="sm">
            <Plus />
            Add creator
          </Button>
        }
      />
      <PageSection>
        <SearchInput
          value=""
          onChange={() => undefined}
          placeholder="Search creators"
          className="max-w-xs"
        />
        <PeopleTable />
      </PageSection>
    </Page>
  ),
};

export const EmptyListPage: Story = {
  render: () => (
    <Page>
      <PageHeader title="Creators" description="Everyone who applied to a campaign." />
      <EmptyState
        title="No creators yet"
        description="Creators show up here once they apply to a campaign."
        action={{ label: "Add creator", icon: Plus, onClick: () => undefined }}
      />
    </Page>
  ),
};

export const DetailPage: Story = {
  render: () => (
    <Page>
      <PageHeader
        title="Alex Morgan"
        description="Lifestyle creator, joined Apr 30, 2027."
        actions={
          <Button variant="secondary" size="sm">
            Edit
          </Button>
        }
      />
      <Tabs defaultValue="overview" className="flex flex-col gap-6">
        <TabsList
          tabs={[
            { value: "overview", label: "Overview" },
            { value: "campaigns", label: "Campaigns", count: 3 },
          ]}
        />
        <TabsContent value="overview" className="flex flex-col gap-8">
          <PageSection title="Profile">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["Email", "alex@example.com"],
                ["Country", "Canada"],
                ["Rate", "$450 per video"],
              ].map(([label, value]) => (
                <Card key={label}>
                  <LabeledField label={label} value={value} />
                </Card>
              ))}
            </div>
          </PageSection>
          <PageSection title="Recent collaborations">
            <PeopleTable />
          </PageSection>
        </TabsContent>
      </Tabs>
    </Page>
  ),
};

export const FormPage: Story = {
  render: () => (
    <Page size="narrow">
      <PageHeader title="Settings" description="How your workspace appears to clients." />
      <PageSection title="Workspace" description="Shown on every shared link.">
        <Card>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="workspace-name">Name</FieldLabel>
              <Input id="workspace-name" defaultValue="Fieldtrip" />
            </Field>
            <Field>
              <FieldLabel htmlFor="workspace-about">About</FieldLabel>
              <Textarea id="workspace-about" />
              <FieldDescription>One or two sentences.</FieldDescription>
            </Field>
          </FieldGroup>
          <Separator />
          <Button size="sm" className="self-end">
            Save
          </Button>
        </Card>
      </PageSection>
    </Page>
  ),
};

export const OverviewPage: Story = {
  render: () => (
    <Page>
      <PageHeader title="Overview" description="This month across every campaign." />
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Applications", "128"],
          ["Approved", "42"],
          ["Spent", "$12,400"],
        ].map(([label, value]) => (
          <Card key={label} className="gap-1">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="text-xl font-semibold">{value}</div>
          </Card>
        ))}
      </div>
      <PageSection title="Newest creators">
        <PeopleTable />
      </PageSection>
    </Page>
  ),
};
