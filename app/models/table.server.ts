import { prisma } from "~/db.server";

export async function getTables() {
  return prisma.table.findMany();
}