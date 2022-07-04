import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getRestaurants } from "~/models/restaurant.server";
import { useOptionalUser } from "~/utils";

type LoaderData = {
  restaurants: Awaited<ReturnType<typeof getRestaurants>>;
}

export const loader = async () => {
  return json<LoaderData>({
    restaurants: await getRestaurants()
  });
};

export default function RestaurantsPage() {
  const user = useOptionalUser();
  const { restaurants } = useLoaderData<LoaderData>();
  return (
    <main className="container mx-auto">
      <p className="max-w-xl mx-auto mt-8 font-semibold text-3xl text-center">Restaurants</p>
      <menu className="mt-5">
        {restaurants.map((restaurant) => (
          <li 
            className="max-w-xl mx-auto mt-3 overflow-hidden rounded-xl bg-white shadow-sm"
            key={restaurant.id}
          >
            <Link className={"flex"} to={restaurant.id}>
              <img 
                className="w-24 p-3 aspect-square object-fit"
                src={restaurant.imageUrl ?? "https://res.cloudinary.com/dbxuemovn/image/upload/v1656037427/digital-menu/no-image-placeholder-icon_l5gsim.svg" }
                alt={restaurant.name} 
              />
              <div className="p-3 my-auto">
                {restaurant.category ? (<div className="px-2 uppercase inline-block text-xs font-thin tracking-wide text-white bg-blue-400 rounded-full">{ restaurant.category }</div>) : <></>}
                <div className="font-semibold text-lg">{ restaurant.name }</div>
                <div className="text-gray-600 text-sm">{ restaurant.location }</div>
              </div>
            </Link>
          </li>
        ))}
      </menu>
      <div className="max-w-xl mx-auto mt-5">
        { user && (
          <Link className={"inline-block px-4 py-2 rounded-xl text-white bg-green-500"} to={"new"}>Add restaurant</Link>
        )}
      </div>
    </main>
  );
}