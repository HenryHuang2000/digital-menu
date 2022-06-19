import type { Prisma, Table } from "@prisma/client";
import { prisma } from "~/db.server";

export type TableWithOrders = Prisma.TableGetPayload<{include: { orders: true }}>
export type { Table };

interface ICreateOrder {
  tableId: string;
  menuItemId: string;
}

export async function getTables({ restaurantId }: Pick<Table, "restaurantId">) {
  return prisma.table.findMany({
    where: { restaurantId }
  });
}

export async function getTable({ id }: Pick<Table, "id">) {
  return prisma.table.findUnique({ 
    where: { id }
  });
}

export async function getTableWithOrders({ id }: Pick<Table, "id">) {
  return prisma.table.findUnique({ 
    where: { id },
    include: { orders: true }
  });
}

export async function createOrder({ tableId, menuItemId }: ICreateOrder) {
  return prisma.table.update({
    where: { id: tableId },
    data: {
      orders: { connect: { id: menuItemId } }
    }
  })
}