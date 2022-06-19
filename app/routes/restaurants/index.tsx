import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getRestaurants } from "~/models/restaurant.server";

type LoaderData = {
  restaurants: Awaited<ReturnType<typeof getRestaurants>>;
}

export const loader = async () => {
  return json<LoaderData>({
    restaurants: await getRestaurants()
  });
};

export default function RestaurantsPage() {
  const { restaurants } = useLoaderData<LoaderData>();
  return (
    <main className="h-full w-full flex justify-center">
      <menu className="w-full m-10 rounded">
        {restaurants.map((restaurant) => (
          <li 
            className={ "flex m-10 hover:bg-slate-200 bg-slate-100 rounded" }
            key={restaurant.id}
          >
            <Link 
              className={"w-full p-10"}
              to={restaurant.id}
            >
              {restaurant.name}
            </Link>
          </li>
        ))}
      </menu>
    </main>
  );
}