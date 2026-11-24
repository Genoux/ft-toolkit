import { route } from "@fieldtripagency/next/route";

export const GET = route({
  name: "health",
  authorize: async () => null,
  handler: async () => ({ status: "ok" }),
});
