import { describe, expect, it } from "vitest";
import { fileMatchesAccept, formatFileSize } from "../src/components/dropzone";

describe("fileMatchesAccept", () => {
  const video = { name: "Hook-V2.MP4", type: "video/mp4" };

  it("accepts everything without an accept string", () => {
    expect(fileMatchesAccept(video)).toBe(true);
  });

  it("matches extensions case-insensitively, exact types and wildcards", () => {
    expect(fileMatchesAccept(video, ".pdf, .mp4")).toBe(true);
    expect(fileMatchesAccept(video, "video/mp4")).toBe(true);
    expect(fileMatchesAccept(video, "video/*")).toBe(true);
    expect(fileMatchesAccept(video, "image/*,.pdf")).toBe(false);
  });
});

describe("formatFileSize", () => {
  it("picks the unit and drops a trailing .0", () => {
    expect(formatFileSize(512)).toBe("512 B");
    expect(formatFileSize(1024)).toBe("1 KB");
    expect(formatFileSize(8_400_000)).toBe("8 MB");
    expect(formatFileSize(10 * 1024 * 1024)).toBe("10 MB");
  });
});
