import type { Meta, StoryObj } from "@storybook/react-vite";
import { Grid, Numbered, Stack } from "./Layout";
import { Card } from "./Card";

const meta = {
  title: "Patterns/Layout",
  component: Stack,
} satisfies Meta<typeof Stack>;

export default meta;

export const WrappedGrid: StoryObj = {
  render: () => (
    <Stack>
      <Grid min="180px">
        <Card>One</Card>
        <Card>Two</Card>
        <Card>Three</Card>
        <Card>Four</Card>
      </Grid>
      <Numbered index="01">
        <Card>A numbered block. The index is part of the pattern, not the screen.</Card>
      </Numbered>
    </Stack>
  ),
};
