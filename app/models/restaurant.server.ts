import type { Restaurant, MenuItem, User } from "@prisma/client";
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

export async function getMenu({ id }: Pick<Restaurant, "id">) {
  return prisma.restaurant.findUnique({
    where: { id },
    select: { menu: true }
  });
}

export async function addRestaurant({
  name,
  location,
  imageUrl,
  category,
  userId,
}: Pick<Restaurant, "name" | "location" | "imageUrl" | "category"> & {
  userId: User["id"];
}) {
  console.log('TEST', imageUrl === null);
  console.log('TEST2', imageUrl === undefined);
  console.log('TEST2', imageUrl === '');
  return prisma.restaurant.create({
    data: {
      name,
      location,
      imageUrl,
      category,
      user: {
        connect: {
          id: userId
        }
      }
    }
  });
}
