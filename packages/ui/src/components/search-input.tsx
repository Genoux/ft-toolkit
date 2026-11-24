"use client";

import { Search, X } from "lucide-react";
import type * as React from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Spinner } from "./spinner";
import { cn } from "../lib/utils";

interface SearchInputProps extends Omit<React.ComponentProps<typeof Input>, "onChange" | "value"> {
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
}

export function SearchInput({
  value,
  onChange,
  isLoading,
  placeholder = "Search…",
  size = "default",
  className,
  onKeyDown,
  ...props
}: SearchInputProps) {
  const showClear = value.length > 0;
  const iconClassName = cn(
    "pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-subtle-foreground",
    size === "sm" ? "left-3" : "left-3.5",
  );

  return (
    <div className={cn("relative min-w-56 w-80 max-w-full", className)}>
      {isLoading ? (
        <Spinner className={iconClassName} />
      ) : (
        <Search className={iconClassName} aria-hidden />
      )}
      <Input
        {...props}
        type="search"
        size={size}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented || event.key !== "Escape" || !showClear) return;
          event.preventDefault();
          onChange("");
        }}
        placeholder={placeholder}
        className={cn(
          "pl-10 data-[size=sm]:pl-9 [&::-webkit-search-cancel-button]:appearance-none",
          showClear && "pr-10 data-[size=sm]:pr-9",
        )}
      />
      {showClear && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label="Clear search"
          onClick={() => onChange("")}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 text-subtle-foreground hover:text-foreground",
            size === "sm" ? "right-0.5" : "right-1",
          )}
        >
          <X aria-hidden strokeWidth={3} />
        </Button>
      )}
    </div>
  );
}
