import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";

import { UserDropdown } from "./components/UserDropdown";
import { getUser } from "./session.server";
import tailwindStylesheetUrl from "./styles/tailwind.css";
import { useOptionalUser } from "./utils";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Digital Menu",
  viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    user: await getUser(request),
  });
};

export default function App() {
  const user = useOptionalUser();
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full antialiased text-gray-900">

        {/* Global nav bar */}
        <nav className="mx-auto px-4 sm:px-8 py-6 flex justify-between items-center border-b-2 border-gray-100 ">
          <div>
          <Link 
              to="restaurants"
              className="font-medium text-gray-500 hover:text-gray-900"
            >
              Restaurants
            </Link>
          </div>
          {user ? (
              <UserDropdown />
            ) : (
              <div>
                <div className="sm:hidden">
                  <UserDropdown />
                </div>
                <div className="hidden sm:block space-x-6">
                  <Link to="/login" className="inline-block px-4 py-2 rounded-md font-medium  text-gray-500 hover:text-gray-900">
                    Sign in
                  </Link>
                  <Link
                    to="/join"
                    className="inline-block px-4 py-2 rounded-md shadow-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            )}
        </nav>

        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
