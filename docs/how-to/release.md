# Release the design system

A release is a version bump and its tag. CI publishes; nobody publishes from a machine.

1. Bump `version` in `package.json`. The tag and the version are the same number: `0.35.0` is the tag `v0.35.0`.
2. Add that version's entry at the top of [`CHANGELOG.md`](../../CHANGELOG.md): what changed and what a product has to do, in a few lines; every rename, merge or removal as old → new with a code example. The changelog names no consumer, product, repository or file of a consumer, because this repository is public.
3. Run `pnpm check` and commit both files to `main`.
4. Push the tag:

   ```bash
   git tag v0.35.0
   git push origin main v0.35.0
   ```

The `publish` job in `.github/workflows/ci.yml` runs on the tag after the `test` job passed: it checks that the tag matches `package.json`, publishes `@data-insights-ai/ui` to GitHub Packages, and the `deploy` job uploads the built Storybook to <https://storybook.data-insights.ai>. Never run `pnpm publish` or `npm publish` yourself. A push to `main` without a tag runs the checks and publishes nothing.

A release comes once per deploy of the products, after the changes for that deploy are merged, so each product moves its version once; only a fix that blocks a deploy or a security fix comes sooner. Push a tag only when a release was asked for.

After the release, each product that uses the package moves its pin in one commit of its own.
