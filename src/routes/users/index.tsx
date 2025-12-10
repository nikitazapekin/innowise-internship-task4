import { createFileRoute } from "@tanstack/react-router";
import Users from "pages/Users";

export const Route = createFileRoute("/users/")({
  component: Users,
});

/*
function RouteComponent() {
  return (
    <div>
      TodoIndex!
      <Link to="/todo/$todoid" params={{ userid: "1" }} search={{ page: 1 }}>
        id
      </Link>
    </div>
  );
}

*/
