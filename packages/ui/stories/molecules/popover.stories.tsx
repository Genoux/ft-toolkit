import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckIcon, PackageIcon, PlusIcon } from "lucide-react";
import { Fragment, useState } from "react";
import { Button } from "../../src/components/button";
import { IconButton } from "../../src/components/icon-button";
import { MultiSelectOptionList } from "../../src/components/multi-select-popover";
import { Popover, PopoverContent, PopoverTrigger } from "../../src/components/popover";
import { Separator } from "../../src/components/separator";
import { cn } from "../../src/lib/utils";
import { CLIENT_LANGUAGES, PRODUCTS } from "../screens/proof-agent/fixtures";

const meta = {
  title: "Molecules/Popover",
  component: Popover,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

const LANGUAGE_OPTIONS = [{ id: "all", label: "All languages" }, ...CLIENT_LANGUAGES];

/** Proof, features/clients/components/_components/sst/client-language-picker.tsx. */
function ClientLanguagePicker({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [value, setValue] = useState("en-us");
  const [open, setOpen] = useState(defaultOpen);
  const triggerLabel = LANGUAGE_OPTIONS.find((language) => language.id === value)?.label;
  return (
    <Popover modal={false} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="sm">
          {triggerLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-52 p-1"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        {LANGUAGE_OPTIONS.map((language) => {
          const isSelected = value === language.id;
          return (
            <Fragment key={language.id}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setValue(language.id);
                  setOpen(false);
                }}
                className={cn(
                  "w-full justify-start rounded-lg font-normal",
                  isSelected && "font-medium",
                )}
              >
                <span className="min-w-0 flex-1 truncate text-left">{language.label}</span>
                {isSelected ? <CheckIcon aria-hidden /> : null}
              </Button>
              {language.id === "all" ? <Separator className="my-1" /> : null}
            </Fragment>
          );
        })}
        <Separator className="my-1" />
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start rounded-lg font-normal text-muted-foreground"
        >
          <PlusIcon aria-hidden />
          Add language
        </Button>
      </PopoverContent>
    </Popover>
  );
}

/** Proof, features/sessions/components/session-product-selector.tsx. */
function ProductSelector({
  defaultOpen = false,
  products = PRODUCTS,
}: {
  defaultOpen?: boolean;
  products?: string[];
}) {
  const [selected, setSelected] = useState([PRODUCTS[0] ?? ""]);
  return (
    <Popover defaultOpen={defaultOpen} modal={false}>
      <PopoverTrigger asChild>
        <IconButton label="Select products" variant="ghost">
          <PackageIcon />
        </IconButton>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 overflow-hidden p-0">
        <MultiSelectOptionList
          options={products.map((product) => ({ value: product, label: product }))}
          selectedValues={selected}
          onToggle={(value) =>
            setSelected((current) =>
              current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current, value],
            )
          }
          emptyMessage="No products found."
          idPrefix={`products-${products.length}`}
        />
      </PopoverContent>
    </Popover>
  );
}

export const AllStates: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Proof's client language picker: a padded `p-1` panel of rows, a rule under All languages and the Add language action at the foot.",
      },
    },
  },
  render: () => (
    <div className="h-80">
      <ClientLanguagePicker defaultOpen />
    </div>
  ),
};

export const OptionList: Story = {
  parameters: {
    docs: {
      description: {
        story: "Proof's session product selector: a MultiSelectOptionList in an unpadded panel.",
      },
    },
  },
  render: () => (
    <div className="h-64">
      <ProductSelector defaultOpen />
    </div>
  ),
};

export const Empty: Story = {
  parameters: {
    docs: { description: { story: "The same selector for a client with no products." } },
  },
  render: () => (
    <div className="h-64">
      <ProductSelector defaultOpen products={[]} />
    </div>
  ),
};
