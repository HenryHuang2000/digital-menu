import { Tab } from "@headlessui/react";
import { useLoaderData } from "@remix-run/react";
import { ActionFunction, json, LoaderFunction } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { MenuItemCard } from "~/components/MenuItemCard";
import type { MenuItem } from "~/models/restaurant.server";
import { getMenu } from "~/models/restaurant.server";
import type { TableWithOrders } from "~/models/table.server";
import { createOrder, getTableWithOrders } from "~/models/table.server";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

type LoaderData = {
  menu: MenuItem[];
  tableWithOrders: TableWithOrders;
};

export const loader: LoaderFunction = async ({ params }) => {

  invariant(params.tableId, "tableId not found");
  invariant(params.restaurantId, "restaurant id is required");

  const menu = await getMenu({ id: params.restaurantId });
  invariant(menu, "menu could not be found");

  const tableWithOrders = await getTableWithOrders({ id: params.tableId });
  invariant(tableWithOrders, `Table with id "${params.tableId}" not found`);

  return json<LoaderData>({ menu: menu.menu, tableWithOrders });
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
  const { menu, tableWithOrders } = useLoaderData<LoaderData>();

  return (
    <div className="w-full ml-5 mt-5">
      <Tab.Group>
        <Tab.List className="max-w-md flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {["Menu", "Orders"].map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                classNames(
                  'flex justify-center w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                  'focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow'
                    : 'text-blue-900 hover:bg-white/10 hover:text-blue-800'
                )
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels>
          <Tab.Panel>
            <main>
              <menu className="mt-5 flex flex-wrap">
                {menu.map((menuItem) => (
                  <li key={menuItem.id}>
                    <MenuItemCard menuItem={menuItem} tableId={tableWithOrders.id}/>
                  </li>
                ))}
              </menu>
            </main>
          </Tab.Panel>
          <Tab.Panel>
            <main>
              {tableWithOrders.orders.length ? 
                (
                  <table className="w-full max-w-md mt-5 bg-gray-200 rounded-lg shadow-lg overflow-hidden">
                    <thead>
                      <tr>
                        <th className="py-2 w-16 bg-blue-500/20">Qty</th>
                        <th className="text-left pl-4 bg-blue-500/20">Item</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableWithOrders.orders.map((order) => (
                        <tr key={order.id} className="even:bg-gray-500/20">
                          <td className="text-center">1</td>
                          <td className="p-3">{order.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) :
                (
                  <h4 className="mt-5 font-normal text-xl text-gray-700">Your cart is empty</h4>
                )
              }
            </main>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      
    </div>
  );
}