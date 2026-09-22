import { LockKeyhole } from "lucide-react";
import { ConsoleFrame } from "../components/AppShell";
import { Button } from "../components/Button";
import { SignIn } from "../components/SignIn";
import { TextField } from "../components/TextField";
import { TextLink } from "../components/TextLink";

export function LoginScreen() {
  return (
    <ConsoleFrame title="Sign in" lang="en">
      <SignIn
        kicker="datAInsights"
        version="v1.0"
        badge="Intern"
        eyebrow="Workspace"
        title="Sign in"
        lede="Sign in to open the workspace."
        restriction="Access is restricted to authorised operators."
        foot="Protected workspace · End-to-end encrypted · SSO and 2FA"
      >
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
