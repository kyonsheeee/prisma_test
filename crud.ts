import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// *******************************************
// CRUD functions
// *******************************************
// [A]ここにCRUD関数を書く

// *******************************************
// sample data
// *******************************************
const user01: Prisma.UserCreateInput = {
  name: "Alice",
  email: "alice@prisma.io",
  posts: {
    create: { title: "Hello World" },
  },
  profile: {
    create: { bio: "I like turtles" },
  },
};

const user02: Prisma.UserCreateInput = {
  name: "Viola",
  email: "viola@prisma.io",
  posts: {
    create: { title: "Hello World!" },
  },
  profile: {
    create: { bio: "I like rabbits" },
  },
};

// *******************************************
// execute CRUD
// *******************************************
const main = async () => {
  // [B]ここにCRUD関数の呼び出し処理を書く
};

main();
