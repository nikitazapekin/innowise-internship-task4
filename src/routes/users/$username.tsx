import { createFileRoute } from "@tanstack/react-router";
import User from "pages/User";

export const Route = createFileRoute("/users/$username")({
  component: RouteComponent,
});

function RouteComponent() {
  const { username } = Route.useParams();

  return <User username={username} />;
}
