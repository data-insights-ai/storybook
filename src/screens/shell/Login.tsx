import { LockKeyhole } from "lucide-react";
import { Button, SignIn, SignInVersion, TextField, TextLink, Tag } from "../..";

export function LoginScreen() {
  return (
    <>
      <SignIn
        kicker="datAInsights"
        eyebrow="Workspace"
        title="Sign in"
        lede="Sign in to open the workspace."
        restriction="Access is restricted to authorised operators."
        foot="Protected workspace · End-to-end encrypted · SSO and 2FA"
      >
        <SignInVersion>
          <Tag mono>v1.0</Tag>
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
    </>
  );
}
