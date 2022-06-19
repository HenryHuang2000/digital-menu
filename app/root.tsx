import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getUser } from "./session.server";
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
      <body className="h-full">

        {/* Global nav bar */}
        <div className="mx-auto px-4 sm:px-6 flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10 ">
          <div className="flex space-x-10">
          <Link 
              to="restaurants"
              className="text-base font-medium text-gray-500 hover:text-gray-900"
            >
              Restaurants
            </Link>
            <Link 
              to="tables"
              className="text-base font-medium text-gray-500 hover:text-gray-900"
            >
              Tables
            </Link>
            {user ? <Link 
              to="/orders"
              className="text-base font-medium text-gray-500 hover:text-gray-900"
            >
              Orders
            </Link> : null}
          </div>
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            {user ? (
              <Form action="/logout" method="post">
                <button
                  type="submit"
                  className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Logout
                </button>
              </Form>
            ) : (
              <>
                <Link to="/login" className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">
                  Sign in
                </Link>
                <Link
                  to="/join"
                  className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Sign up
                </Link>
              </>
            )}
            
          </div>
        </div>

        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
