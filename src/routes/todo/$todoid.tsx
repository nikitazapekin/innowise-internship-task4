import { createFileRoute } from "@tanstack/react-router";

type PageParams = {
  page: number;
};

async function getToDoId(id: string): Promise<{ title: string }> {
  const data = await fetch("https://jsonplaceholder.typicode.com/todos/1");

  return data.json();
}

export const Route = createFileRoute("/todo/$todoid")({
  component: RouteComponent,
  loader: ({ params }) => getToDoId(params.todoid),
  errorComponent: ({ error }) => <div>{error.message}</div>,
  validateSearch: (search: Record<string, unknown>): PageParams => {
    return {
      page: Number(search?.page ?? 1),
    };
  },
});

function RouteComponent() {
  const { todoid } = Route.useParams();
  const { page } = Route.useSearch();
  const data = Route.useLoaderData();

  return (
    <div>
      Hello "/todo/todoid"! {todoid}.... {page} {JSON.stringify(data)}
    </div>
  );
}
