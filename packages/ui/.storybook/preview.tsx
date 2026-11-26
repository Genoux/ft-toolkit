import "./preview.css";
import type { Decorator, Preview } from "@storybook/react-vite";
import { Toaster } from "../src/components/sonner";
import { TooltipProvider } from "../src/components/tooltip";
import fieldtripCss from "./fieldtrip-preview.css?inline";

const withAppProviders: Decorator = (Story) => (
  <TooltipProvider>
    <Story />
    <Toaster />
  </TooltipProvider>
);

// The brand layer is a stylesheet an app imports, so Storybook switches it by mounting it.
const withBrand: Decorator = (Story, context) => (
  <>
    {context.globals.brand === "fieldtrip" ? <style>{fieldtripCss}</style> : null}
    <Story />
  </>
);

const preview: Preview = {
  tags: ["autodocs"],
  globalTypes: {
    brand: {
      description: "Brand layer",
      toolbar: {
        title: "Brand",
        icon: "paintbrush",
        items: [
          { value: "neutral", title: "Neutral" },
          { value: "fieldtrip", title: "Fieldtrip" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { brand: "neutral", viewport: { value: "desktop", isRotated: false } },
  parameters: {
    // Desktop first: every story opens at 1440×900; phone and tablet stay one click away in the toolbar.
    viewport: {
      options: {
        desktop: { name: "Desktop", styles: { width: "1440px", height: "900px" }, type: "desktop" },
        laptop: { name: "Laptop", styles: { width: "1280px", height: "800px" }, type: "desktop" },
        tablet: { name: "Tablet", styles: { width: "834px", height: "1112px" }, type: "tablet" },
        mobile2: { name: "Phone", styles: { width: "390px", height: "844px" }, type: "mobile" },
      },
    },
    layout: "centered",
    controls: { expanded: true },
    a11y: { test: "todo" },
    options: {
      storySort: {
        order: [
          "Foundations",
          "Atoms",
          "Molecules",
          "Organisms",
          "Screens",
          ["Pool", "Impact and Recognition", "Proof Agent", "Shared"],
        ],
      },
    },
  },
  decorators: [withAppProviders, withBrand],
};

export default preview;
