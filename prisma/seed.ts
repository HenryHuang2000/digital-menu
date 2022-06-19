import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {

  // User setup
  await prisma.user.deleteMany();
  await prisma.user.create({
    data: {
      email: "admin@remix.run",
      password: {
        create: {
          hash: await bcrypt.hash("admin", 10),
        },
      },
    },
  });

  // Restaurant setup
  await prisma.menuItem.deleteMany();
  await prisma.table.deleteMany();
  await prisma.restaurant.deleteMany();
  const restaurants = [
    { name: "McDonald's Rhodes" },
    { name: "McDonald's West Ryde" },
    { name: "McDonald's Olympic Park" },
    { name: "McDonald's Gladesville" },
    { name: "Burger Point" }
  ];
  for (const restaurant of restaurants) {
    const { id: restaurantId } = await prisma.restaurant.create({
      data: restaurant
    });

    // Table setup (Create 5 tables).
    const tables = Array.from({length: 5}, (_, i) => ({
      label: `table ${i + 1}`,
      restaurantId
    }));
    for (const table of tables) {
      await prisma.table.create({
        data: table
      });
    }

    // Menu setup.
    const menuItems = [
      {
        restaurantId,
        name: "Garlic Bread",
        price: 7
      },
      {
        restaurantId,
        name: "Rump Steak",
        price: 25
      },
      {
        restaurantId,
        name: "Fish and Chips",
        price: 21.50
      },
      {
        restaurantId,
        name: "Seafood Basket",
        price: 26.50
      }
    ]
    for (const menuItem of menuItems) {
      await prisma.menuItem.create({
        data: menuItem
      });
    }
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
