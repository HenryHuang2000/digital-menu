import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { getTables } from "~/models/table.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

type LoaderData = {
  tables: Awaited<ReturnType<typeof getTables>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  const tables = await getTables();
  return json<LoaderData>({ tables });
};

export default function OrdersPage() {
  const data = useLoaderData<LoaderData>();
  const user = useUser();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Orders</Link>
        </h1>
        <p>{user.email}</p>
      </header>

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          {data.tables.length === 0 ? (
            <p className="p-4">No tables yet</p>
          ) : (
            <ol>
              {data.tables.map((table) => (
                <li key={table.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={table.id}
                  >
                    {table.label}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
