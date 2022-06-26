import { Form } from "@remix-run/react";
import type { MenuItem } from "~/models/restaurant.server"

export type MenuItemCardProps = {
  menuItem: MenuItem,
  tableId?: string
}

export function MenuItemCard({menuItem, tableId}: MenuItemCardProps) {
  return (
    <div className="w-60 mr-4 mb-4 overflow-hidden rounded-xl shadow-xl border">
      <img
        className="aspect-square object-cover"
        src={ menuItem.imageUrl ?? "https://res.cloudinary.com/dbxuemovn/image/upload/v1655869310/digital-menu/no-image-placeholder_bg2bgm.svg" } 
        alt={menuItem.name} 
      />

      <div className="h-full p-4 bg-white">
        <h4 className="font-semibold text-lg truncate">{menuItem.name}</h4>
        <p className="text-gray-600 text-sm">{`$${menuItem.price}`}</p>
        
        {tableId && (
          <Form method="post" replace={true} >
            <input type="hidden" name="item_id" value={menuItem.id} />
            <input type="hidden" name="table_id" value={tableId} />
            <button type="submit" className="w-full mt-6 text-center rounded-full bg-green-300 hover:bg-green-400">
              Order
            </button>
          </Form>
        )}
      </div>
    </div>
  );
};