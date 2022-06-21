import { Link } from "@remix-run/react";
import { useOptionalUser } from "~/utils";

// export const loader: LoaderFunction = async ({ params }) => {

//   invariant(params.restaurantId, "restaurant id is required.");
//   const restaurant = await getRestaurant({ id: params.restaurantId });
//   invariant(restaurant, "restaurant not found.");

//   return json<LoaderData>({
//     restaurant
//   });
// };

export default function Index() {
  const user = useOptionalUser();
  return (
    <div className="m-10 box-content space-x-10">
      <Link
      to="tables"
      className="p-6 text-xl bg-green-200 hover:bg-green-300 rounded"
      >
        View Tables
      </Link>

      { user ? 
        <Link
        to="orders"
        className="p-6 text-xl bg-blue-200 hover:bg-blue-300 rounded"
        >
          View Orders
        </Link> : 
        <></>
      }
    </div>
  );
}