"use client";

import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { cn } from "../lib/utils";
import { IconButton } from "./icon-button";

type CarouselOptions = Parameters<typeof useEmblaCarousel>[0];

type CarouselContextValue = {
  carouselRef: UseEmblaCarouselType[0];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
};

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) throw new Error("useCarousel must be used within a <Carousel />");
  return context;
}

function Carousel({
  opts,
  scrollDuration,
  className,
  children,
  ...props
}: React.ComponentProps<"section"> & {
  opts?: CarouselOptions;
  /** Embla scrolls with physics, not easing: higher is slower. Embla's default is 25. */
  scrollDuration?: number;
}) {
  const [carouselRef, api] = useEmblaCarousel({
    ...opts,
    ...(scrollDuration !== undefined && { duration: scrollDuration }),
  });

  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  React.useEffect(() => {
    if (!api) return;
    const syncButtons = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };
    syncButtons();
    api.on("select", syncButtons).on("reInit", syncButtons);
    return () => {
      api.off("select", syncButtons).off("reInit", syncButtons);
    };
  }, [api]);

  const scrollPrev = () => api?.scrollPrev();
  const scrollNext = () => api?.scrollNext();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollPrev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollNext();
    }
  };

  return (
    <CarouselContext.Provider
      value={{ carouselRef, scrollPrev, scrollNext, canScrollPrev, canScrollNext }}
    >
      <section
        onKeyDownCapture={handleKeyDown}
        className={cn("relative", className)}
        aria-label="Carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </section>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef } = useCarousel();

  return (
    <div ref={carouselRef} className="overflow-x-auto" data-slot="carousel-content">
      <div className={cn("flex h-full gap-2 backface-hidden touch-pan-y", className)} {...props} />
    </div>
  );
}

/** Embla needs fixed item widths to compute snaps: override `basis-full` (e.g. `basis-auto`, `basis-1/4`). */
function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  useCarousel();

  return (
    <div
      data-slot="carousel-item"
      className={cn("min-w-0 shrink-0 grow-0 basis-full [&_video]:touch-pan-y", className)}
      {...props}
    />
  );
}

type CarouselButtonProps = Omit<
  React.ComponentProps<typeof IconButton>,
  "label" | "onClick" | "children" | "pressed" | "pressedLabel"
> & { label?: string };

/** Scrolls back one page; disabled at the start. Place it where the design wants, such as a header beside CarouselNext. */
function CarouselPrevious({ label = "Previous", size = "icon-sm", ...props }: CarouselButtonProps) {
  const { scrollPrev, canScrollPrev } = useCarousel();
  return (
    <IconButton
      data-slot="carousel-previous"
      label={label}
      size={size}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ChevronLeft />
    </IconButton>
  );
}

function CarouselNext({ label = "Next", size = "icon-sm", ...props }: CarouselButtonProps) {
  const { scrollNext, canScrollNext } = useCarousel();
  return (
    <IconButton
      data-slot="carousel-next"
      label={label}
      size={size}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ChevronRight />
    </IconButton>
  );
}

export { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious };
