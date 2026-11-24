import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { Alert, AlertDescription } from "../../../src/components/alert";
import { Button } from "../../../src/components/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../../../src/components/card";
import { Field, FieldLabel } from "../../../src/components/field";
import { Input } from "../../../src/components/input";
import { Stack } from "../../../src/components/layout";
import { Page } from "../../../src/components/page";

// Clerk draws this card itself inside the apps, 25rem wide; Storybook has no Clerk, so a Card stands in for it.
function ClerkSignInStandIn({ app, provider }: { app: string; provider?: string }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sign in to {app}</CardTitle>
        <CardDescription>Welcome back! Please sign in to continue</CardDescription>
      </CardHeader>
      {provider ? (
        <Button variant="outline">Continue with {provider}</Button>
      ) : (
        <Field>
          <FieldLabel htmlFor="sign-in-email">Email address</FieldLabel>
          <Input id="sign-in-email" type="email" autoComplete="email" />
          <Button>Continue</Button>
        </Field>
      )}
    </Card>
  );
}

function SignInFrame({ children }: { children: ReactNode }) {
  return (
    <Page asChild size="centered">
      <main>
        <Stack gap="md" align="center" className="w-full max-w-100">
          {children}
        </Stack>
      </main>
    </Page>
  );
}

const meta = {
  title: "Screens/Shared/Sign in",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Proof and Fieldtrip Contracts: Clerk's `<SignIn />` alone, centred on the canvas (Proof signs in with Slack). */
export const Default: Story = {
  render: () => (
    <SignInFrame>
      <ClerkSignInStandIn app="Proof" provider="Slack" />
    </SignInFrame>
  ),
};

/** Proof, redirected back with `reason=not_allowed`: one muted line above the card. */
export const NotAllowed: Story = {
  render: () => (
    <SignInFrame>
      <p className="max-w-sm text-center text-sm text-muted-foreground">
        That account is not allowed to use Proof.
      </p>
      <ClerkSignInStandIn app="Proof" provider="Slack" />
    </SignInFrame>
  ),
};

/** Pool, redirected back with `reason=no_account`: the reason as an alert above the card. */
export const AccountNotFound: Story = {
  render: () => (
    <SignInFrame>
      <Alert variant="destructive">
        <CircleAlert />
        <AlertDescription>
          Your account was not found. Contact your administrator if you think this is a mistake.
        </AlertDescription>
      </Alert>
      <ClerkSignInStandIn app="Pool" />
    </SignInFrame>
  ),
};
