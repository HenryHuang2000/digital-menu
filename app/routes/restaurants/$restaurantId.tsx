import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import type { Restaurant } from "~/models/restaurant.server";
import { getRestaurant } from "~/models/restaurant.server";
import type { Table } from "~/models/table.server";
import { getTables } from "~/models/table.server";
import { Listbox, Transition } from '@headlessui/react'
import { Fragment, useState } from "react";
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'

type LoaderData = {
  restaurant: Restaurant;
  tables: Awaited<ReturnType<typeof getTables>>;
}

export const loader: LoaderFunction = async ({ params }) => {

  invariant(params.restaurantId, "restaurant id is required.");
  const restaurant = await getRestaurant({ id: params.restaurantId });
  invariant(restaurant, "restaurant not found.");

  return json<LoaderData>({
    restaurant,
    tables: await getTables({ restaurantId: params.restaurantId })
  });
};

export default function RestaurantPage() {
  const { restaurant, tables } = useLoaderData<LoaderData>();
  const [ selectedTable, setSelectedTable ] = useState<Table>();

  return (
    <main className="h-full flex">
      <div className="max-w-sm h-full bg-white">
        <h1 className="inline-block mx-5 mt-5 text-4xl">{restaurant.name}</h1>
        <h5 className="inline-block mx-5 text-xl text-gray-500">{restaurant.location}</h5>
        
        <div className="flex justify-center">
          <Listbox value={selectedTable} onChange={setSelectedTable}>
            <div className="relative w-72 mt-5">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate">{selectedTable?.label ?? "Please select a table"}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <SelectorIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {tables.map(table => (
                    <Listbox.Option
                      key={table.id}
                      as={Link}
                      to={`tables/${table.id}`}
                      className={({ active }) =>
                        `relative block cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                        }`
                      }
                      value={table}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? 'font-medium' : 'font-normal'
                            }`}
                          >
                            {table.label}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      </div>

      <Outlet/>
    </main>
  );
}