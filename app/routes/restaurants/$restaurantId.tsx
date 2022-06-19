import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import type { Restaurant } from "~/models/restaurant.server";
import { getRestaurant } from "~/models/restaurant.server";

type LoaderData = {
  restaurant: Restaurant
}

export const loader: LoaderFunction = async ({ params }) => {

  invariant(params.restaurantId, "restaurant id is required.");
  const restaurant = await getRestaurant({ id: params.restaurantId });
  invariant(restaurant, "restaurant not found.");

  return json<LoaderData>({
    restaurant
  });
};

export default function RestaurantPage() {
  const { restaurant } = useLoaderData<LoaderData>();
  return (
    <main className="flex flex-col justify-center">
      <h1 className="text-4xl self-center flex-center m-5">{restaurant.name}</h1>
      <Outlet/>
    </main>
  );
}