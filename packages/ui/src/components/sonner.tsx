"use client";

import { CircleCheckIcon, InfoIcon, OctagonXIcon, TriangleAlertIcon } from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { Spinner } from "./spinner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-success" />,
        info: <InfoIcon className="size-4 text-info" />,
        warning: <TriangleAlertIcon className="size-4 text-warning" />,
        error: <OctagonXIcon className="size-4 text-destructive" />,
        loading: <Spinner className="size-4 text-muted-foreground" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "color-mix(in oklab, var(--foreground) 5%, transparent)",
          "--border-radius": "calc(var(--radius) + 4px)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "!items-center !gap-3 !px-5 !py-4 !font-sans !shadow-elevated",
          // Sonner pulls the icon 3px left for its own 16px padding; on ours it broke the even inset.
          icon: "!mt-0.5 !ml-0 !size-4 !self-start",
          content: "!gap-0.5",
          title: "!text-sm !leading-5 !font-medium",
          description: "!text-xs !text-muted-foreground",
          actionButton:
            "!h-8 !self-center !rounded-full !bg-primary !px-3.5 !text-sm !font-medium !text-primary-foreground hover:!bg-primary/90",
          cancelButton:
            "!h-8 !self-center !rounded-full !bg-muted !px-3.5 !text-sm !font-medium !text-muted-foreground hover:!text-foreground",
          closeButton:
            "!border-border !bg-popover !text-muted-foreground hover:!bg-muted hover:!text-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
