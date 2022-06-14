import type { LoaderFunction, ActionFunction} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getMenuItems } from "~/models/menu.server";
import { createOrder } from "~/models/order.server";

type LoaderData = {
  tableId: string
  menuItems: Awaited<ReturnType<typeof getMenuItems>>;
}

export const loader: LoaderFunction = async ({ params }) => {

  invariant(params.tableId, "params.slug is required");

  return json<LoaderData>({ 
    tableId: params.tableId,
    menuItems: await getMenuItems()
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
  const { tableId, menuItems } = useLoaderData<LoaderData>();
  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="my-6 border-b-2 text-center text-3xl">
        {tableId}
      </h1>
      <ul>
        {menuItems.map((menuItem) => (
          <li key={menuItem.id}>
            {menuItem.name}
            {` $${menuItem.price}`}
            <Form method="post">
              <input type="hidden" name="item_id" value={menuItem.id} />
              <input type="hidden" name="table_id" value={tableId} />
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