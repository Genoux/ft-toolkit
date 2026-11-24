import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../src/components/carousel";
import { PersonIdentity } from "../../src/components/person-identity";
import { PEOPLE } from "../lib/fixtures";

const VIDEOS = PEOPLE.flatMap((person, index) => [
  { id: `${person.id}-a`, creator: person, title: "Morning pour", views: 12_400 + index * 3100 },
  { id: `${person.id}-b`, creator: person, title: "Kitchen demo", views: 8_200 + index * 1700 },
]);

const meta = {
  title: "Organisms/Carousel",
  component: Carousel,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A row of video tiles with previous and next in the header; the arrow keys scroll too. Previous is disabled at the start. */
export const AllStates: Story = {
  render: () => (
    <Carousel
      className="flex w-2xl flex-col gap-3"
      opts={{ align: "start", slidesToScroll: "auto" }}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Latest deliveries</div>
        <div className="flex items-center gap-1">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </div>
      <CarouselContent className="gap-3">
        {VIDEOS.map((video) => (
          <CarouselItem key={video.id} className="basis-auto">
            <div className="flex w-36 flex-col gap-2">
              <div className="flex aspect-9/16 items-end rounded-lg bg-muted p-2 text-xs text-muted-foreground tabular-nums">
                {video.views.toLocaleString("en-US")} views
              </div>
              <div className="flex flex-col gap-1">
                <div className="truncate text-sm font-medium">{video.title}</div>
                <PersonIdentity name={video.creator.name} imageUrl={video.creator.imageUrl} />
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  ),
};

export const WithoutControls: Story = {
  render: () => (
    <Carousel className="w-xl" opts={{ align: "start", slidesToScroll: "auto" }}>
      <CarouselContent>
        {VIDEOS.map((video) => (
          <CarouselItem key={video.id} className="basis-auto">
            <div className="flex aspect-9/16 w-32 items-end rounded-lg bg-muted p-2 text-xs text-muted-foreground">
              {video.title}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  ),
};
