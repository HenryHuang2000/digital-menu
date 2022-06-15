import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });
  // Delete all existing menu items
  await prisma.menuItem.deleteMany();

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  const tables = [
    {
      id: "table-1",
      title: "table1",
    },
    {
      id: "table-2",
      title: "table2",
    },
    {
      id: "table-3",
      title: "table3",
    },
    {
      id: "table-4",
      title: "table4",
    },
  ];

  for (const table of tables) {
    await prisma.table.upsert({
      where: { id: table.id },
      update: table,
      create: table,
    });
  }

  const menuItems = [
    {
      name: "Garlic Bread",
      price: 7
    },
    {
      name: "Rump Steak",
      price: 25
    },
    {
      name: "Fish and Chips",
      price: 21.50
    },
    {
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
