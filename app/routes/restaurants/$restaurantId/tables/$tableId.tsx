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
    <main>
      <h1 className="mx-5 text-gray-500 text-xl">
        {table.label}
      </h1>
      <menu className="mx-5 mt-8 flex flex-wrap justify-center">
        {menu.map((menuItem) => (
          <li key={menuItem.id} className="w-60 mr-4 mb-4 overflow-hidden rounded-xl shadow-xl border">
            
            <img
              className="aspect-square object-cover"
              src={ menuItem.imageUrl ?? "https://res.cloudinary.com/dbxuemovn/image/upload/v1655869310/digital-menu/no-image-placeholder_bg2bgm.svg" } 
              alt={menuItem.name} 
            />

            <div className="h-full p-4 bg-white">
              <h4 className="font-semibold text-lg truncate">{menuItem.name}</h4>
              <p className="text-gray-600 text-sm">{`$${menuItem.price}`}</p>
              
              <Form method="post" replace={true} >
                <input type="hidden" name="item_id" value={menuItem.id} />
                <input type="hidden" name="table_id" value={table.id} />
                <button type="submit" className="w-full mt-6 text-center rounded-full bg-green-300 hover:bg-green-400">
                  Order
                </button>
              </Form>
            </div>
          </li>
        ))}
      </menu>
    </main>
  );
}