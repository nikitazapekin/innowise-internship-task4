import { createFileRoute } from "@tanstack/react-router";

async function getToDoId(id: string): Promise<{ title: string }> {
  const data = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);

  return data.json();
}

export type TodoDetailSearch = {
  page?: number;
};

export const Route = createFileRoute("/users/$userid")({
  component: RouteComponent,
  loader: ({ params }) => getToDoId(params.userid),
  errorComponent: ({ error }) => <div>{error.message}</div>,

  validateSearch: (search: Record<string, unknown>): TodoDetailSearch => {
    return {
      page: search.page ? Number(search.page) : undefined,
    };
  },
});

function RouteComponent() {
  /*   const { userid } = Route.useParams();
  const data = Route.useLoaderData();
  const search = Route.useSearch(); */

  return (
    <div>
      {/*    Hello "/todo/todoid"! {todoid}.... {JSON.stringify(data)}
      {search.page && <div>Page: {search.page}</div>} */}
    </div>
  );
}

/* import { createFileRoute } from "@tanstack/react-router";

async function getToDoId(id: string): Promise<{ title: string }> {
  const data = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);

  return data.json();
}

export type TodoDetailSearch = {
  page?: number;
};

export const Route = createFileRoute("/users/$userid")({
  component: RouteComponent,
  loader: ({ params }) => getToDoId(params.todoid),
  errorComponent: ({ error }) => <div>{error.message}</div>,

  validateSearch: (search: Record<string, unknown>): TodoDetailSearch => {
    return {
      page: search.page ? Number(search.page) : undefined,
    };
  },
});

function RouteComponent() {
  const { todoid } = Route.useParams();
  const data = Route.useLoaderData();
  const search = Route.useSearch();

  return (
    <div>
      Hello "/todo/todoid"! {todoid}.... {JSON.stringify(data)}
      {search.page && <div>Page: {search.page}</div>}
    </div>
  );
}
 */
