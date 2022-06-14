import { prisma } from "~/db.server";

export async function getMenuItems() {
  return prisma.menuItem.findMany();
}