import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getTables } from "~/models/table.server";

type LoaderData = {
  tables: Awaited<ReturnType<typeof getTables>>;
}

export const loader: LoaderFunction = async ({ params }) => {

  invariant(params.restaurantId, "restaurant id is required.")

  return json<LoaderData>({
    tables: await getTables({ restaurantId: params.restaurantId })
  });
};

export default function RestaurantsPage() {
  const { tables } = useLoaderData<LoaderData>();
  return (
    <main className="h-full w-full flex justify-center">
      <menu className="w-full m-10 rounded">
        {tables.map((table) => (
          <li 
            className={ "flex m-10 hover:bg-slate-200 bg-slate-100 rounded" }
            key={table.id}
          >
            <Link 
              className={"w-full p-10"}
              to={table.id}
            >
              {table.label}
            </Link>
          </li>
        ))}
      </menu>
    </main>
  );
}