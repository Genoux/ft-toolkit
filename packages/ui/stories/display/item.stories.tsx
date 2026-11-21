import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { Badge } from "../../src/components/badge";
import { IconButton } from "../../src/components/icon-button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "../../src/components/item";
import { PersonAvatar } from "../../src/components/person-identity";
import { PEOPLE } from "../lib/fixtures";

const meta = {
  title: "Display/Item",
  component: Item,
} satisfies Meta<typeof Item>;

export default meta;
type Story = StoryObj<typeof meta>;

export const People: Story = {
  render: () => (
    <ItemGroup className="max-w-xl" asChild>
      <ul>
        {PEOPLE.map((person, index) => (
          <Item key={person.id} asChild>
            <li>
              <ItemMedia>
                <PersonAvatar name={person.name} imageUrl={person.imageUrl} />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{person.name}</ItemTitle>
                <ItemDescription>
                  {person.name.split(" ")[0]?.toLowerCase()}@inbeat.co
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant="secondary">{index === 0 ? "Admin" : "Editor"}</Badge>
                <IconButton label="More actions" variant="ghost">
                  <MoreHorizontal />
                </IconButton>
              </ItemActions>
            </li>
          </Item>
        ))}
      </ul>
    </ItemGroup>
  ),
};

export const LinkRows: Story = {
  render: () => (
    <ItemGroup className="max-w-xl">
      {["Profile", "Notifications", "Billing"].map((setting) => (
        <Item key={setting} asChild>
          <a href={`#${setting.toLowerCase()}`}>
            <ItemContent>
              <ItemTitle>{setting}</ItemTitle>
            </ItemContent>
            <ChevronRight className="size-4 text-muted-foreground" />
          </a>
        </Item>
      ))}
    </ItemGroup>
  ),
};
