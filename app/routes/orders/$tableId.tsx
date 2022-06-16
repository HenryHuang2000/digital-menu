import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import type { TableWithOrders } from "~/models/table.server";
import { getTableWithOrders } from "~/models/table.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  tableWithOrders: TableWithOrders;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireUserId(request);

  invariant(params.tableId, "tableId not found");

  const tableWithOrders = await getTableWithOrders({ id: params.tableId });
  invariant(tableWithOrders, `Table with id "${params.tableId}" not found`);

  return json<LoaderData>({ tableWithOrders });
};

export default function TableOrdersPage() {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.tableWithOrders.label}</h3>
      <ul>
        {data.tableWithOrders.orders.map((order) => (
          <li key={order.id}>
            {order.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Note not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
