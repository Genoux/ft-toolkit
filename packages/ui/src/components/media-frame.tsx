"use client";

import { ImageIcon, type LucideIcon } from "lucide-react";
import { type ComponentProps, type ReactNode, useState } from "react";
import { cn } from "../lib/utils";
import { Spinner } from "./spinner";

// Black and white, not theme tokens: a photo is as dark or as light in either theme, so the scrim
// and the text on it stay the same in dark mode.
const SCRIM_CLASS_NAME = {
  bottom: "bg-linear-to-t from-black/80 via-black/45 via-30% to-transparent to-60%",
  top: "bg-linear-to-b from-black/50 to-transparent to-35%",
} as const;

const OVERLAY_PLACEMENT_CLASS_NAME = {
  top: "inset-x-0 top-0 items-start justify-between",
  bottom: "inset-x-0 bottom-0 flex-col justify-end",
} as const;

const ASPECT_CLASS_NAME = {
  square: "aspect-square",
  "4/5": "aspect-4/5",
  "9/16": "aspect-9/16",
  video: "aspect-video",
} as const;

type MediaFrameProps = Omit<ComponentProps<"div">, "children"> & {
  /** An image, or a video's poster frame. Without it, or when it fails to load, the fallback icon shows. */
  src?: string | null;
  /** Describes the media; announced for the fallback too. */
  alt: string;
  aspect?: keyof typeof ASPECT_CLASS_NAME;
  /** `lg` (12px) for thumbnails and grid tiles, `xl` (16px) for a hero photo. */
  radius?: "lg" | "xl";
  /** The fallback's icon: the media's kind (a video, a document) when there is nothing to show. */
  icon?: LucideIcon;
  /** Media still being made or uploaded: a spinner in place of the fallback icon. */
  loading?: boolean;
  /** Overlays drawn above the media, such as a duration badge or a play mark. */
  children?: ReactNode;
  /** Loads the image at once and first, for the hero photo above the fold; thumbnails stay lazy. */
  priority?: boolean;
  /** A dark gradient from that edge, so white text in a `MediaFrameOverlay` reads on any photo. */
  scrim?: keyof typeof SCRIM_CLASS_NAME;
  /** The photo zooms in slightly while the frame is hovered or the link around it has keyboard focus; still under reduced motion. */
  interactive?: boolean;
};

/** A fixed-aspect frame for photos and video posters; at a small size (`className="size-11"`) it is a square thumbnail tile. */
function MediaFrame({
  src,
  alt,
  aspect = "4/5",
  radius = "lg",
  icon: Icon = ImageIcon,
  loading = false,
  priority = false,
  scrim,
  interactive = false,
  className,
  children,
  ...props
}: MediaFrameProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showsImage = Boolean(src) && failedSrc !== src && !loading;

  return (
    <div
      data-slot="media-frame"
      data-aspect={aspect}
      data-state={loading ? "loading" : showsImage ? "loaded" : "empty"}
      data-scrim={scrim}
      aria-busy={loading || undefined}
      className={cn(
        "group/media-frame @container/media-frame relative isolate flex shrink-0 items-center justify-center overflow-hidden bg-muted text-subtle-foreground",
        ASPECT_CLASS_NAME[aspect],
        radius === "xl" ? "rounded-xl" : "rounded-lg",
        className,
      )}
      {...props}
    >
      {showsImage && src ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          onError={() => setFailedSrc(src)}
          className={cn(
            "absolute inset-0 size-full object-cover",
            interactive &&
              "transition-transform duration-(--duration-slow) ease-out-expo motion-safe:group-hover/media-frame:scale-105 motion-safe:in-focus-visible:scale-105",
          )}
        />
      ) : loading ? (
        <Spinner label={`Loading ${alt}`} className="@3xs/media-frame:size-5" />
      ) : (
        // The name sits on the fallback, not the frame: role="img" on the frame would hide
        // interactive overlays passed as children from assistive tech.
        <span role="img" aria-label={alt} className="flex">
          <Icon aria-hidden className="size-4 @3xs/media-frame:size-6" />
        </span>
      )}
      {scrim ? (
        <span
          aria-hidden
          className={cn("pointer-events-none absolute inset-0", SCRIM_CLASS_NAME[scrim])}
        />
      ) : null}
      {children}
    </div>
  );
}

type MediaFrameOverlayProps = ComponentProps<"div"> & {
  /** `top` lays its children in a row with the ends apart (a badge, a download button); `bottom` stacks them above the bottom edge (a name and its details). */
  placement?: keyof typeof OVERLAY_PLACEMENT_CLASS_NAME;
};

/** Text and controls laid on the photo, inset by the card padding; white over a `scrim`. */
function MediaFrameOverlay({ placement = "bottom", className, ...props }: MediaFrameOverlayProps) {
  return (
    <div
      data-slot="media-frame-overlay"
      data-placement={placement}
      className={cn(
        "absolute flex min-w-0 gap-(--gap-sm) p-(--gap-md) text-left in-data-scrim:text-white",
        OVERLAY_PLACEMENT_CLASS_NAME[placement],
        className,
      )}
      {...props}
    />
  );
}

export { MediaFrame, MediaFrameOverlay };
