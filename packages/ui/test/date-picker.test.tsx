import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DatePicker } from "../src/components/date-picker";

// West of UTC, reading "2027-04-30" as UTC midnight would show Apr 29.
process.env.TZ = "America/Los_Angeles";

describe("DatePicker", () => {
  it("shows an ISO value as that calendar day in any time zone", () => {
    expect(new Date(Date.UTC(2027, 3, 30)).getDate()).toBe(29);

    const markup = renderToStaticMarkup(<DatePicker value="2027-04-30" onChange={() => {}} />);

    expect(markup).toContain("Apr 30, 2027");
  });

  it("shows the placeholder without a value", () => {
    const markup = renderToStaticMarkup(
      <DatePicker value="" onChange={() => {}} placeholder="Pick a day" />,
    );

    expect(markup).toContain("Pick a day");
  });
});
