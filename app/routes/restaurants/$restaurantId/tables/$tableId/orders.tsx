import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
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
  const { tableWithOrders } = useLoaderData<LoaderData>();

  return (
    <main>
      {tableWithOrders.orders.length ? 
        (
          <ul>
            {tableWithOrders.orders.map((order) => (
              <li key={order.id}>
                {order.name}
              </li>
            ))}
          </ul>
        ) :
        (
          <span>There are no orders</span>
        )
      }
    </main>
  );
}