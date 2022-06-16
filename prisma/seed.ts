import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {

  // User setup
  await prisma.user.deleteMany();
  await prisma.user.create({
    data: {
      email: "rachel@remix.run",
      password: {
        create: {
          hash: await bcrypt.hash("racheliscool", 10),
        },
      },
    },
  });

  // Restaurant setup
  const defaultRestaurant = {
    id: "maccas",
    name: "maccas"
  }
  await prisma.restaurant.upsert({
    where: { id: defaultRestaurant.id },
    update: defaultRestaurant,
    create: defaultRestaurant
  });

  // Table setup (Create 5 tables).
  const tables = Array.from({length: 5}, (_, i) => ({
    id: `table-${i + 1}`,
    label: `table ${i + 1}`,
    restaurantId: defaultRestaurant.id
  }));
  for (const table of tables) {
    await prisma.table.upsert({
      where: { id: table.id },
      update: table,
      create: table,
    });
  }

  // Menu setup.
  await prisma.menuItem.deleteMany();
  const menuItems = [
    {
      restaurantId: defaultRestaurant.id,
      name: "Garlic Bread",
      price: 7
    },
    {
      restaurantId: defaultRestaurant.id,
      name: "Rump Steak",
      price: 25
    },
    {
      restaurantId: defaultRestaurant.id,
      name: "Fish and Chips",
      price: 21.50
    },
    {
      restaurantId: defaultRestaurant.id,
      name: "Seafood Basket",
      price: 26.50
    }
  ]
  for (const menuItem of menuItems) {
    await prisma.menuItem.create({
      data: menuItem
    });
  }

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
