import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../../src/components/badge";
import { PageHeader } from "../../src/components/page";
import { PersonAvatar, PersonIdentity } from "../../src/components/person-identity";
import { VariantGrid } from "../lib/variant-grid";
import { CREATOR_PROFILE, photoUrl, STAFF } from "../screens/pool/fixtures";
import { RatingBadge } from "../screens/pool/pool-blocks";

const personWithImage = STAFF.maya;
const personWithoutImage = { ...STAFF.lucas, imageUrl: null };
const SIZES = ["sm", "md", "lg"] as const;
const CONTENTS = ["name", "description", "badge", "no image"] as const;

const meta = {
  title: "Molecules/PersonIdentity",
  component: PersonIdentity,
  args: {
    name: personWithImage.name,
    imageUrl: personWithImage.imageUrl,
    size: "sm",
  },
  argTypes: { size: { control: "inline-radio", options: SIZES } },
} satisfies Meta<typeof PersonIdentity>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every size with a name only, a description, a trailing role badge, and initials when there is no image. A header identity (`lg`) carries no badge: a record's status goes in `PageHeader meta`. */
export const AllStates: Story = {
  render: () => (
    <VariantGrid
      rows={SIZES}
      columns={CONTENTS}
      renderCell={(size, content) => {
        const person = content === "no image" ? personWithoutImage : personWithImage;
        if (size === "lg" && content === "badge")
          return <span className="text-xs text-subtle-foreground">In PageHeader meta</span>;
        return (
          <PersonIdentity
            size={size}
            name={person.name}
            imageUrl={person.imageUrl}
            description={content === "name" ? undefined : person.email}
            badge={content === "badge" ? <Badge variant="secondary">Admin</Badge> : undefined}
          />
        );
      }}
    />
  ),
};

export const Default: Story = {};

export const WithDescription: Story = { args: { description: STAFF.maya.email } };

/** A panel header: 40px avatar, 16px name, the email under it. Who the person is, nothing more: tags and status sit outside the identity. */
export const Header: Story = {
  args: {
    size: "lg",
    name: CREATOR_PROFILE.fullName,
    imageUrl: photoUrl(CREATOR_PROFILE.photoSeed, 80),
    description: CREATOR_PROFILE.email,
  },
};

/** On a person's page the identity is the `PageHeader`: the photo as `media`, the name as the title, and her rating in `meta` on the description's line. Pool's creator profile. */
export const InAPageHeader: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <PageHeader
      media={
        <PersonAvatar
          size="xl"
          name={CREATOR_PROFILE.fullName}
          imageUrl={photoUrl(CREATOR_PROFILE.photoSeed, 160)}
        />
      }
      title={CREATOR_PROFILE.fullName}
      description={`${CREATOR_PROFILE.country} · ${CREATOR_PROFILE.languages.join(", ")}`}
      meta={<RatingBadge rating={CREATOR_PROFILE.overallRating} />}
    />
  ),
};

/** Long names and emails truncate instead of pushing the badge out. */
export const Truncation: Story = {
  render: () => (
    <div className="flex w-56 flex-col gap-4">
      {SIZES.map((size) => (
        <PersonIdentity
          key={size}
          size={size}
          name="Maya Thompson-Delacroix"
          imageUrl={personWithImage.imageUrl}
          description="maya.thompson-delacroix@inbeat.agency"
          badge={<Badge variant="secondary">Owner</Badge>}
        />
      ))}
    </div>
  ),
};

const AVATAR_SIZES = ["xs", "sm", "md", "lg"] as const;

/** `PersonAvatar` alone takes Avatar's sizes: `xs` 20px (the default, for chips and menu rows) up to `lg` 40px, with an image or initials. */
export const AvatarSizes: Story = {
  render: () => (
    <VariantGrid
      rows={["image", "initials"] as const}
      columns={AVATAR_SIZES}
      renderCell={(content, size) => {
        const person = content === "image" ? personWithImage : personWithoutImage;
        return <PersonAvatar size={size} name={person.name} imageUrl={person.imageUrl} />;
      }}
    />
  ),
};
