import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { MenuItemCard } from "~/components/MenuItemCard";
import type { MenuItem } from "~/models/restaurant.server";
import { getMenu } from "~/models/restaurant.server";

type LoaderData = {
  menu: MenuItem[];
}

export const loader: LoaderFunction = async ({ params }) => {

  invariant(params.restaurantId, "restaurant id is required");

  const menu = await getMenu({ id: params.restaurantId });
  invariant(menu, "menu could not be found");

  return json<LoaderData>({ 
    menu: menu.menu
  });
};

export default function RestaurantMenu() {
  const { menu } = useLoaderData<LoaderData>();
  return (
    <main>
      <menu className="mx-5 mt-8 flex flex-wrap">
        {menu.map((menuItem) => (
          <li key={menuItem.id}>
            <MenuItemCard menuItem={menuItem}/>
          </li>
        ))}
      </menu>
    </main>
  );
}