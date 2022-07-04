import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import * as React from "react";
import { addRestaurant } from "~/models/restaurant.server";
import { requireUserId } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  return json({});
};

type ActionData = {
  errors?: {
    name?: string;
    location?: string;
    imageUrl?: string;
    category?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const name = formData.get("name");
  const location = formData.get("location");
  const imageUrl = formData.get("imageUrl");
  const category = formData.get("category");

  if (typeof name !== "string" || name.length === 0) {
    return json<ActionData>(
      { errors: { name: "Name is required" } },
      { status: 400 }
    );
  }

  if (typeof location !== "string" || location.length === 0) {
    return json<ActionData>(
      { errors: { location: "Location is required" } },
      { status: 400 }
    );
  }

  if (typeof imageUrl !== "string") {
    return json<ActionData>(
      { errors: { imageUrl: "Image url is invalid" } },
      { status: 400 }
    );
  }

  if (typeof category !== "string") {
    return json<ActionData>(
      { errors: { category: "Category is invalid" } },
      { status: 400 }
    );
  }

  const restaurant = await addRestaurant({ name, location, imageUrl: imageUrl || null, category: category || null, userId });

  return redirect(`/restaurants/${restaurant.id}`);
};

export default function NewNotePage() {
  const actionData = useActionData() as ActionData;
  const nameRef = React.useRef<HTMLInputElement>(null);
  const locationRef = React.useRef<HTMLInputElement>(null);
  const imageUrlRef = React.useRef<HTMLInputElement>(null);
  const categoryRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.name) {
      nameRef.current?.focus();
    } else if (actionData?.errors?.location) {
      locationRef.current?.focus();
    }
  }, [actionData]);

  return (
    <main className="max-w-lg mx-auto">
      <h1 className="mt-5 font-semibold text-3xl">Add a new restaurant</h1>
      <Form method="post" className="mt-8">
        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Name: </span>
            <input
              ref={nameRef}
              name="name"
              className="flex-1 rounded-md border-2 border-gray-300 focus:outline-none focus:border-blue-500 px-3 text-lg leading-loose"
              aria-invalid={actionData?.errors?.name ? true : undefined}
              aria-errormessage={
                actionData?.errors?.name ? "name-error" : undefined
              }
            />
          </label>
          {actionData?.errors?.name && (
            <div className="pt-1 text-red-700" id="name-error">
              {actionData.errors.name}
            </div>
          )}
        </div>
        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Location: </span>
            <input
              ref={locationRef}
              name="location"
              className="flex-1 rounded-md border-2 border-gray-300 focus:outline-none focus:border-blue-500 px-3 text-lg leading-loose"
              aria-invalid={actionData?.errors?.location ? true : undefined}
              aria-errormessage={
                actionData?.errors?.location ? "location-error" : undefined
              }
            />
          </label>
          {actionData?.errors?.location && (
            <div className="pt-1 text-red-700" id="location-error">
              {actionData.errors.location}
            </div>
          )}
        </div>
        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Image url: </span>
            <input
              ref={imageUrlRef}
              name="imageUrl"
              className="flex-1 rounded-md border-2 border-gray-300 focus:outline-none focus:border-blue-500 px-3 text-lg leading-loose"
              aria-invalid={actionData?.errors?.imageUrl ? true : undefined}
              aria-errormessage={
                actionData?.errors?.imageUrl ? "image-url-error" : undefined
              }
            />
          </label>
          {actionData?.errors?.imageUrl && (
            <div className="pt-1 text-red-700" id="image-url-error">
              {actionData.errors.imageUrl}
            </div>
          )}
        </div>
        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Category: </span>
            <input
              ref={categoryRef}
              name="category"
              className="flex-1 rounded-md border-2 border-gray-300 focus:outline-none focus:border-blue-500 px-3 text-lg leading-loose"
              aria-invalid={actionData?.errors?.category ? true : undefined}
              aria-errormessage={
                actionData?.errors?.category ? "category-error" : undefined
              }
            />
          </label>
          {actionData?.errors?.category && (
            <div className="pt-1 text-red-700" id="category-error">
              {actionData.errors.category}
            </div>
          )}
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Save
          </button>
        </div>
      </Form>
    </main>
  );
}