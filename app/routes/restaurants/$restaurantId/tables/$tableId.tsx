import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import type { MenuItem } from "~/models/restaurant.server";
import { getMenu } from "~/models/restaurant.server";
import type { Table } from "~/models/table.server";
import { createOrder, getTable } from "~/models/table.server";

type LoaderData = {
  table: Table;
  menu: MenuItem[];
}

export const loader: LoaderFunction = async ({ params }) => {

  invariant(params.tableId, "table id is required");
  invariant(params.restaurantId, "restaurant id is required");

  const menu = await getMenu({ id: params.restaurantId });
  invariant(menu, "menu could not be found");

  const table = await getTable({ id: params.tableId });
  invariant(table, "table could not be found");

  return json<LoaderData>({ 
    table,
    menu: menu.menu
  });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const itemId = formData.get("item_id");
  const tableId = formData.get("table_id");

  invariant(typeof itemId === "string", "");
  invariant(typeof tableId === "string", "");

  return createOrder({ menuItemId: itemId, tableId });
};

export default function TableSlug() {
  const { table, menu } = useLoaderData<LoaderData>();
  return (
    <main className="flex flex-col items-start mx-10">
      <h1 className="my-6 text-center text-3xl">
        {table.label}
      </h1>
      <ul>
        {menu.map((menuItem) => (
          <li key={menuItem.id}>
            {menuItem.name}
            {` $${menuItem.price}`}
            <Form method="post" replace={true} >
              <input type="hidden" name="item_id" value={menuItem.id} />
              <input type="hidden" name="table_id" value={table.id} />
              <button type="submit" className="text-blue-600 underline">
                Order
              </button>
            </Form>
          </li>
        ))}
      </ul>
    </main>
  );
}