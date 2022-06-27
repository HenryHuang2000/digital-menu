import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { MenuItemCard } from "~/components/MenuItemCard";
import type { MenuItem } from "~/models/restaurant.server";
import { getMenu } from "~/models/restaurant.server";
import type { Table } from "~/models/table.server";
import { createOrder } from "~/models/table.server";
import { getTable } from "~/models/table.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

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


export default function MenuPage() {
  const { table, menu } = useLoaderData<LoaderData>();
  return (
    <main>
      <menu className="mt-5 flex flex-wrap">
        {menu.map((menuItem) => (
          <li key={menuItem.id}>
            <MenuItemCard menuItem={menuItem} tableId={table.id}/>
          </li>
        ))}
      </menu>
    </main>
  )
}