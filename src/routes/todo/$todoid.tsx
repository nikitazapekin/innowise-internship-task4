import { createFileRoute } from "@tanstack/react-router";

async function getToDoId(id: string): Promise<{ title: string }> {
  const data = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);

  return data.json();
}

export const Route = createFileRoute("/todo/$todoid")({
  component: RouteComponent,
  loader: ({ params }) => getToDoId(params.todoid),
  errorComponent: ({ error }) => <div>{error.message}</div>,
});

function RouteComponent() {
  const { todoid } = Route.useParams();

  const data = Route.useLoaderData();

  return (
    <div>
      Hello "/todo/todoid"! {todoid}.... {JSON.stringify(data)}
    </div>
  );
}
