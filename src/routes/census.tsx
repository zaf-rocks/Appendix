import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/census")({
  component: () => <Navigate to="/forge" />,
});
