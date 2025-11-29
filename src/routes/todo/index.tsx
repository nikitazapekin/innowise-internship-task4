import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/todo/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      TodoIndex!
      <Link to="/todo/$todoid" params={{ todoid: "1" }} search={{ page: 1 }}>
        {" "}
        id
      </Link>
    </div>
  );
}
