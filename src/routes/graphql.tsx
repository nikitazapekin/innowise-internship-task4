import { createFileRoute } from "@tanstack/react-router";
import GraphQl from "pages/GraphQl";

export const Route = createFileRoute("/graphql")({
  component: GraphQl,
});
