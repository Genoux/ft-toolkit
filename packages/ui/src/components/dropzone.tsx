"use client";

import { CircleCheck, FileText, RotateCw, Upload, X } from "lucide-react";
import { type ChangeEvent, type DragEvent, type ReactNode, useId, useRef, useState } from "react";
import { cn } from "../lib/utils";
import { IconButton } from "./icon-button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "./item";
import { Progress } from "./progress";

const UNITS = ["B", "KB", "MB", "GB"] as const;

/** "2.4 MB" from a byte count. */
export function formatFileSize(bytes: number): string {
  const exponent = Math.min(UNITS.length - 1, Math.floor(Math.log(Math.max(bytes, 1)) / Math.log(1024)));
  const size = bytes / 1024 ** exponent;
  return `${exponent === 0 ? size : size.toFixed(1).replace(/\.0$/, "")} ${UNITS[exponent]}`;
}

/** Whether a file matches an `accept` string: extensions (".pdf"), exact types ("image/png") or wildcards ("image/*"). */
export function fileMatchesAccept(file: Pick<File, "name" | "type">, accept?: string): boolean {
  if (!accept) return true;
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();
  return accept
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)
    .some((token) =>
      token.startsWith(".")
        ? fileName.endsWith(token)
        : token.endsWith("/*")
          ? fileType.startsWith(token.slice(0, -1))
          : fileType === token,
    );
}

type DropzoneProps = {
  /** Called with the files that pass `accept` and `maxSize`, and those that don't, so the app can say why. */
  onFiles: (accepted: File[], rejected: File[]) => void;
  accept?: string;
  multiple?: boolean;
  /** Largest file in bytes. */
  maxSize?: number;
  disabled?: boolean;
  title?: ReactNode;
  /** The rules, such as "PDF or PNG, up to 10 MB". */
  description?: ReactNode;
  /** Turns the frame red and replaces the description, announced to screen readers. */
  error?: ReactNode;
  name?: string;
  id?: string;
  className?: string;
};

/** A drop area around a native file input: click or Enter/Space to browse, or drop files on it. Show what was picked as DropzoneFile rows under it. */
function Dropzone({
  onFiles,
  accept,
  multiple = false,
  maxSize,
  disabled = false,
  title = "Drop files here or browse",
  description,
  error,
  name,
  id,
  className,
}: DropzoneProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  // dragenter and dragleave fire for every child crossed, so count them instead of toggling.
  const dragDepth = useRef(0);
  const [dragging, setDragging] = useState(false);

  const submit = (fileList: FileList | null) => {
    const allFiles = Array.from(fileList ?? []);
    if (allFiles.length === 0) return;
    const [files, extraFiles] = multiple ? [allFiles, []] : [allFiles.slice(0, 1), allFiles.slice(1)];
    const isAccepted = (file: File) =>
      fileMatchesAccept(file, accept) && (maxSize === undefined || file.size <= maxSize);
    onFiles(files.filter(isAccepted), [...files.filter((file) => !isAccepted(file)), ...extraFiles]);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    submit(event.target.files);
    event.target.value = "";
  };

  const handleDragEnter = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (disabled) return;
    dragDepth.current += 1;
    setDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    if (!disabled) submit(event.dataTransfer.files);
  };

  const message = error ?? description;

  return (
    <label
      htmlFor={inputId}
      data-slot="dropzone"
      data-dragging={dragging || undefined}
      data-invalid={error ? true : undefined}
      data-disabled={disabled || undefined}
      onDragEnter={handleDragEnter}
      onDragOver={(event) => {
        event.preventDefault();
        if (disabled) event.dataTransfer.dropEffect = "none";
      }}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "group/dropzone flex w-full min-w-0 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-foreground/20 bg-card px-6 py-8 text-center",
        "transition-[background-color,border-color,box-shadow] duration-(--duration-fast) ease-out-expo",
        "hover:border-ring/60 hover:bg-muted/30",
        "has-[input:focus-visible]:focus-ring",
        "data-dragging:border-solid data-dragging:border-ring data-dragging:bg-accent/60",
        "data-invalid:border-destructive/60",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50 data-disabled:hover:border-foreground/20 data-disabled:hover:bg-card",
        className,
      )}
    >
      <input
        id={inputId}
        name={name}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        onChange={handleChange}
        className="sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "mb-1.5 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground",
          "transition-transform duration-(--duration-base) ease-out-expo group-data-dragging/dropzone:-translate-y-0.5 group-data-dragging/dropzone:bg-card",
        )}
      >
        <Upload className="size-4" />
      </span>
      <span className="text-sm font-medium text-foreground">{title}</span>
      {message ? (
        <span
          id={messageId}
          role={error ? "alert" : undefined}
          className={cn(
            "text-xs",
            error ? "text-destructive-foreground" : "text-muted-foreground",
          )}
        >
          {message}
        </span>
      ) : null}
    </label>
  );
}

type DropzoneFileProps = {
  name: string;
  /** Bytes. */
  size: number;
  /** 0 to 100 while uploading; leave undefined once it is done. */
  progress?: number;
  /** Why the upload failed; the row turns red and offers `onRetry`. */
  error?: string;
  onRemove?: () => void;
  onRetry?: () => void;
  className?: string;
};

/** One picked file as an Item row: name, size, upload progress or error, and remove. Put the rows in an ItemGroup. */
function DropzoneFile({
  name,
  size,
  progress,
  error,
  onRemove,
  onRetry,
  className,
}: DropzoneFileProps) {
  const uploading = progress !== undefined && !error;
  const status = error
    ? error
    : uploading
      ? `Uploading · ${Math.round(progress)}%`
      : "Uploaded";
  return (
    <Item data-slot="dropzone-file" data-invalid={error ? true : undefined} className={className}>
      <ItemMedia>
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-lg",
            error ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground",
          )}
        >
          <FileText className="size-4" />
        </span>
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="text-sm">{name}</ItemTitle>
        <ItemDescription
          className={cn(
            "flex flex-wrap items-center gap-x-1 tabular-nums",
            error && "text-destructive-foreground",
          )}
        >
          <span className="shrink-0 whitespace-nowrap">{formatFileSize(size)}</span>
          <span aria-hidden>·</span>
          <span className="inline-flex min-w-0 items-center gap-1">
            {!error && !uploading ? (
              <CircleCheck aria-hidden className="size-3 text-success" />
            ) : null}
            {status}
          </span>
        </ItemDescription>
        {uploading ? (
          <Progress value={progress} aria-label={`Uploading ${name}`} className="mt-1 h-1" />
        ) : null}
      </ItemContent>
      {onRetry || onRemove ? (
        <ItemActions className="gap-1">
          {error && onRetry ? (
            <IconButton label="Retry upload" variant="ghost" size="icon-sm" onClick={onRetry}>
              <RotateCw />
            </IconButton>
          ) : null}
          {onRemove ? (
            <IconButton
              label={uploading ? "Cancel upload" : "Remove file"}
              variant="ghost"
              size="icon-sm"
              onClick={onRemove}
            >
              <X />
            </IconButton>
          ) : null}
        </ItemActions>
      ) : null}
    </Item>
  );
}

export { Dropzone, DropzoneFile };
