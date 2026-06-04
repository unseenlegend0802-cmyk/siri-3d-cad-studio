import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dragons")({
  beforeLoad: () => {
    throw redirect({ to: "/models" });
  },
  component: () => null,
});
