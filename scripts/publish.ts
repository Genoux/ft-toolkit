import { parseArgs } from "node:util";
import { $ } from "bun";
import {
  prereleaseVersion,
  type ToolkitPackage,
  toolkitPackages,
  withWorkspaceRanges,
} from "./packages";

// `--tag experimental --build <n>` publishes every package as the next minor's prerelease under that
// dist-tag, leaving `latest` alone. The version only exists in the published manifest, never in git.
const { values: options } = parseArgs({
  options: {
    tag: { type: "string", default: "latest" },
    build: { type: "string" },
    "dry-run": { type: "boolean", default: false },
  },
});
const { tag, build } = options;
if ((tag === "latest") !== (build === undefined)) {
  console.error("--build <n> is required with a non-latest --tag, and not allowed with latest");
  process.exit(1);
}
const versionOf = (pkg: ToolkitPackage) =>
  build === undefined ? pkg.version : prereleaseVersion(pkg.version, tag, build);

// bun publish has no OIDC trusted-publishing support (https://github.com/oven-sh/bun/issues/22423).
// npm reports an already-published version as E403 "cannot publish over the previously published versions".
// NPM_OTP passes an authenticator code for a manual publish from a 2FA account; reruns skip what landed.
// biome-ignore lint/suspicious/noUndeclaredEnvVars: publish runs outside turbo, so there is no task cache to key
const otp = process.env.NPM_OTP;
const flags = [
  "--access",
  "public",
  "--tag",
  tag,
  ...(options["dry-run"] ? ["--dry-run"] : []),
  ...(otp ? ["--otp", otp] : []),
];
for (const pkg of toolkitPackages()) {
  const { exitCode, stderr } = await withWorkspaceRanges(
    pkg,
    () => $`npm publish ${flags}`.cwd(pkg.dir).nothrow().quiet(),
    versionOf,
  );
  const output = stderr.toString();
  if (exitCode !== 0 && !output.includes("previously published")) {
    console.error(output);
    process.exit(exitCode);
  }
  if (options["dry-run"]) console.info(output);
  console.info(`published ${pkg.name}@${versionOf(pkg)} under ${tag}`);
}
