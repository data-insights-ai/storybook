import { LockKeyhole } from "lucide-react";
import { ConsoleFrame } from "../components/AppShell";
import { Button } from "../components/Button";
import { SignIn, SignInVersion } from "../components/SignIn";
import { TextField } from "../components/TextField";
import { TextLink } from "../components/TextLink";
import { VersionTag } from "../components/VersionTag";

export function LoginScreen() {
  return (
    <ConsoleFrame title="Sign in" lang="en">
      <SignIn
        kicker="datAInsights"
        eyebrow="Workspace"
        title="Sign in"
        lede="Sign in to open the workspace."
        restriction="Access is restricted to authorised operators."
        foot="Protected workspace · End-to-end encrypted · SSO and 2FA"
      >
        <SignInVersion>
          <VersionTag>v1.0</VersionTag>
        </SignInVersion>
        <TextField
          id="login-user"
          label="Email or username"
          autoComplete="username"
          defaultValue="nora.feld@data-insights.ai"
        />
        <TextField
          id="login-password"
          label="Password"
          type="password"
          autoComplete="current-password"
          defaultValue="sample-password"
        >
          <TextLink quiet={true}>Forgot password?</TextLink>
        </TextField>
        <Button type="submit">
          <LockKeyhole aria-hidden />
          Sign in
        </Button>
      </SignIn>
    </ConsoleFrame>
  );
}
