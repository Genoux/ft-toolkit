import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { Dropzone, DropzoneFile } from "../../src/components/dropzone";
import { ItemGroup } from "../../src/components/item";

const MAX_SIZE = 150 * 1024 * 1024;
const TITLE = "Click to upload or drag and drop";
const RULES = "MP4 or MOV · Max 150 MB each";
const FULL = "You can add a maximum of 5 highlights.";

const meta = {
  title: "Molecules/Dropzone",
  component: Dropzone,
  parameters: { layout: "padded" },
  args: {
    onFiles: () => {},
    accept: "video/mp4,video/quicktime",
    title: TITLE,
    maxSize: MAX_SIZE,
    multiple: true,
    description: RULES,
  },
  decorators: [
    (Story) => (
      <div className="w-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Dropzone>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Idle, error and disabled zones, then file rows uploading, uploaded and failed. The drag-over state is its own story, DragOver. */
export const AllStates: Story = {
  decorators: [
    (Story) => (
      <div className="w-4xl">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <Dropzone onFiles={() => {}} multiple title={TITLE} description={RULES} />
      <Dropzone
        onFiles={() => {}}
        multiple
        title={TITLE}
        description={RULES}
        error="hook-final.mov is 212 MB. Max 150 MB each."
      />
      <Dropzone onFiles={() => {}} title={TITLE} description={FULL} disabled />
      <ItemGroup>
        <DropzoneFile name="hook-v2.mp4" size={8_400_000} progress={64} onRemove={() => {}} />
        <DropzoneFile name="unboxing-final.mov" size={96_400_000} onRemove={() => {}} />
        <DropzoneFile
          name="demo-cut.mov"
          size={6_100_000}
          error="Upload failed. Try again."
          onRetry={() => {}}
          onRemove={() => {}}
        />
      </ItemGroup>
    </div>
  ),
};

export const Idle: Story = {};

/** A file held over the zone: solid ring border, tinted fill, the icon lifts. */
export const DragOver: Story = {
  play: ({ canvasElement }) => {
    canvasElement
      .querySelector('[data-slot="dropzone"]')
      ?.dispatchEvent(new Event("dragenter", { bubbles: true, cancelable: true }));
  },
};

export const WithError: Story = {
  args: { error: "hook-final.mov is 212 MB. Max 150 MB each." },
};

export const Disabled: Story = {
  args: { disabled: true, description: FULL },
};

type UploadingFile = { id: string; file: File; progress?: number; error?: string };

/** Pick or drop files: accepted ones upload with progress, rejected ones raise the zone's error. */
export const WithFileList: Story = {
  render: function WithFileListStory(args) {
    const [files, setFiles] = useState<UploadingFile[]>([]);
    const [error, setError] = useState<string>();

    useEffect(() => {
      if (!files.some((entry) => entry.progress !== undefined)) return;
      const timer = setInterval(() => {
        setFiles((current) =>
          current.map((entry) => {
            if (entry.progress === undefined) return entry;
            const progress = entry.progress + 12;
            return { ...entry, progress: progress >= 100 ? undefined : progress };
          }),
        );
      }, 300);
      return () => clearInterval(timer);
    }, [files]);

    return (
      <div className="flex flex-col gap-3">
        <Dropzone
          {...args}
          error={error}
          onFiles={(accepted, rejected) => {
            setError(
              rejected.length > 0
                ? `${rejected.map((file) => file.name).join(", ")} can’t be added. ${RULES}.`
                : undefined,
            );
            setFiles((current) => [
              ...current,
              ...accepted.map((file) => ({ id: crypto.randomUUID(), file, progress: 0 })),
            ]);
          }}
        />
        {files.length > 0 ? (
          <ItemGroup>
            {files.map((entry) => (
              <DropzoneFile
                key={entry.id}
                name={entry.file.name}
                size={entry.file.size}
                progress={entry.progress}
                error={entry.error}
                onRemove={() =>
                  setFiles((current) => current.filter((item) => item.id !== entry.id))
                }
              />
            ))}
          </ItemGroup>
        ) : null}
      </div>
    );
  },
};
