import type { Meta, StoryObj } from "@storybook/react-vite";
import { Decision } from "./approvals.stories";
import { Default as RequestDetail } from "./request-detail.stories";

const meta = {
  title: "Screens/Impact and Recognition/Migration preview",
  globals: { brand: "fieldtrip" },
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** I&R's design screen `approvals-case` on the toolkit: Finance's side card with the budget impact, Approve and Request changes. */
export const ApprovalsCase: Story = { render: Decision.render };

/** I&R's design screen `manager-case` on the toolkit: a request People sent back, Priya's note above the policy. */
export const ManagerCase: Story = { render: RequestDetail.render };
