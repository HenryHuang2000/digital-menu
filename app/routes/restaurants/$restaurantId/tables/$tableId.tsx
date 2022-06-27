import { Tab } from "@headlessui/react";
import { NavLink, Outlet } from "@remix-run/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function TableSlug() {
  return (
    <div className="w-full ml-5 mt-5">
      <Tab.Group>
        <Tab.List className="max-w-md flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {["Menu", "Orders"].map((category) => (
            <Tab
              as={NavLink}
              to={category.toLowerCase()}
              key={category}
              className={({ selected }) =>
                classNames(
                  'flex justify-center w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                  'focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels>
          <Tab.Panel>
            <Outlet />
          </Tab.Panel>
          <Tab.Panel>
            <Outlet />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      
    </div>
  );
}