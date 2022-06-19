import type { Restaurant, MenuItem } from "@prisma/client";
import { prisma } from "~/db.server";

export type { Restaurant, MenuItem };

export async function getRestaurants() {
  return prisma.restaurant.findMany();
}

export async function getRestaurant({ id }: Pick<Restaurant, "id">) {
  return prisma.restaurant.findUnique({
    where: { id }
  });
}

export async function getMenuItems({ id }: Pick<Restaurant, "id">) {
  return prisma.restaurant.findUnique({
    where: { id },
    select: { menu: true }
  });
}