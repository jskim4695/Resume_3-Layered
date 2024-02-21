import { prisma } from "../utils/prisma/index.js";
import bcrypt from "bcrypt";

export class UsersRepository {
  registerUsers = async (email, password, name) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const registeredUsers = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return registeredUsers;
  };

  findUserByEmail = async (email) => {
    const user = await prisma.users.findUnique({
      where: { email },
    });
    return user;
  };

  comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
  };

  getUserInfo = async (userId) => {
    const user = await prisma.users.findUnique({
      where: { userId: +userId },
    });

    return user;
  };
}
