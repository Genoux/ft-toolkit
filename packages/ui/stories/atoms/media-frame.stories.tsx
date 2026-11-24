import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileText, Film, Play } from "lucide-react";
import { Badge } from "../../src/components/badge";
import { MediaFrame, MediaFrameOverlay } from "../../src/components/media-frame";
import { VariantGrid } from "../lib/variant-grid";

const photo = (seed: number, size = 480) => `https://i.pravatar.cc/${size}?img=${seed}`;

const ASPECTS = ["square", "4/5", "9/16", "video"] as const;
const STATES = ["image", "empty", "loading", "broken"] as const;

function StateFrame({
  aspect,
  state,
}: {
  aspect: (typeof ASPECTS)[number];
  state: (typeof STATES)[number];
}) {
  return (
    <MediaFrame
      aspect={aspect}
      className="w-28"
      alt="Maya Chen, creator photo"
      src={
        state === "image" ? photo(5) : state === "broken" ? "https://invalid.example/x.jpg" : null
      }
      loading={state === "loading"}
    />
  );
}

const meta = {
  title: "Atoms/MediaFrame",
  component: MediaFrame,
  parameters: { layout: "padded" },
  args: { src: photo(5), alt: "Maya Chen, creator photo", aspect: "4/5", className: "w-56" },
  argTypes: { aspect: { control: "inline-radio", options: ASPECTS } },
} satisfies Meta<typeof MediaFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every aspect with an image, no image, loading and an image that failed to load. */
export const AllStates: Story = {
  render: () => (
    <VariantGrid
      rows={ASPECTS}
      columns={STATES}
      renderCell={(aspect, state) => <StateFrame aspect={aspect} state={state} />}
    />
  ),
};

export const Playground: Story = {};

/** A small square is a thumbnail tile: the asset's kind as the icon, or a spinner while it is analysed. */
export const Thumbnails: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <MediaFrame aspect="square" className="size-11" alt="Hook video" icon={Film} />
      <MediaFrame aspect="square" className="size-11" alt="Script" icon={FileText} />
      <MediaFrame aspect="square" className="size-11" alt="Product photo" src={photo(12, 96)} />
      <MediaFrame aspect="square" className="size-11" alt="Unboxing video" icon={Film} loading />
    </div>
  ),
};

/** Children draw over the media: a play mark and the duration on a video poster. */
export const VideoPoster: Story = {
  render: () => (
    <MediaFrame aspect="9/16" radius="xl" className="w-40" alt="Unboxing, take two" src={photo(32)}>
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex size-9 items-center justify-center rounded-full bg-background/80 text-foreground">
          <Play aria-hidden className="size-4 fill-current" />
        </span>
      </span>
      <Badge variant="secondary" size="sm" className="absolute right-2 bottom-2 tabular-nums">
        0:34
      </Badge>
    </MediaFrame>
  ),
};

/** A bottom scrim keeps white text readable on any photo; `interactive` zooms the photo while the card is hovered or its link has keyboard focus (not under reduced motion). */
export const ScrimAndZoom: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {[
        { seed: 5, name: "Jade Rivera", country: "United States", rate: "$250-$400" },
        { seed: 49, name: "Noah Fischer", country: "Canada", rate: "Rate TBD" },
      ].map((creator) => (
        <a
          key={creator.name}
          href="#creator"
          className="rounded-xl outline-none focus-visible:focus-ring"
        >
          <MediaFrame
            src={photo(creator.seed, 640)}
            alt={creator.name}
            radius="xl"
            scrim="bottom"
            interactive
            className="w-64"
          >
            <MediaFrameOverlay placement="top">
              <Badge variant="secondary">Top creator</Badge>
            </MediaFrameOverlay>
            <MediaFrameOverlay>
              <span className="truncate text-xl font-semibold">{creator.name}</span>
              <span className="text-sm text-white/80">{creator.country}</span>
              <span className="text-sm font-semibold text-white/80">{creator.rate}</span>
            </MediaFrameOverlay>
          </MediaFrame>
        </a>
      ))}
      <MediaFrame alt="No photo yet" radius="xl" scrim="bottom" className="w-64">
        <MediaFrameOverlay>
          <span className="text-xl font-semibold">Isabela Costa</span>
          <span className="text-sm text-white/80">Brazil</span>
        </MediaFrameOverlay>
      </MediaFrame>
    </div>
  ),
};

/** A top scrim for a filename and an action along the top edge of a video poster. */
export const TopScrim: Story = {
  render: () => (
    <MediaFrame
      aspect="9/16"
      scrim="top"
      className="w-52"
      alt="Oura - morning routine.mp4"
      src={photo(16)}
    >
      <MediaFrameOverlay placement="top" className="items-center p-1 pl-3">
        <span className="truncate text-xs">Oura - morning routine.mp4</span>
        <Badge variant="secondary" size="sm">
          0:34
        </Badge>
      </MediaFrameOverlay>
    </MediaFrame>
  ),
};
