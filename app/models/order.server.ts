import type { Order } from "@prisma/client";
import { prisma } from "~/db.server";

export async function createOrder({
  tableId,
  menuItemId,
}: Pick<Order, "tableId" | "menuItemId">) {
  return prisma.order.upsert({
    where: {tableId_menuItemId: {tableId, menuItemId}},
    create: {tableId, menuItemId},
    update: {tableId, menuItemId}
  });
}