import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "../../src/components/card";
import { Prose } from "../../src/components/prose";

const meta = {
  title: "Molecules/Prose",
  component: Prose,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Prose>;

export default meta;
type Story = StoryObj<typeof meta>;

function BriefContent() {
  return (
    <>
      <h1>Spring UGC push</h1>
      <p>
        Oatly wants short, honest videos of people making their morning coffee with oat milk. The
        tone is <strong>warm and unpolished</strong>: shot on a phone, in a real kitchen, with
        natural light. See the <a href="#guidelines">brand guidelines</a> before filming.
      </p>
      <h2>Deliverables</h2>
      <ol>
        <li>One 30-second video for TikTok, 9:16</li>
        <li>
          One 15-second cut for Reels, with:
          <ul>
            <li>captions burned in</li>
            <li>no music under the voice-over</li>
          </ul>
        </li>
        <li>Three stills from the shoot</li>
      </ol>
      <h3>Hook ideas</h3>
      <ul>
        <li>Start on the pour, not on your face.</li>
        <li>Say what you'd say to a friend, not a line from an ad.</li>
      </ul>
      <blockquote>
        The best-performing videos last quarter opened with the product in hand within the first
        second.
      </blockquote>
      <h2>Rates</h2>
      <table>
        <thead>
          <tr>
            <th>Deliverable</th>
            <th>Usage</th>
            <th>Rate</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>TikTok video</td>
            <td>Paid, 12 months</td>
            <td>$800</td>
          </tr>
          <tr>
            <td>Reels cut</td>
            <td>Organic</td>
            <td>$300</td>
          </tr>
          <tr>
            <td>Stills</td>
            <td>Organic</td>
            <td>$100</td>
          </tr>
        </tbody>
      </table>
      <hr />
      <h4>File naming</h4>
      <p>
        Name files <code>creator-deliverable-v1.mp4</code>, for example:
      </p>
      <pre>
        <code>{"maya-chen-tiktok-v1.mp4\nmaya-chen-reels-v1.mp4"}</code>
      </pre>
    </>
  );
}

/** Every element markdown produces, on the type roles. */
export const AllStates: Story = {
  render: () => (
    <Prose>
      <BriefContent />
    </Prose>
  ),
};

/** Inside a card, as a rendered brief or comment. */
export const InCard: Story = {
  render: () => (
    <Card className="max-w-2xl">
      <Prose asChild>
        <article>
          <BriefContent />
        </article>
      </Prose>
    </Card>
  ),
};
