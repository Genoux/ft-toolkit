import { AppError } from "@fieldtripagency/core/errors";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const captureException = vi.fn(() => "abcdef1234567890");
vi.mock("@sentry/nextjs", () => ({ captureException }));

const { captureAppError } = await import("./capture");

describe("captureAppError", () => {
  let logged: string[];

  beforeEach(() => {
    logged = [];
    captureException.mockClear();
    vi.spyOn(console, "error").mockImplementation((line: string) => logged.push(line));
  });
  afterEach(() => vi.restoreAllMocks());

  it("logs a foreign error without its message, which can carry user data", () => {
    const err = new Error('duplicate key value (email)=(jane@example.com) violates "users_email"');

    const captured = captureAppError(err, { tags: { action: "invite" } });

    expect(captured.errorId).toBe("ERR_ABCDEF12");
    expect(captureException).toHaveBeenCalledWith(err, expect.anything());
    expect(logged).toHaveLength(1);
    expect(logged[0]).not.toContain("jane@example.com");
    expect(JSON.parse(logged[0] ?? "")).toMatchObject({
      level: "error",
      errorId: "ERR_ABCDEF12",
      action: "invite",
      error: { name: "Error" },
    });
  });

  it("logs the message of our own AppError", () => {
    captureAppError(
      new AppError("unknown", "Payout total did not match", { reportToSentry: true }),
    );

    expect(JSON.parse(logged[0] ?? "")).toMatchObject({
      error: { name: "AppError", message: "Payout total did not match" },
    });
  });
});
