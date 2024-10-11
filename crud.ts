import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// *******************************************
// CRUD functions
// *******************************************
const create = async (rec: Prisma.UserCreateInput) => {
  try {
    await prisma.user.create({ data: rec });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        console.error("Error: A user with this email already exists.");
      } else {
        console.error("Error creating user:", error);
      }
    }
  }
};

const read = async (cond?: object) => {
  if (cond) {
    const selectedUsers = await prisma.user.findMany({
      where: cond,
      include: {
        posts: true,
        profile: true,
      },
    });
    return selectedUsers;
  } else {
    const allUsers = await prisma.user.findMany({
      include: {
        posts: true,
        profile: true,
      },
    });
    return allUsers;
  }
};

const update = async (id: number, data: object) => {
  const updateUser = await prisma.user.update({
    where: {
      id: id,
    },
    data: data,
  });
  console.dir(updateUser, { depth: null });
};

const delete_ = async (id: number) => {
  const deletePosts = prisma.post.deleteMany({
    where: {
      authorId: id,
    },
  });
  const deleteProfiles = prisma.profile.deleteMany({
    where: {
      userId: id,
    },
  });
  const deleteUser = prisma.user.delete({
    where: {
      id: id,
    },
  });

  await prisma.$transaction([deletePosts, deleteProfiles, deleteUser]);
};

// *******************************************
// sample data
// *******************************************
const user01: Prisma.UserCreateInput = {
  name: "Alice",
  email: `alice${Date.now()}@prisma.io`,
  posts: {
    create: { title: "Hello World" },
  },
  profile: {
    create: { bio: "I like turtles" },
  },
};

const user02: Prisma.UserCreateInput = {
  name: "Viola",
  email: `viola${Date.now()}@prisma.io`,
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
  // 既存データの削除(テストデータ初期化)
  await prisma.post.deleteMany({});
  await prisma.profile.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("=== Create ===");
  await create(user01);
  await create(user02);

  console.log("=== Read ===");
  let recListAll = await read();
  console.dir(recListAll, { depth: null });

  console.log("=== Read with condition ===");
  const recList: Array<any> = await read({ email: user02.email });
  console.dir(recList, { depth: null });

  console.log("=== Update ===");
  const data = {
    name: "Viola the Magnificent",
  };
  const selectedId = recList[0].id;
  await update(selectedId, data);
  recListAll = await read();
  console.dir(recListAll, { depth: null });

  console.log("===  Delete ===");
  await delete_(selectedId);
  recListAll = await read();
  console.dir(recListAll, { depth: null });
};

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
