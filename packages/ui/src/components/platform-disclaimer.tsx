"use client";

import { motion } from "motion/react";
import { useLayoutEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Button } from "./button";

const DISMISS_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function isDismissed(cookieName: string): boolean {
  return document.cookie.split("; ").includes(`${cookieName}=1`);
}

function persistDismissed(cookieName: string) {
  // biome-ignore lint/suspicious/noDocumentCookie: CookieStore API lacks Safari support
  document.cookie = `${cookieName}=1; path=/; max-age=${DISMISS_MAX_AGE_SECONDS}; SameSite=Lax`;
}

type PlatformDisclaimerProps = {
  title: string;
  description: string;
  cookieName: string;
};

function PlatformDisclaimer({ title, description, cookieName }: PlatformDisclaimerProps) {
  const [dismissed, setDismissed] = useState<boolean | null>(null);

  useLayoutEffect(() => {
    setDismissed(isDismissed(cookieName));
  }, [cookieName]);

  if (dismissed !== false) return null;

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-40 sm:inset-x-auto sm:right-6 sm:bottom-6">
      <motion.div
        className="pointer-events-auto sm:max-w-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 2 }}
      >
        <Alert className="flex items-center justify-between gap-6 rounded-xl py-4 pr-4 pl-5 shadow-elevated">
          <div className="flex min-w-0 flex-col gap-0.5">
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription className="text-[13px]">{description}</AlertDescription>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="shrink-0"
            onClick={() => {
              persistDismissed(cookieName);
              setDismissed(true);
            }}
          >
            Got it
          </Button>
        </Alert>
      </motion.div>
    </div>
  );
}

export { PlatformDisclaimer };
