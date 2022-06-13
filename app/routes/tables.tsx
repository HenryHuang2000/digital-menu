import { json } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { getTables } from "~/models/table.server";

type LoaderData = {
  tables: Awaited<ReturnType<typeof getTables>>;
}

export const loader = async () => {
  return json<LoaderData>({
    tables: await getTables()
  });
};

export default function TablesPage() {
  const { tables } = useLoaderData<LoaderData>();
  return (
    <main className="flex h-full bg-white">
      <div className="h-full w-80 border-r bg-gray-50">
        <Link to="new" className="block p-4 text-xl text-blue-500">
          + New Table
        </Link>

        <hr />

        {tables.length === 0 ? (
          <p className="p-4">No tables yet</p>
        ) : (
          <ol>
            {tables.map((table) => (
              <li key={table.slug}>
                <NavLink
                  className={({ isActive }) =>
                    `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                  }
                  to={table.slug}
                >
                  {table.title}
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
  );
}