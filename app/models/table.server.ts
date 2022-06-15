import type { Prisma, Table } from "@prisma/client";
import { prisma } from "~/db.server";

export type TableWithOrders = Prisma.TableGetPayload<{include: { orders: true }}>

interface ICreateOrder {
  tableId: string;
  menuItemId: string;
}

export async function getTables() {
  return prisma.table.findMany();
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