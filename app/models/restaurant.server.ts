import { prisma } from "~/db.server";

export async function getRestaurants() {
  return prisma.restaurant.findMany();
}